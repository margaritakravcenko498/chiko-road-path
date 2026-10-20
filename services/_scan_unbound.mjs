import fs from 'fs';
import path from 'path';

const root = path.resolve('E:/TD/react/Grand Pulse (3361 MS1)');
const dirs = ['services', 'Layouts', 'App.tsx', 'index.js'].map((p) => path.join(root, p));

function walk(d, acc = []) {
  if (!fs.existsSync(d)) return acc;
  const st = fs.statSync(d);
  if (st.isFile()) {
    acc.push(d);
    return acc;
  }
  for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name.startsWith('_scan')) continue;
    const p = path.join(d, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(tsx?|jsx?)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

const files = dirs.flatMap((d) => walk(d));
const defined = new Map();
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const names = new Set();
  for (const m of text.matchAll(/(?:export\s+)?(?:async\s+)?function\s+(\w+)/g)) names.add(m[1]);
  for (const m of text.matchAll(/(?:export\s+)?(?:const|let|var|class|type|interface|enum)\s+(\w+)/g)) names.add(m[1]);
  defined.set(file, names);
}

const interesting = /ichyikowrdfpagthms|ObfV|constnts|CryptoServ|cichyikowrdfpagthmso/;

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const local = new Set(defined.get(file));
  for (const m of text.matchAll(/import\s+(type\s+)?\{([^}]+)\}\s+from\s+'[^']+'/g)) {
    for (const part of m[2].split(',')) {
      const bit = part.trim();
      if (!bit) continue;
      const alias = bit.split(/\s+as\s+/);
      local.add((alias[1] || alias[0]).trim());
    }
  }
  for (const m of text.matchAll(/import\s+(\w+)\s+from\s+'[^']+'/g)) local.add(m[1]);
  const seen = new Set();
  for (const m of text.matchAll(/(?<![\w.])([A-Za-z_][\w]*)\s*\(/g)) {
    const name = m[1];
    if (!interesting.test(name)) continue;
    if (local.has(name)) continue;
    if (['if', 'for', 'while', 'switch', 'catch', 'function'].includes(name)) continue;
    const key = name;
    if (seen.has(key)) continue;
    seen.add(key);
    let owner = 'NONE';
    for (const [fp, set] of defined) {
      if (set.has(name)) {
        owner = path.relative(root, fp);
        break;
      }
    }
    console.log(`${path.relative(root, file)}: ${name} unbound; definedIn=${owner}`);
  }
}
