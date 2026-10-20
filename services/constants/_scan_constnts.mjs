import fs from 'fs';
import path from 'path';

const root = process.cwd();
const apply = process.argv.includes('--fix');
const dirs = ['services', 'Layouts'].map((d) => path.join(root, d));
const extra = ['App.tsx', 'index.js'].map((f) => path.join(root, f)).filter((f) => fs.existsSync(f));

function walk(d, acc = []) {
  if (!fs.existsSync(d)) return acc;
  for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === 'assets') continue;
    const p = path.join(d, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.tsx?$/.test(ent.name) && !ent.name.startsWith('_')) acc.push(p);
  }
  return acc;
}

const files = [...dirs.flatMap((d) => walk(d)), ...extra];
const owners = new Map();
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const names = [...text.matchAll(/export (?:async )?(?:function|const|class) (\w+)/g)].map((m) => m[1]);
  for (const name of names) {
    if (!owners.has(name)) owners.set(name, []);
    owners.get(name).push(file);
  }
}

const skip = new Set([
  'if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'void', 'typeof', 'await',
  'Array', 'Math', 'Number', 'String', 'Object', 'JSON', 'console', 'Date', 'parseInt',
  'parseFloat', 'isNaN', 'Set', 'Map', 'Error', 'Promise', 'require', 'setTimeout',
  'setInterval', 'clearTimeout', 'clearInterval',
]);

function definedNames(text) {
  const defined = new Set();
  const imported = new Set();
  for (const im of text.matchAll(/import\s*\{([^}]+)\}/g)) {
    for (const part of im[1].split(',')) {
      const bits = part.trim().split(/\s+as\s+/);
      const local = (bits[1] || bits[0] || '').trim();
      if (/^\w+$/.test(local)) imported.add(local);
    }
  }
  for (const im of text.matchAll(/import\s+(\w+)\s+from/g)) imported.add(im[1]);
  for (const dm of text.matchAll(/(?:export\s+)?(?:async\s+)?function\s+(\w+)/g)) defined.add(dm[1]);
  for (const dm of text.matchAll(/(?:export\s+)?(?:const|let|var|class)\s+(\w+)/g)) defined.add(dm[1]);
  for (const dm of text.matchAll(/(?:const|let|var)\s*\{([^}]+)\}/g)) {
    for (const part of dm[1].split(',')) {
      const bits = part.trim().split(/\s*:\s*|\s+as\s+/);
      const local = (bits[bits.length - 1] || '').trim();
      if (/^\w+$/.test(local)) defined.add(local);
    }
  }
  for (const dm of text.matchAll(/(?:^|\n)\s*(?:export\s+)?(?:(?:async|static|private|public|protected|get|set|override)\s+)+(\w+)\s*\(/g)) {
    defined.add(dm[1]);
  }
  return { defined, imported };
}

function chooseOwner(caller, list) {
  if (list.length === 1) return list[0];
  const dir = path.dirname(caller);
  const same = list.filter((f) => path.dirname(f) === dir);
  if (same.length === 1) return same[0];
  if (same.length > 1) {
    const base = path.basename(caller).replace(/\.[^.]+$/, '');
    const score = (s) => {
      const stem = path.basename(s).replace(/\.[^.]+$/, '');
      let n = 0;
      const limit = Math.min(base.length, stem.length);
      for (let i = 0; i < limit; i++) {
        if (base[i] !== stem[i]) break;
        n++;
      }
      return n;
    };
    same.sort((a, b) => score(b) - score(a));
    return same[0];
  }
  return null;
}

function relImport(fromFile, toFile) {
  let rel = path.relative(path.dirname(fromFile), toFile).replace(/\\/g, '/').replace(/\.tsx?$/, '');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

let added = 0;
for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  const { defined, imported } = definedNames(text);
  const missing = new Map();
  const seen = new Set();
  for (const cm of text.matchAll(/(^|[^\w.])([A-Za-z_]\w*)\s*\(/g)) {
    const c = cm[2];
    if (skip.has(c) || imported.has(c) || defined.has(c) || c.length < 8) continue;
    if (!/Obf|ichyikowrdfpagthms/.test(c)) continue;
    if (seen.has(c)) continue;
    seen.add(c);
    const list = owners.get(c);
    if (!list) continue;
    const owner = chooseOwner(file, list);
    if (!owner || owner === file) continue;
    const spec = relImport(file, owner);
    if (!missing.has(spec)) missing.set(spec, []);
    missing.get(spec).push(c);
  }
  if (!missing.size) continue;
  if (!apply) {
    console.log('\n== ' + path.relative(root, file) + ' ==');
    for (const [spec, names] of missing) {
      console.log('  from ' + spec + ' : ' + names.length);
      if (names.length <= 8) console.log('    ' + names.join(', '));
    }
    continue;
  }
  for (const [spec, names] of missing) {
    const specRe = new RegExp(
      'import\\s*\\{([^}]+)\\}\\s*from\\s*([\'"])' + spec.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\2',
    );
    const hit = text.match(specRe);
    if (hit) {
      const have = new Set(hit[1].split(',').map((s) => s.trim().split(/\s+as\s+/)[0]).filter(Boolean));
      const extraNames = names.filter((n) => !have.has(n));
      if (!extraNames.length) continue;
      text = text.replace(specRe, (full, body, q) => `import {${body}, ${extraNames.join(', ')}} from ${q}${spec}${q}`);
      added += extraNames.length;
    } else {
      const block = `import { ${names.join(', ')} } from '${spec}';\n`;
      const importEnd = text.match(/^(?:import[\s\S]*?;\s*\n|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*\n)*/);
      const at = importEnd ? importEnd[0].length : 0;
      text = text.slice(0, at) + block + text.slice(at);
      added += names.length;
    }
  }
  fs.writeFileSync(file, text);
  console.log('updated ' + path.relative(root, file));
}
console.log(apply ? 'added ' + added : 'dry');
