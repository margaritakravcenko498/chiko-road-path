const fs = require('fs');
const path = require('path');

function walk(p, out) {
  for (const n of fs.readdirSync(p)) {
    const f = path.join(p, n);
    if (fs.statSync(f).isDirectory()) walk(f, out);
    else if (/\.(ts|tsx)$/.test(f)) out.push(f);
  }
}
const files = [];
walk('services', files);
walk('Layouts', files);
const exportsByName = new Map();
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  for (const m of t.matchAll(/export\s+(?:async\s+)?function\s+(\w+)/g)) {
    if (!exportsByName.has(m[1])) exportsByName.set(m[1], []);
    exportsByName.get(m[1]).push(f.replace(/\\/g, '/'));
  }
}
let total = 0;
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const local = new Set();
  for (const m of text.matchAll(/(?:export\s+)?(?:async\s+)?function\s+(\w+)/g)) local.add(m[1]);
  for (const m of text.matchAll(/import\s+\{([^}]+)\}\s+from/g)) {
    for (const part of m[1].split(',')) {
      const mm = part.trim().match(/(\w+)(?:\s+as\s+(\w+))?$/);
      if (mm) local.add(mm[2] || mm[1]);
    }
  }
  const need = new Map();
  for (const m of text.matchAll(/(?<![\.\w])([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    const name = m[1];
    if (!name.includes('Obf') && name !== 'ichyikowrdfpagthmsFoldRange' && name !== 'ichyikowrdfpagthmsMixSeed' && name !== 'ichyikowrdfpagthmsClampSpan') continue;
    if (local.has(name)) continue;
    if (!need.has(name)) need.set(name, exportsByName.get(name) || []);
  }
  if (need.size) {
    total += need.size;
    console.log('\n## ' + f.replace(/\\/g, '/') + ' ' + need.size);
    for (const [name, srcs] of need) console.log('  ' + name + ' <= ' + (srcs[0] || 'NONE'));
  }
}
console.log('\nTOTAL_UNIQUE_BINDINGS', total);
