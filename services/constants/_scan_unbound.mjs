import fs from 'fs';
import path from 'path';

const root = path.resolve(path.dirname(decodeURIComponent(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, '$1')), '..');

function walk(d, acc = []) {
  for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.tsx?$/.test(ent.name) && !ent.name.startsWith('_')) acc.push(p);
  }
  return acc;
}

const skip = new Set(['if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'void', 'typeof', 'await']);

for (const file of walk(root)) {
  const text = fs.readFileSync(file, 'utf8');
  const imported = new Set();
  for (const m of text.matchAll(/import \{([^}]+)\}/g)) {
    for (const part of m[1].split(',')) {
      const bits = part.trim().split(/\s+as\s+/);
      const local = (bits[1] || bits[0] || '').trim();
      if (local && /^\w+$/.test(local)) imported.add(local);
    }
  }
  const defined = new Set();
  for (const m of text.matchAll(/(?:export\s+)?(?:async\s+)?function\s+(\w+)/g)) defined.add(m[1]);
  for (const m of text.matchAll(/(?:export\s+)?const\s+(\w+)/g)) defined.add(m[1]);
  for (const m of text.matchAll(/(?:export\s+)?class\s+(\w+)/g)) defined.add(m[1]);
  const missing = [];
  const seen = new Set();
  for (const m of text.matchAll(/\b([A-Za-z_]\w*)\s*\(/g)) {
    const c = m[1];
    if (skip.has(c) || imported.has(c) || defined.has(c) || seen.has(c)) continue;
    seen.add(c);
    missing.push(c);
  }
  const interesting = missing.filter((n) => /constnts|Variable|ObfV|ichyikowrdfpagthms/.test(n));
  if (interesting.length) {
    console.log('\n== ' + path.relative(root, file) + ' ==');
    for (const n of interesting) console.log('  ' + n);
  }
}
