const fs = require('fs');
const p = 'services/wichyikowrdfpagthmsebViewService.ts';
const s = fs.readFileSync(p, 'utf8');
const defs = new Set();
const defRe = /function\s+([A-Za-z0-9_]+)\s*\(/g;
let m;
while ((m = defRe.exec(s))) defs.add(m[1]);
const callRe = /void\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)/g;
const missing = new Map();
while ((m = callRe.exec(s))) {
  const name = m[1];
  if (!defs.has(name) && !missing.has(name)) missing.set(name, m[2].trim());
}
console.log('defs', defs.size);
console.log('missing', missing.size);
for (const [n, a] of missing) console.log(n + ' || ' + a);
