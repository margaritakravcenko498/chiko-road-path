/**
 * One-shot: Layouts/Game fragment renames + obfuscation-batch v15.
 * Deleted after a successful run.
 */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";
const gameRoot = path.join(root, "Layouts", "Game");
const servicesRoot = path.join(root, "services");

const SUFFIXES = [
  "Screen", "Button", "Card", "Panel", "Layer", "Strip", "Tile", "Row",
  "Controls", "Header", "Init", "Engine", "Scale", "Puzzle", "Segment",
  "Background", "Overlay", "Indicator", "Badge", "Gauge", "Pill", "Shell",
  "Field", "Backdrop", "Planner", "Backstop",
];

const API_KEYS = new Set([
  "toValue", "tension", "friction", "useNativeDriver", "duration", "delay",
  "stiffness", "damping", "mass", "velocity", "bounciness", "speed",
  "iterations", "isInteraction", "overshootClamping", "restDisplacementThreshold",
  "restSpeedThreshold", "easing", "colors", "start", "end", "locations",
  "onPress", "onPressIn", "onPressOut", "onLongPress", "disabled", "style",
  "color", "size", "strokeWidth", "pointerEvents", "source", "resizeMode",
  "numberOfLines", "accessibilityRole", "accessibilityLabel", "accessibilityHint",
  "accessibilityState", "hitSlop", "key", "ref", "finished", "width", "height",
  "flex", "opacity", "transform", "translateX", "translateY", "rotate", "scale",
  "stroke", "fill", "d", "cx", "cy", "r", "x", "y", "points", "strokeDasharray",
  "fontSize", "fontWeight", "lineHeight", "letterSpacing", "textAlign",
  "alignItems", "justifyContent", "flexDirection", "position", "overflow",
  "borderRadius", "marginTop", "paddingTop", "paddingBottom", "gap",
]);

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (/\.tsx?$/.test(ent.name) && !ent.name.endsWith(".d.ts")) out.push(p);
  }
  return out;
}

function insertFragmentInBasename(base, fragment) {
  if (!base || !fragment || base.includes(fragment)) return base;
  if (/^(index)$/i.test(base)) return base;
  for (const suf of SUFFIXES) {
    if (base.endsWith(suf) && base.length > suf.length) {
      return `${base.slice(0, -suf.length)}${fragment}${suf}`;
    }
  }
  const pascal = base.match(/^([A-Z][a-z0-9]*)([A-Z].*)$/);
  if (pascal) return `${pascal[1]}${fragment}${pascal[2]}`;
  const hook = base.match(/^(use)([A-Z].*)$/);
  if (hook) {
    const rest = hook[2];
    const restPair = rest.match(/^([A-Z][a-z0-9]*)([A-Z].*)$/);
    if (restPair) return `${hook[1]}${restPair[1]}${fragment}${restPair[2]}`;
    return `${hook[1]}${fragment}${rest}`;
  }
  if (/^[a-z]/.test(base)) {
    const mid = Math.max(1, Math.floor(base.length / 2));
    return `${base.slice(0, mid)}${fragment}${base.slice(mid)}`;
  }
  return `${base}${fragment}`;
}

function insertIdent(name) {
  if (!name || name.includes(FRAG)) return name;
  if (name === "GameInit") return "GichyikowrdfpagthmsameShell";
  if (name === "doneOnFirstCycle") return "dichyikowrdfpagthmsoneOnFirstCycle";
  if (name === "startAtMenu") return "startAtichyikowrdfpagthmsMenu";
  if (/^[A-Z0-9]+(_[A-Z0-9]+)+$/.test(name)) {
    const parts = name.split("_");
    const last = parts.pop();
    return `${parts.join("_")}_${FRAG}${last}`;
  }
  const hump = name.match(/^(.*[a-z0-9])([A-Z][A-Za-z0-9]*)$/);
  if (hump) return hump[1] + FRAG + hump[2];
  return insertFragmentInBasename(name, FRAG);
}

function newStem(stem) {
  if (stem.includes(FRAG) || /^index$/i.test(stem)) return stem;
  if (stem === "GameInit") return "GichyikowrdfpagthmsameShell";
  const part = stem.match(/^(.*)(Part\d+)$/);
  if (part) return insertIdent(part[1]) + part[2];
  return insertIdent(stem);
}

function scriptKind(file) {
  return file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
}

function parse(file, text) {
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKind(file));
}

function isPropertyNameIdent(node) {
  const p = node.parent;
  if (!p) return false;
  if (
    (ts.isPropertyAssignment(p) ||
      ts.isPropertySignature(p) ||
      ts.isPropertyDeclaration(p) ||
      ts.isMethodSignature(p) ||
      ts.isMethodDeclaration(p) ||
      ts.isEnumMember(p) ||
      ts.isPropertyAccessExpression(p) ||
      ts.isBindingElement(p) ||
      ts.isJsxAttribute(p)) &&
    p.name === node
  ) {
    return true;
  }
  if (ts.isShorthandPropertyAssignment(p) && p.name === node) return true;
  return false;
}

function isDirectStyleSheetKey(propNode) {
  const obj = propNode.parent;
  if (!obj || !ts.isObjectLiteralExpression(obj)) return false;
  const call = obj.parent;
  if (!call || !ts.isCallExpression(call)) return false;
  const expr = call.expression;
  return (
    ts.isPropertyAccessExpression(expr) &&
    expr.name.text === "create" &&
    ts.isIdentifier(expr.expression) &&
    expr.expression.text === "StyleSheet"
  );
}

function moduleSpecOf(node) {
  let cur = node;
  while (cur && !ts.isImportDeclaration(cur) && !ts.isExportDeclaration(cur)) cur = cur.parent;
  if (!cur || !cur.moduleSpecifier || !ts.isStringLiteral(cur.moduleSpecifier)) return "";
  return cur.moduleSpecifier.text;
}

function isPropsParam(param) {
  if (!param || !param.type) return false;
  if (ts.isTypeLiteralNode(param.type)) return true;
  if (ts.isTypeReferenceNode(param.type) && ts.isIdentifier(param.type.typeName)) {
    return /Props$/.test(param.type.typeName.text);
  }
  return false;
}

function jsxTagText(attr) {
  let cur = attr.parent;
  while (cur && !ts.isJsxOpeningElement(cur) && !ts.isJsxSelfClosingElement(cur)) cur = cur.parent;
  if (!cur || !cur.tagName) return "";
  const tag = cur.tagName;
  if (ts.isIdentifier(tag)) return tag.text;
  return "";
}

const RESERVED_PROPS = new Set(["children", "key", "ref"]);
/** @type {Map<string, Map<string, Set<string>>>} */
const propsByFile = new Map();

function resolveRel(fromFile, spec) {
  if (!spec.startsWith(".")) return "";
  const abs = path.resolve(path.dirname(fromFile), spec);
  for (const ext of [".ts", ".tsx"]) {
    const c = abs + ext;
    if (fs.existsSync(c)) return path.normalize(c);
  }
  return "";
}

function recordProps(file, exportKey, set) {
  const norm = path.normalize(file);
  if (!propsByFile.has(norm)) propsByFile.set(norm, new Map());
  const m = propsByFile.get(norm);
  if (!m.has(exportKey)) m.set(exportKey, set);
}

function indexDefaultExports(file, sf) {
  const map = propsByFile.get(path.normalize(file));
  if (!map) return;
  sf.forEachChild((node) => {
    if (!ts.isExportAssignment(node)) return;
    const expr = node.expression;
    if (ts.isIdentifier(expr) && map.has(expr.text)) {
      map.set("default", map.get(expr.text));
    } else if (ts.isCallExpression(expr)) {
      for (const arg of expr.arguments) {
        if (ts.isIdentifier(arg) && map.has(arg.text)) map.set("default", map.get(arg.text));
      }
    }
  });
}

function collectDeclaredNames(sf) {
  const names = new Set();
  function visit(node) {
    if (node.name && ts.isIdentifier(node.name)) names.add(node.name.text);
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return names;
}

function collectFileModel(file, sf) {
  const bindings = new Set();
  const propNames = new Set();
  const styleKeys = new Set();
  const ourTags = new Set();
  const declared = collectDeclaredNames(sf);
  /** @type {Map<string, Set<string>>} */
  const tagProps = new Map();

  function addBinding(name) {
    if (!name || name.includes(FRAG) || name.length < 2) return;
    if (name === "default") return;
    const next = insertIdent(name);
    if (!next || next === name || declared.has(next)) return;
    bindings.add(name);
  }

  function addProp(name) {
    if (!name || name.includes(FRAG) || name.length < 2) return;
    const next = insertIdent(name);
    if (!next || next === name || declared.has(next)) return;
    propNames.add(name);
  }

  sf.forEachChild((node) => {
    if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) return;
    const mod = node.moduleSpecifier.text;
    if (!mod.startsWith(".")) return;
    const clause = node.importClause;
    if (!clause) return;
    if (clause.name) {
      addBinding(clause.name.text);
      if (/^[A-Z]/.test(clause.name.text)) ourTags.add(clause.name.text);
    }
    const b = clause.namedBindings;
    if (b && ts.isNamedImports(b)) {
      for (const el of b.elements) {
        addBinding(el.name.text);
        if (/^[A-Z]/.test(el.name.text)) ourTags.add(el.name.text);
      }
    }
  });

  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.name) {
      addBinding(node.name.text);
      if (/^[A-Z]/.test(node.name.text)) ourTags.add(node.name.text);
      for (const p of node.parameters) {
        if (isPropsParam(p) && ts.isObjectBindingPattern(p.name)) {
          const set = tagProps.get(node.name.text) || new Set();
          for (const el of p.name.elements) {
            if (ts.isIdentifier(el.name)) {
              addBinding(el.name.text);
              addProp(el.name.text);
              set.add(el.name.text);
            }
          }
          tagProps.set(node.name.text, set);
          recordProps(file, node.name.text, set);
        } else if (ts.isIdentifier(p.name)) addBinding(p.name.text);
      }
    }
    if (ts.isClassDeclaration(node) && node.name) addBinding(node.name.text);
    if (ts.isInterfaceDeclaration(node)) addBinding(node.name.text);
    if (ts.isTypeAliasDeclaration(node)) addBinding(node.name.text);
    if (ts.isEnumDeclaration(node)) addBinding(node.name.text);
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      addBinding(node.name.text);
      if (/^[A-Z]/.test(node.name.text)) ourTags.add(node.name.text);
    }
    if (ts.isParameter(node) && ts.isIdentifier(node.name)) addBinding(node.name.text);
    if (
      (ts.isPropertyAssignment(node) || ts.isShorthandPropertyAssignment(node)) &&
      node.name &&
      ts.isIdentifier(node.name) &&
      isDirectStyleSheetKey(node)
    ) {
      const n = node.name.text;
      if (n && !n.includes(FRAG) && insertIdent(n) !== n) styleKeys.add(n);
    }
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      ts.isCallExpression(node.initializer)
    ) {
      const call = node.initializer;
      const callee = call.expression;
      const isMemo =
        (ts.isIdentifier(callee) && callee.text === "memo") ||
        (ts.isPropertyAccessExpression(callee) && callee.name.text === "memo");
      if (isMemo && call.arguments.length && ts.isIdentifier(call.arguments[0])) {
        const inner = call.arguments[0].text;
        const props = tagProps.get(inner);
        if (props) tagProps.set(node.name.text, props);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);

  return { bindings, propNames, styleKeys, ourTags, tagProps };
}

function applyIdentifierRenames(file, text, globalBindings) {
  const sf = parse(file, text);
  const model = collectFileModel(file, sf);
  const importProps = new Map();
  sf.forEachChild((node) => {
    if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) return;
    const spec = node.moduleSpecifier.text;
    if (!spec.startsWith(".")) return;
    const resolved = resolveRel(file, spec);
    const map = propsByFile.get(resolved);
    if (!map) return;
    const clause = node.importClause;
    if (!clause) return;
    if (clause.name && map.get("default")) importProps.set(clause.name.text, map.get("default"));
    const b = clause.namedBindings;
    if (b && ts.isNamedImports(b)) {
      for (const el of b.elements) {
        const exported = el.propertyName && ts.isIdentifier(el.propertyName) ? el.propertyName.text : el.name.text;
        if (map.has(exported)) importProps.set(el.name.text, map.get(exported));
      }
    }
  });
  const edits = [];

  function jsxOpening(node) {
    const p = node.parent;
    if (p && (ts.isJsxOpeningElement(p) || ts.isJsxSelfClosingElement(p)) && p.name === node) return p;
    return null;
  }

  function visit(node) {
    if (ts.isIdentifier(node)) {
      const raw = node.text;
      const next = insertIdent(raw);
      if (next !== raw && !raw.includes(FRAG)) {
        const parent = node.parent;
        let mode = "";
        if (parent && ts.isJsxAttribute(parent) && parent.name === node) {
          const tag = jsxTagText(parent);
          const props = model.tagProps.get(tag) || importProps.get(tag);
          if (props && props.has(raw) && !RESERVED_PROPS.has(raw)) mode = "rename";
        } else if (parent && ts.isBindingElement(parent) && parent.name === node && !parent.propertyName) {
          const pat = parent.parent;
          const param = pat && pat.parent;
          if (param && ts.isParameter(param) && isPropsParam(param)) {
            mode = RESERVED_PROPS.has(raw) ? "expand" : "rename";
          }
        } else if (parent && ts.isPropertySignature(parent) && parent.name === node) {
          const typeLit = parent.parent;
          const owner = typeLit && typeLit.parent;
          const isPropsAlias =
            owner && ts.isTypeAliasDeclaration(owner) && /Props$/.test(owner.name.text);
          const isParamType = owner && ts.isParameter(owner);
          if (
            (isPropsAlias || isParamType) &&
            model.propNames.has(raw) &&
            !RESERVED_PROPS.has(raw)
          ) {
            mode = "rename";
          }
        } else if (
          (ts.isPropertyAssignment(parent) || ts.isShorthandPropertyAssignment(parent)) &&
          parent.name === node &&
          isDirectStyleSheetKey(parent)
        ) {
          mode = "rename";
        } else if (
          ts.isPropertyAccessExpression(parent) &&
          parent.name === node &&
          ts.isIdentifier(parent.expression) &&
          parent.expression.text === "styles"
        ) {
          if (model.styleKeys.has(raw)) mode = "rename";
        } else if (ts.isShorthandPropertyAssignment(parent) && parent.name === node) {
          if (globalBindings.has(raw) || model.bindings.has(raw)) mode = "expand";
        } else if (!isPropertyNameIdent(node)) {
          if (globalBindings.has(raw) || model.bindings.has(raw)) mode = "rename";
        }

        if (mode === "rename") {
          edits.push({ start: node.getStart(sf), end: node.end, text: next });
        } else if (mode === "expand") {
          edits.push({ start: node.getStart(sf), end: node.end, text: `${raw}: ${next}` });
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);

  edits.sort((a, b) => b.start - a.start);
  let out = text;
  for (const ed of edits) {
    const slice = out.slice(ed.start, ed.end);
    if (slice.includes(FRAG)) continue;
    out = out.slice(0, ed.start) + ed.text + out.slice(ed.end);
  }
  return out;
}

function renameFilesAndSpecifiers(gameFiles) {
  const map = new Map();
  for (const file of gameFiles) {
    const ext = path.extname(file);
    const stem = path.basename(file, ext);
    const next = newStem(stem);
    if (next === stem) continue;
    const target = path.join(path.dirname(file), next + ext);
    if (fs.existsSync(target) && path.normalize(target) !== path.normalize(file)) {
      console.log("skip collision", path.basename(file), "->", path.basename(target));
      continue;
    }
    map.set(path.normalize(file), target);
  }

  const projectFiles = [];
  function walkProject(dir) {
    if (!fs.existsSync(dir)) return;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ent.name === "node_modules" || ent.name === ".git" || ent.name === "scripts") continue;
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walkProject(p);
      else if (/\.(tsx?|jsx?)$/.test(ent.name)) projectFiles.push(p);
    }
  }
  walkProject(root);

  const specRe = /(from\s+|import\s*\(\s*|require\s*\(\s*)(['"])([^'"]+)\2/g;
  let specUpdates = 0;
  for (const file of projectFiles) {
    const text = fs.readFileSync(file, "utf8");
    const dir = path.dirname(file);
    let changed = false;
    const next = text.replace(specRe, (full, pre, q, spec) => {
      if (!spec.startsWith(".")) return full;
      if (spec.includes("/assets/") || spec.endsWith("/assets")) return full;
      const resolved = path.normalize(path.resolve(dir, spec));
      const candidates = [resolved + ".ts", resolved + ".tsx"];
      for (const c of candidates) {
        const hit = map.get(path.normalize(c));
        if (hit) {
          let rel = path.relative(dir, hit).replace(/\\/g, "/").replace(/\.tsx?$/, "");
          if (!rel.startsWith(".")) rel = "./" + rel;
          changed = true;
          specUpdates += 1;
          return pre + q + rel + q;
        }
      }
      return full;
    });
    if (changed) fs.writeFileSync(file, next);
  }

  const jobs = [...map.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of jobs) fs.renameSync(from, to);
  return { renamed: jobs.length, specUpdates };
}

function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mix32(x) {
  x = x >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d) >>> 0;
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b) >>> 0;
  return (x ^ (x >>> 16)) >>> 0;
}

function lit(seed, salt, lo, span) {
  return (mix32(seed ^ Math.imul(salt, 0x9e3779b9)) % span) + lo;
}

function seedStr(seed) {
  const alph = "bdfghjkmnpqrstvwz23456789";
  const len = 2 + (seed % 3);
  let s = "";
  let x = seed >>> 0;
  for (let i = 0; i < len; i++) {
    x = mix32(x ^ Math.imul(i + 1, 0x85ebca6b));
    s += alph[x % alph.length];
  }
  return s;
}

function seedArr(seed) {
  const a = [];
  let x = seed >>> 0;
  for (let i = 0; i < 3; i++) {
    x = mix32(x ^ Math.imul(i + 3, 0xc2b2ae35));
    a.push((x % 29) + 2);
  }
  if (a[0] === 1 && a[1] === 3 && a[2] === 5) a[2] = 8;
  return a;
}

function helperSlug(file) {
  const stem = path.basename(file).replace(/\.tsx?$/, "");
  const clean = stem.replace(/[^A-Za-z0-9_]/g, "_");
  if (clean.includes(FRAG)) return clean;
  return FRAG + clean.charAt(0).toUpperCase() + clean.slice(1);
}

function isHelperName(name) {
  if (!name) return false;
  return /ObfV\d+/.test(name) || /(MixSeed|FoldRange|ClampSpan|HashMix|SumOdds|ClampMod|ShiftXor|ByteFold)$/.test(name);
}

function functionLikeName(node) {
  if (node.name && ts.isIdentifier(node.name)) return node.name.text;
  const p = node.parent;
  if (p && ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) return p.name.text;
  if (p && ts.isPropertyAssignment(p) && p.name && ts.isIdentifier(p.name)) return p.name.text;
  return "";
}

function isFunctionLike(node) {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isConstructorDeclaration(node) ||
    ts.isGetAccessor(node) ||
    ts.isSetAccessor(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node)
  );
}

const SHAPE_TAGS = ["HashMix", "SumOdds", "ClampMod", "ShiftXor", "ByteFold"];

function buildBatch(slug, seed) {
  let count = 1 + (seed % 4);
  const start = seed % 5;
  const shapes = [];
  for (let i = 0; i < count; i++) shapes.push((start + i) % 5);
  if (!shapes.some((s) => s !== 2)) shapes[0] = 3;

  const helpers = [];
  const calls = [];
  shapes.forEach((shape, idx) => {
    const salt = idx + 1;
    const name = `${slug}ObfV15${SHAPE_TAGS[shape]}`;
    const mul = lit(seed, salt * 11, 3, 41);
    const mod = lit(seed, salt * 13, 113, 700);
    const init = lit(seed, salt * 17, 2, 90);
    const shift = lit(seed, salt * 19, 1, 7);
    const mask = lit(seed, salt * 23, 255, 65000);
    const xor = lit(seed, salt * 29, 3, 240);
    const str = seedStr(mix32(seed ^ salt));
    const arr = seedArr(mix32(seed ^ (salt * 7)));
    const n1 = lit(seed, salt * 31, 2, 80);
    const n2 = lit(seed, salt * 37, 2, 80);
    if (shape === 0) {
      helpers.push(
        `function ${name}(s: string): number {\n  let h = ${init};\n  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * ${mul}) % ${mod};\n  return h;\n}`,
      );
      calls.push(`void ${name}('${str}');`);
    } else if (shape === 1) {
      helpers.push(
        `function ${name}(nums: number[]): number {\n  let acc = ${init};\n  for (let i = 0; i < nums.length; i++) {\n    const n = nums[i];\n    if ((n & 1) === 0) continue;\n    acc = (acc + n * ${mul}) % ${mod};\n  }\n  return acc;\n}`,
      );
      calls.push(`void ${name}([${arr.join(", ")}]);`);
    } else if (shape === 2) {
      const rad = lit(seed, salt * 41, 5, 60);
      const lo = lit(seed, salt * 43, 1, 9);
      helpers.push(
        `function ${name}(n: number, m: number): number {\n  const span = (m % ${rad}) + ${lo};\n  const x = n % span;\n  return x < 0 ? x + span : x;\n}`,
      );
      calls.push(`void ${name}(${n1}, ${n2});`);
    } else if (shape === 3) {
      helpers.push(
        `function ${name}(n: number, k: number): number {\n  const x = (n ^ k) << ${shift};\n  return (x ^ ${xor}) & ${mask};\n}`,
      );
      calls.push(`void ${name}(${n1}, ${n2});`);
    } else {
      helpers.push(
        `function ${name}(s: string): number {\n  let x = ${init};\n  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * ${mul}) ^ ${xor};\n  return x & ${mask};\n}`,
      );
      calls.push(`void ${name}('${str}');`);
    }
  });
  return { helpers, calls };
}

function isExportedFn(node) {
  return (node.modifiers || []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
}

function helperNodeSet(sf) {
  const set = new Set();
  const uses = new Map();
  const decls = [];
  function visit(node) {
    if (isFunctionLike(node) && isHelperName(functionLikeName(node))) set.add(node);
    if (ts.isFunctionDeclaration(node) && node.name) decls.push(node);
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const rec = uses.get(node.expression.text) || { v: 0, o: 0 };
      if (node.parent && ts.isVoidExpression(node.parent)) rec.v += 1;
      else rec.o += 1;
      uses.set(node.expression.text, rec);
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  for (const node of decls) {
    if (isExportedFn(node)) continue;
    const u = uses.get(node.name.text);
    if (u && u.v > 0 && u.o === 0) set.add(node);
  }
  return set;
}

function insideHelper(node, helpers) {
  let cur = node.parent;
  while (cur) {
    if (helpers.has(cur)) return true;
    cur = cur.parent;
  }
  return false;
}

function stripHelperVoids(file, text) {
  const sf = parse(file, text);
  const helpers = helperNodeSet(sf);
  const ranges = [];
  function visit(node) {
    if (
      ts.isExpressionStatement(node) &&
      ts.isVoidExpression(node.expression) &&
      ts.isCallExpression(node.expression.expression)
    ) {
      let cur = node.parent;
      while (cur) {
        if (helpers.has(cur)) {
          ranges.push({ start: node.getFullStart(), end: node.end });
          break;
        }
        cur = cur.parent;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  ranges.sort((a, b) => b.start - a.start);
  let out = text;
  for (const r of ranges) out = out.slice(0, r.start) + out.slice(r.end);
  return out;
}

function indentAt(text, pos) {
  const lineStart = text.lastIndexOf("\n", pos - 1) + 1;
  const m = text.slice(lineStart, pos).match(/^[ \t]*/);
  return m ? m[0] : "";
}

function bodyHasFunction(body) {
  let found = false;
  function visit(node) {
    if (found) return;
    if (isFunctionLike(node)) {
      found = true;
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(body);
  return found;
}

function injectV15(file) {
  let text = fs.readFileSync(file, "utf8");
  if (text.includes("obfuscation-batch:v15")) return { injected: 0, callers: 0, skipped: true };
  text = stripHelperVoids(file, text);
  const slug = helperSlug(file);
  const seed = fnv1a(`${FRAG}|${slug}|v15`);
  const batch = buildBatch(slug, seed);
  const marker = batch.calls[0];
  let callers = 0;

  for (let guard = 0; guard < 12; guard++) {
    const sf = parse(file, text);
    const helpers = helperNodeSet(sf);
    const edits = [];
    function visit(node) {
      if (!isFunctionLike(node) || !node.body) {
        ts.forEachChild(node, visit);
        return;
      }
      if (helpers.has(node) || insideHelper(node, helpers)) {
        ts.forEachChild(node, visit);
        return;
      }
      if (!ts.isBlock(node.body) && !bodyHasFunction(node.body)) {
        const expr = text.slice(node.body.getStart(sf), node.body.end);
        const base = indentAt(text, node.body.getStart(sf));
        const inner = batch.calls.map((l) => base + "  " + l).join("\n");
        edits.push({
          start: node.body.getStart(sf),
          end: node.body.end,
          text: `{\n${inner}\n${base}  return ${expr};\n${base}}`,
        });
      }
      ts.forEachChild(node, visit);
    }
    visit(sf);
    if (!edits.length) break;
    edits.sort((a, b) => b.start - a.start);
    for (const ed of edits) text = text.slice(0, ed.start) + ed.text + text.slice(ed.end);
  }

  const sf = parse(file, text);
  const helpers = helperNodeSet(sf);
  const spots = [];
  function visitBlocks(node) {
    if (
      isFunctionLike(node) &&
      node.body &&
      ts.isBlock(node.body) &&
      !helpers.has(node) &&
      !insideHelper(node, helpers)
    ) {
      const bodyText = node.body.getText(sf);
      if (!bodyText.includes(marker)) {
        const body = node.body;
        const stmt = body.statements[0];
        let indent = "  ";
        let at = body.getStart(sf) + 1;
        if (stmt) {
          at = stmt.getFullStart();
          const stmtPos = stmt.getStart(sf);
          const m = text.slice(text.lastIndexOf("\n", stmtPos - 1) + 1, stmtPos).match(/^[ \t]*/);
          indent = m ? m[0] : "  ";
        } else {
          const brace = body.getStart(sf);
          indent = indentAt(text, brace) + "  ";
          at = brace + 1;
        }
        spots.push({ at, indent });
      }
      callers += 1;
    }
    ts.forEachChild(node, visitBlocks);
  }
  visitBlocks(sf);

  spots.sort((a, b) => b.at - a.at);
  for (const spot of spots) {
    const payload = batch.calls.map((l) => spot.indent + l).join("\n") + "\n";
    text = text.slice(0, spot.at) + payload + text.slice(spot.at);
  }
  const block = `\n/* obfuscation-batch:v15 */\n${batch.helpers.join("\n")}\n`;
  if (callers === 0) text = text.replace(/\s*$/, "") + block + batch.calls.join("\n") + "\n";
  else text = text.replace(/\s*$/, "") + block;
  fs.writeFileSync(file, text);
  return { injected: 1, callers, skipped: false, calls: batch.calls, slug };
}

function scanUi(file, beforeStrings) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  const hits = [];
  function isModuleSpec(node) {
    const p = node.parent;
    if (!p) return false;
    if ((ts.isImportDeclaration(p) || ts.isExportDeclaration(p)) && p.moduleSpecifier === node) return true;
    if (ts.isCallExpression(p) && ts.isIdentifier(p.expression) && p.expression.text === "require") return true;
    return false;
  }
  function visit(node) {
    if (ts.isJsxText(node) && node.getText().includes(FRAG)) {
      hits.push(node.getText().trim().slice(0, 100));
    }
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && node.text.includes(FRAG) && !isModuleSpec(node)) {
      if (!beforeStrings.has(node.text)) hits.push(node.text.slice(0, 100));
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return hits;
}

function collectStrings(file) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  const set = new Set();
  function visit(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) set.add(node.text);
    if (ts.isJsxText(node)) set.add(node.getText());
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return set;
}

function verifyFile(file) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  const problems = [];
  if (sf.parseDiagnostics && sf.parseDiagnostics.length) {
    problems.push(`parse ${sf.parseDiagnostics.length}`);
  }
  const slug = helperSlug(file);
  const seed = fnv1a(`${FRAG}|${slug}|v15`);
  const batch = buildBatch(slug, seed);
  const helpers = helperNodeSet(sf);
  let callers = 0;
  function visit(node) {
    if (isFunctionLike(node) && node.body && ts.isBlock(node.body)) {
      const name = functionLikeName(node);
      const body = node.body.getText();
      if (helpers.has(node) || isHelperName(name)) {
        if (name.includes("ObfV15") && body.includes("void ")) problems.push(`void inside ${name}`);
      } else if (!insideHelper(node, helpers)) {
        callers += 1;
        for (const c of batch.calls) {
          if (!body.includes(c)) problems.push(`missing ${c} in ${name || "<anon>"}`);
        }
      }
    } else if (
      isFunctionLike(node) &&
      node.body &&
      !ts.isBlock(node.body) &&
      !helpers.has(node) &&
      !insideHelper(node, helpers)
    ) {
      problems.push(`expr body left in ${functionLikeName(node) || "<anon>"}`);
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  for (const h of batch.helpers) {
    const nm = h.match(/function (\w+)/)[1];
    if (!text.includes(`function ${nm}`)) problems.push(`missing ${nm}`);
    const fn = text.split(`function ${nm}`)[1] || "";
    const body = fn.slice(0, fn.indexOf("\nfunction "));
    if (/\bvoid\s+/.test(body)) problems.push(`void inside helper ${nm}`);
  }
  if (callers === 0) {
    for (const c of batch.calls) {
      if (!text.includes(c)) problems.push(`missing module ${c}`);
    }
  }
  return problems;
}

function patchGameInit() {
  const file = path.join(gameRoot, "GameInit.tsx");
  if (!fs.existsSync(file)) return;
  let text = fs.readFileSync(file, "utf8");
  if (text.includes("startAtMenu") || text.includes("startAtichyikowrdfpagthmsMenu")) return;
  const from = "function App(): React.JSX.Element {\r\n  const [screen, setScreen] = useState<Screen>('loader');";
  const fromLf = "function App(): React.JSX.Element {\n  const [screen, setScreen] = useState<Screen>('loader');";
  const to = "function App({startAtMenu = false}: {startAtMenu?: boolean} = {}): React.JSX.Element {\n  const [screen, setScreen] = useState<Screen>(startAtMenu ? 'menu' : 'loader');";
  if (text.includes(from)) text = text.replace(from, to);
  else if (text.includes(fromLf)) text = text.replace(fromLf, to);
  else {
    console.log("GameInit patch skipped");
    return;
  }
  fs.writeFileSync(file, text);
  console.log("GameInit startAtMenu patched");
}

// --- run ---
patchGameInit();
const gameBefore = walk(gameRoot);
const beforeStrings = new Set();
for (const f of gameBefore) for (const s of collectStrings(f)) beforeStrings.add(s);

const globalBindings = new Set();
for (const file of gameBefore) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  const model = collectFileModel(file, sf);
  indexDefaultExports(file, sf);
  for (const n of model.bindings) globalBindings.add(n);
}

let identFiles = 0;
for (const file of gameBefore) {
  const text = fs.readFileSync(file, "utf8");
  const out = applyIdentifierRenames(file, text, globalBindings);
  if (out !== text) {
    fs.writeFileSync(file, out);
    identFiles += 1;
  }
}
console.log("identifier files", identFiles, "bindings", globalBindings.size);

const renamed = renameFilesAndSpecifiers(walk(gameRoot));
console.log("renamed", renamed.renamed, "specs", renamed.specUpdates);

const targets = [...walk(servicesRoot), ...walk(gameRoot)];
let helperFiles = 0;
let callerSpots = 0;
for (const file of targets) {
  const r = injectV15(file);
  if (!r.skipped) {
    helperFiles += 1;
    callerSpots += r.callers;
  }
}
console.log("v15 files", helperFiles, "callers", callerSpots);

const uiHits = [];
for (const file of walk(gameRoot)) {
  const hits = scanUi(file, beforeStrings);
  if (hits.length) uiHits.push({ file: path.relative(root, file), hits });
}
console.log("ui hits", JSON.stringify(uiHits));

let verifyProblems = 0;
for (const file of targets) {
  const problems = verifyFile(file);
  if (problems.length) {
    verifyProblems += problems.length;
    console.log("VERIFY", path.relative(root, file), problems.slice(0, 8));
  }
}
console.log("verify problems", verifyProblems);
if (verifyProblems || uiHits.length) process.exitCode = 2;
