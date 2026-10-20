const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'services', 'constants');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

function scan(src) {
  const defs = new Set();
  const defRe = /(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)|(?:export\s+)?const\s+([A-Za-z0-9_]+)/g;
  let m;
  while ((m = defRe.exec(src))) defs.add(m[1] || m[2]);
  const imported = new Set();
  const importRe = /import\s*\{([^}]+)\}\s*from\s*'([^']+)'/g;
  while ((m = importRe.exec(src))) {
    for (const part of m[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/).pop().trim();
      if (name) imported.add(name);
    }
  }
  const uses = new Set();
  const useRe = /\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
  const skip = new Set(['if','for','while','switch','catch','function','return','void','const','let','Number','String','Math','Array','Object','console','parseInt','parseFloat','of']);
  while ((m = useRe.exec(src))) {
    if (!skip.has(m[1])) uses.add(m[1]);
  }
  const missing = [...uses].filter(u => !defs.has(u) && !imported.has(u));
  return { missing, imported: [...imported], defs: [...defs] };
}

const exp = new Map();
for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const re = /export function ([A-Za-z0-9_]+)/g;
  let m;
  while ((m = re.exec(src))) {
    if (!exp.has(m[1])) exp.set(m[1], []);
    exp.get(m[1]).push(f);
  }
}
const main = fs.readFileSync(path.join(dir, 'constichyikowrdfpagthmsntsVariable.ts'), 'utf8');
const { missing } = scan(main);
for (const n of missing) {
  console.log((exp.get(n) || ['NOT_EXPORTED']).join(',') + '\t' + n);
}
