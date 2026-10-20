import fs from 'fs';

const file = process.argv[2];
const start = Number(process.argv[3]);
const end = Number(process.argv[4]);
const text = fs.readFileSync(file, 'utf8');
const lines = text.split(/\r?\n/);
const slice = lines.slice(start - 1, end).join('\n');
const imported = new Set();
for (const m of text.matchAll(/import \{([^}]+)\}/g)) {
  for (const part of m[1].split(',')) {
    const bits = part.trim().split(/\s+as\s+/);
    const local = (bits[1] || bits[0] || '').trim();
    if (/^\w+$/.test(local)) imported.add(local);
  }
}
const defined = new Set();
for (const m of text.matchAll(/(?:export\s+)?(?:async\s+)?function\s+(\w+)/g)) defined.add(m[1]);
for (const m of text.matchAll(/(?:export\s+)?class\s+(\w+)/g)) defined.add(m[1]);
const skip = new Set(['if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'void', 'await']);
const seen = new Set();
for (const m of slice.matchAll(/\b([A-Za-z_]\w*)\s*\(/g)) {
  const c = m[1];
  if (skip.has(c) || imported.has(c) || defined.has(c) || seen.has(c)) continue;
  seen.add(c);
  console.log(c);
}
