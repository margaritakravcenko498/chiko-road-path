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
