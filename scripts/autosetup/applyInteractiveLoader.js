/**
 * Mechanical pass of the interactive-loader skill for a freshly unpacked game.
 * Adds a looping bar (unless the loader already loops), tap/hold on the splash,
 * and short-lived particles. Uses colors already present in the loader file.
 */
const fs = require("node:fs/promises");
const path = require("node:path");

function newlineOf(source) {
  return source.includes("\r\n") ? "\r\n" : "\n";
}

function fingerprint(name) {
  let sum = 0;
  const text = String(name || "app");
  for (let i = 0; i < text.length; i++) sum += text.charCodeAt(i);
  return sum;
}

function colorsFrom(source) {
  const found = [];
  const re = /#[0-9A-Fa-f]{6}\b/g;
  let match;
  while ((match = re.exec(source))) {
    const hex = match[0].toUpperCase();
    if (!found.includes(hex)) found.push(hex);
    if (found.length >= 4) break;
  }
  if (!found.length) found.push("#FFD166", "#1B1B1B", "#F4F1EA");
  while (found.length < 3) found.push(found[found.length - 1]);
  return found.slice(0, 4);
}

function componentSource({ exportName, colors, showBar, appName }) {
  const fp = fingerprint(appName || exportName);
  const hints = ["Tap the mark", "Hold the crest", "Swipe the glow"];
  const hint = hints[fp % hints.length];
  const duration = 900 + (fp % 6) * 120;
  const shape = fp % 3;
  const radius = shape === 1 ? "2" : "bit.size / 2";
  const spin = shape === 2 ? "{rotate: '45deg'}" : "{scale: 1}";
  const colorList = colors.map((c) => JSON.stringify(c)).join(", ");
  return `import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';

const COLORS = [${colorList}];
const SHOW_BAR = ${showBar ? "true" : "false"};
const FILL_MS = ${duration};

type Bit = {id: number; x: number; y: number; dx: number; dy: number; size: number; color: string};

export function ${exportName}({children}: {children?: React.ReactNode}) {
  const [bits, setBits] = useState<Bit[]>([]);
  const grow = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const idRef = useRef(1);

  useEffect(() => {
    if (!SHOW_BAR) return undefined;
    let stopped = false;
    const fillOnce = () => {
      if (stopped) return;
      grow.setValue(0);
      Animated.timing(grow, {
        toValue: 1,
        duration: FILL_MS,
        useNativeDriver: false,
      }).start(({finished}) => {
        if (finished && !stopped) fillOnce();
      });
    };
    fillOnce();
    return () => {
      stopped = true;
      grow.stopAnimation();
    };
  }, [grow]);

  const spawn = (x: number, y: number) => {
    const id = idRef.current++;
    const count = 4 + (id % 4);
    const next: Bit[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      next.push({
        id: id * 20 + i,
        x,
        y,
        dx: Math.cos(angle) * (28 + (i % 3) * 10),
        dy: Math.sin(angle) * (28 + (i % 3) * 10),
        size: 6 + (i % 3) * 2,
        color: COLORS[i % COLORS.length],
      });
    }
    setBits((prev) => prev.concat(next).slice(-24));
    setTimeout(() => {
      setBits((prev) => prev.filter((bit) => Math.floor(bit.id / 20) !== id));
    }, 700);
    Animated.sequence([
      Animated.timing(scale, {toValue: 1.06, duration: 90, useNativeDriver: true}),
      Animated.timing(scale, {toValue: 1, duration: 160, useNativeDriver: true}),
    ]).start();
  };

  const fillWidth = grow.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Pressable
      style={styles.root}
      onPress={(event) => spawn(event.nativeEvent.locationX, event.nativeEvent.locationY)}
      onLongPress={(event) => spawn(event.nativeEvent.locationX, event.nativeEvent.locationY)}
      delayLongPress={220}>
      <Animated.View style={[styles.hero, {transform: [{scale}]}]}>{children}</Animated.View>
      {bits.map((bit) => (
        <View
          key={bit.id}
          pointerEvents="none"
          style={[
            styles.bit,
            {
              left: bit.x + bit.dx,
              top: bit.y + bit.dy,
              width: bit.size,
              height: bit.size,
              borderRadius: ${radius},
              backgroundColor: bit.color,
              transform: [${spin}],
            },
          ]}
        />
      ))}
      {SHOW_BAR ? (
        <View pointerEvents="none" style={styles.track}>
          <Animated.View style={[styles.fill, {width: fillWidth, backgroundColor: COLORS[0]}]} />
        </View>
      ) : null}
      <Text pointerEvents="none" style={[styles.hint, {color: COLORS[0]}]}>${hint}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  hero: {flex: 1},
  bit: {position: 'absolute'},
  track: {
    position: 'absolute',
    left: 28,
    right: 28,
    bottom: 36,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  fill: {height: '100%'},
  hint: {
    position: 'absolute',
    bottom: 48,
    alignSelf: 'center',
    fontSize: 12,
    letterSpacing: 1,
  },
});
`;
}

async function listFiles(dir, acc) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await listFiles(full, acc);
    else if (/\.(tsx|jsx)$/.test(entry.name)) acc.push(full);
  }
}

function scoreFile(filePath, source) {
  const base = path.basename(filePath);
  let score = 0;
  if (/loader|splash|loading|boot/i.test(base)) score += 6;
  if (/screens/i.test(filePath)) score += 1;
  if (/Animated|Progress|isLoading/i.test(source)) score += 2;
  return score;
}

function alreadyLooped(source) {
  return /Animated\.loop|setValue\(0\)|keeps looping|fillOnce/.test(source);
}

function findComponentFunction(ast) {
  for (const node of ast.program.body) {
    if (node.type === "ExportDefaultDeclaration") {
      if (node.declaration.type === "FunctionDeclaration") return node.declaration;
      if (node.declaration.type === "ArrowFunctionExpression") return node.declaration;
      if (
        node.declaration.type === "Identifier"
      ) {
        const name = node.declaration.name;
        return ast.program.body.find(
          (item) => item.type === "FunctionDeclaration" && item.id && item.id.name === name
        );
      }
    }
    if (
      node.type === "ExportNamedDeclaration" &&
      node.declaration &&
      node.declaration.type === "FunctionDeclaration"
    ) {
      return node.declaration;
    }
  }
  return ast.program.body.find((item) => item.type === "FunctionDeclaration") || null;
}

function isFunction(node) {
  return (
    node.type === "FunctionDeclaration" ||
    node.type === "FunctionExpression" ||
    node.type === "ArrowFunctionExpression" ||
    node.type === "ObjectMethod" ||
    node.type === "ClassMethod"
  );
}

function collectJsxReturns(fnNode) {
  const found = [];
  const walk = (node, depth) => {
    if (!node || typeof node !== "object") return;
    const nextDepth = node !== fnNode && isFunction(node) ? depth + 1 : depth;
    if (node.type === "ReturnStatement" && depth === 0 && node.argument) {
      let target = node.argument;
      if (target.type === "ParenthesizedExpression") target = target.expression;
      if (target.type === "JSXElement" || target.type === "JSXFragment") found.push(target);
    }
    if (node === fnNode) {
      walk(node.body, 0);
      return;
    }
    for (const key of Object.keys(node)) {
      if (key === "loc" || key === "range") continue;
      const value = node[key];
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item && typeof item.type === "string") walk(item, nextDepth);
        }
      } else if (value && typeof value.type === "string") walk(value, nextDepth);
    }
  };
  walk(fnNode, 0);
  return found;
}

async function applyInteractiveLoader(rootPath, { fragment, appName }) {
  const files = [];
  await listFiles(path.join(rootPath, "Layouts", "Game"), files);
  await listFiles(path.join(rootPath, "Layouts", "Placeholder"), files);
  let best = null;
  let hasLoop = false;
  let hasTap = false;
  for (const filePath of files) {
    const source = await fs.readFile(filePath, "utf8");
    if (alreadyLooped(source)) hasLoop = true;
    if (/onPress|burst|particle/i.test(source)) hasTap = true;
    const score = scoreFile(filePath, source);
    if (!best || score > best.score) best = { filePath, source, score };
  }
  if (hasLoop && hasTap) {
    return { ok: true, details: "interactive loader уже есть в Layouts/Game" };
  }
  if (!best || best.score < 6) {
    return { ok: true, details: "loader screen не найден — шаг пропущен" };
  }
  const frag = String(fragment || "app").replace(/[^A-Za-z0-9]/g, "") || "app";
  const exportName = `Idle${frag}LoaderLayer`;
  if (best.source.includes(exportName) || best.source.includes("interactive-loader:applied")) {
    return { ok: true, details: `interactive loader уже подключён (${path.basename(best.filePath)})` };
  }

  const parser = require(require.resolve("@babel/parser", { paths: [rootPath, __dirname] }));
  let ast;
  try {
    ast = parser.parse(best.source, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });
  } catch (error) {
    return {
      ok: false,
      details: `${path.basename(best.filePath)} не разобран: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
  const fn = findComponentFunction(ast);
  if (!fn) return { ok: false, details: `${path.basename(best.filePath)}: нет компонента для обёртки` };
  const returns = collectJsxReturns(fn);
  if (!returns.length) {
    return { ok: false, details: `${path.basename(best.filePath)}: нет JSX return` };
  }

  const nl = newlineOf(best.source);
  let next = best.source;
  const ordered = [...returns].sort((a, b) => b.start - a.start);
  for (const jsx of ordered) {
    const inner = next.slice(jsx.start, jsx.end);
    const wrapped = `<${exportName}>${nl}${inner}${nl}</${exportName}>`;
    next = next.slice(0, jsx.start) + wrapped + next.slice(jsx.end);
  }
  const importLine = `import {${exportName}} from './IDLE_PATH';`;
  const lastImport = [...ast.program.body].reverse().find((node) => node.type === "ImportDeclaration");
  const importAt = lastImport ? lastImport.end : 0;
  const componentPath = path.join(
    rootPath,
    "Layouts",
    "Game",
    "components",
    `${exportName}.tsx`
  );
  const rel = path
    .relative(path.dirname(best.filePath), componentPath)
    .replace(/\\/g, "/")
    .replace(/\.tsx$/, "");
  const importPath = rel.startsWith(".") ? rel : `./${rel}`;
  const resolvedImport = importLine.replace("./IDLE_PATH", importPath);
  next = next.slice(0, importAt) + `${nl}${resolvedImport}` + next.slice(importAt);
  next = next.replace(resolvedImport, `${resolvedImport}${nl}/* interactive-loader:applied */`);

  try {
    parser.parse(next, { sourceType: "module", plugins: ["typescript", "jsx"] });
  } catch (error) {
    return {
      ok: false,
      details: `обёртка loader не разбирается: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  const showBar = !alreadyLooped(best.source);
  const component = componentSource({
    exportName,
    colors: colorsFrom(best.source),
    showBar,
    appName: appName || frag,
  });
  await fs.mkdir(path.dirname(componentPath), { recursive: true });
  await fs.writeFile(componentPath, component, "utf8");
  await fs.writeFile(best.filePath, next, "utf8");
  return {
    ok: true,
    details: `${path.relative(rootPath, best.filePath)} + ${path.relative(rootPath, componentPath)}` +
      (showBar ? " (bar loops)" : " (bar already loops)"),
  };
}

module.exports = { applyInteractiveLoader, componentSource };
