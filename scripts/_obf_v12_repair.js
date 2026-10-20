/**
 * Repair inconsistent Layouts/Game renames from the v12 pass.
 * Keeps fragment in our identifiers; restores RN / Animated / third-party prop names.
 */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";
const gameRoot = path.join(root, "Layouts", "Game");

const SUFFIXES = [
  "Screen", "Button", "Card", "Panel", "Layer", "Strip", "Tile", "Row",
  "Controls", "Header", "Init", "Engine", "Scale", "Puzzle", "Segment",
  "Background", "Overlay", "Indicator",
];

const API_KEYS = new Set([
  "toValue", "tension", "friction", "useNativeDriver", "duration", "delay",
  "stiffness", "damping", "mass", "velocity", "bounciness", "speed",
  "iterations", "isInteraction", "overshootClamping", "restDisplacementThreshold",
  "restSpeedThreshold", "easing", "colors", "start", "end", "locations",
  "onPress", "onPressIn", "onPressOut", "onLongPress", "disabled", "style",
  "color", "size", "strokeWidth", "pointerEvents", "source", "resizeMode",
  "numberOfLines", "accessibilityRole", "accessibilityLabel", "accessibilityState",
  "hitSlop", "key", "ref",
]);

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (/\.tsx?$/.test(ent.name)) out.push(p);
  }
  return out;
}

function insertFragmentInBasename(base) {
  if (!base || base.includes(FRAG)) return base;
  if (/^(index)$/i.test(base)) return base;
  for (const suf of SUFFIXES) {
    if (base.endsWith(suf) && base.length > suf.length) {
      return `${base.slice(0, -suf.length)}${FRAG}${suf}`;
    }
  }
  const pascal = base.match(/^([A-Z][a-z0-9]*)([A-Z].*)$/);
  if (pascal) return `${pascal[1]}${FRAG}${pascal[2]}`;
  const hook = base.match(/^(use)([A-Z].*)$/);
  if (hook) {
    const rest = hook[2];
    const restPair = rest.match(/^([A-Z][a-z0-9]*)([A-Z].*)$/);
    if (restPair) return `${hook[1]}${restPair[1]}${FRAG}${restPair[2]}`;
    return `${hook[1]}${FRAG}${rest}`;
  }
  if (/^[a-z]/.test(base)) {
    const mid = Math.max(1, Math.floor(base.length / 2));
    return `${base.slice(0, mid)}${FRAG}${base.slice(mid)}`;
  }
  return `${base}${FRAG}`;
}

function insertIdent(name) {
  if (!name || name.includes(FRAG)) return name;
  if (name === "GameInit") return "GichyikowrdfpagthmsameShell";
  if (/^[A-Z0-9]+(_[A-Z0-9]+)+$/.test(name)) {
    const parts = name.split("_");
    const last = parts.pop();
    return `${parts.join("_")}_${FRAG}${last}`;
  }
  const hump = name.match(/^(.*[a-z0-9])([A-Z][A-Za-z0-9]*)$/);
  if (hump) return hump[1] + FRAG + hump[2];
  return insertFragmentInBasename(name);
}

function kind(file) {
  return file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
}

function parse(file) {
  const text = fs.readFileSync(file, "utf8");
  return {
    text,
    sf: ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind(file)),
  };
}

const files = walk(gameRoot);
const parsed = new Map(files.map((f) => [f, parse(f)]));

/** old identifier → new, only when the new form exists and matches insertIdent */
const renameMap = new Map();
for (const { sf } of parsed.values()) {
  function visit(node) {
    if (ts.isIdentifier(node) && node.text.includes(FRAG)) {
      const old = node.text.replace(FRAG, "");
      if (old && insertIdent(old) === node.text) renameMap.set(old, node.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
}

function thirdPartyNames(sf) {
  const names = new Set();
  sf.forEachChild((node) => {
    if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) return;
    const mod = node.moduleSpecifier.text;
    const external =
      mod === "react" ||
      mod === "react-native" ||
      mod.startsWith("react-native") ||
      mod.includes("lucide") ||
      mod.includes("linear-gradient") ||
      mod.includes("svg");
    if (!external) return;
    const clause = node.importClause;
    if (!clause) return;
    if (clause.name) names.add(clause.name.text);
    const b = clause.namedBindings;
    if (b && ts.isNamespaceImport(b)) names.add(b.name.text);
    if (b && ts.isNamedImports(b)) for (const el of b.elements) names.add(el.name.text);
  });
  return names;
}

function isStyleObjectContext(node) {
  let cur = node.parent;
  while (cur) {
    if (ts.isJsxAttribute(cur) && cur.name && (cur.name.text === "style" || cur.name.text === "imageStyle" || cur.name.text === "contentContainerStyle")) {
      return true;
    }
    if (ts.isCallExpression(cur)) {
      const e = cur.expression;
      if (
        ts.isPropertyAccessExpression(e) &&
        e.name.text === "create" &&
        ts.isIdentifier(e.expression) &&
        e.expression.text === "StyleSheet"
      ) {
        return true;
      }
    }
    cur = cur.parent;
  }
  return false;
}

function isDirectStyleKey(node) {
  if (!ts.isPropertyAssignment(node) && !ts.isShorthandPropertyAssignment(node)) return false;
  const obj = node.parent;
  if (!obj || !ts.isObjectLiteralExpression(obj)) return false;
  const call = obj.parent;
  if (!call || !ts.isCallExpression(call)) return false;
  const e = call.expression;
  return (
    ts.isPropertyAccessExpression(e) &&
    e.name.text === "create" &&
    ts.isIdentifier(e.expression) &&
    e.expression.text === "StyleSheet"
  );
}

function tagInfo(opening, third) {
  const tag = opening.tagName;
  if (ts.isPropertyAccessExpression(tag)) return { third: true, text: tag.getText() };
  if (ts.isIdentifier(tag)) {
    if (tag.text[0] !== tag.text[0].toUpperCase()) return { third: true, text: tag.text };
    if (third.has(tag.text)) return { third: true, text: tag.text };
    // Lucide icons passed as a prop component (Icon...)
    if (tag.text.startsWith("Icon")) return { third: true, text: tag.text };
    return { third: false, text: tag.text };
  }
  return { third: true, text: "" };
}

let editsApplied = 0;
const problems = [];

for (const file of files) {
  const { text, sf } = parsed.get(file);
  const third = thirdPartyNames(sf);
  /** @type {{start:number,end:number,text:string}[]} */
  const edits = [];

  function add(node, next) {
    const start = node.getStart(sf);
    const end = node.end;
    if (text.slice(start, end) !== node.text) return;
    if (next === node.text) return;
    edits.push({ start, end, text: next });
  }

  function visit(node) {
    if (ts.isJsxAttribute(node) && ts.isIdentifier(node.name)) {
      const opening = node.parent;
      if (opening && (ts.isJsxOpeningElement(opening) || ts.isJsxSelfClosingElement(opening))) {
        const info = tagInfo(opening, third);
        const name = node.name.text;
        if (info.third) {
          if (name.includes(FRAG)) {
            const reverted = name.replace(FRAG, "");
            add(node.name, reverted);
          }
        } else if (name !== "key" && name !== "ref" && renameMap.has(name)) {
          add(node.name, renameMap.get(name));
        }
      }
    }

    if (
      (ts.isPropertyAssignment(node) || ts.isShorthandPropertyAssignment(node)) &&
      node.name &&
      ts.isIdentifier(node.name)
    ) {
      const name = node.name.text;
      const inStyle = isStyleObjectContext(node);
      const directKey = isDirectStyleKey(node);
      if (name.includes(FRAG)) {
        const reverted = name.replace(FRAG, "");
        if (API_KEYS.has(reverted) && !directKey) add(node.name, reverted);
      } else if (ts.isShorthandPropertyAssignment(node) && renameMap.has(name)) {
        const neu = renameMap.get(name);
        if (inStyle && !directKey) {
          // expand {height} → {height: heik...} so the RN key stays
          const start = node.getStart(sf);
          const end = node.end;
          edits.push({ start, end, text: `${name}: ${neu}` });
        } else if (!inStyle) {
          add(node.name, neu);
        }
      } else if (!ts.isShorthandPropertyAssignment(node) && renameMap.has(name) && !inStyle && !API_KEYS.has(name)) {
        add(node.name, renameMap.get(name));
      }
    }

    if (ts.isIdentifier(node)) {
      const p = node.parent;
      const isNameOf =
        p &&
        ((ts.isPropertyAssignment(p) ||
          ts.isPropertySignature(p) ||
          ts.isJsxAttribute(p) ||
          ts.isShorthandPropertyAssignment(p) ||
          ts.isBindingElement(p)) &&
          p.name === node);
      // property access .chip / .primary / import names / value identifiers
      const themeName =
        p &&
        ts.isPropertyAccessExpression(p) &&
        p.name === node &&
        node.text === "name";
      if (!isNameOf && !themeName && !node.text.includes(FRAG) && renameMap.has(node.text)) {
        // don't rewrite a shorthand we already expanded (handled above)
        if (!(p && ts.isShorthandPropertyAssignment(p) && p.name === node)) {
          add(node, renameMap.get(node.text));
        }
      }
      if (
        p &&
        ts.isPropertyAccessExpression(p) &&
        p.name === node &&
        !node.text.includes(FRAG) &&
        renameMap.has(node.text) &&
        node.text !== "name"
      ) {
        add(node, renameMap.get(node.text));
      }
    }

    ts.forEachChild(node, visit);
  }
  visit(sf);

  // de-dupe overlapping edits: keep longest / first at same start
  edits.sort((a, b) => b.start - a.start || b.end - a.end);
  const used = [];
  let out = text;
  for (const ed of edits) {
    if (used.some((u) => !(ed.end <= u.start || ed.start >= u.end))) continue;
    const slice = out.slice(ed.start, ed.end);
    // after previous replacements at higher positions, this slice is still original
    if (slice === ed.text) continue;
    out = out.slice(0, ed.start) + ed.text + out.slice(ed.end);
    used.push(ed);
    editsApplied += 1;
  }
  if (out !== text) fs.writeFileSync(file, out);
}

console.log("rename map", renameMap.size, "edits", editsApplied);

// re-parse and check named imports resolve
const again = walk(gameRoot);
const exportsBy = new Map();
for (const file of again) {
  const { sf } = parse(file);
  const names = new Set();
  function addExport(name) {
    if (name) names.add(name);
  }
  sf.forEachChild((node) => {
    if (ts.isFunctionDeclaration(node) && node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) && node.name) {
      addExport(node.name.text);
    }
    if (ts.isVariableStatement(node) && node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
      for (const d of node.declarationList.declarations) {
        if (ts.isIdentifier(d.name)) addExport(d.name.text);
      }
    }
    if (
      (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isClassDeclaration(node)) &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) &&
      node.name
    ) {
      addExport(node.name.text);
    }
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      for (const el of node.exportClause.elements) addExport(el.name.text);
    }
  });
  exportsBy.set(path.normalize(file), names);
}

let badImports = 0;
for (const file of again) {
  const { sf } = parse(file);
  const dir = path.dirname(file);
  sf.forEachChild((node) => {
    if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) return;
    const spec = node.moduleSpecifier.text;
    if (!spec.startsWith(".")) return;
    const clause = node.importClause;
    if (!clause || !clause.namedBindings || !ts.isNamedImports(clause.namedBindings)) return;
    const resolvedBase = path.normalize(path.resolve(dir, spec));
    const candidates = [resolvedBase + ".ts", resolvedBase + ".tsx"];
    const target = candidates.find((c) => exportsBy.has(c));
    if (!target) {
      console.log("MISSING MODULE", path.relative(root, file), spec);
      badImports += 1;
      return;
    }
    const exp = exportsBy.get(target);
    for (const el of clause.namedBindings.elements) {
      const imported = el.propertyName ? el.propertyName.text : el.name.text;
      if (!exp.has(imported)) {
        console.log("BAD IMPORT", path.relative(root, file), imported, "from", spec);
        badImports += 1;
      }
    }
  });
}
console.log("bad named imports", badImports);

// UI string scan
let ui = 0;
for (const file of again) {
  const { sf } = parse(file);
  function isMod(node) {
    const p = node.parent;
    if (!p) return false;
    if ((ts.isImportDeclaration(p) || ts.isExportDeclaration(p)) && p.moduleSpecifier === node) return true;
    if (ts.isCallExpression(p) && ts.isIdentifier(p.expression) && p.expression.text === "require") return true;
    return false;
  }
  function visit(node) {
    if (ts.isJsxText(node) && node.getText().includes(FRAG)) {
      ui += 1;
      console.log("JSX", path.relative(root, file), node.getText().trim().slice(0, 60));
    }
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && node.text.includes(FRAG) && !isMod(node)) {
      ui += 1;
      console.log("STR", path.relative(root, file), node.text.slice(0, 80));
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
}
console.log("ui hits", ui);
if (badImports || ui) process.exitCode = 2;
