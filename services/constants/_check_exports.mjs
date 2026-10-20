import fs from 'fs';
import path from 'path';

const here = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, '$1'));
const root = path.resolve(here, '..');

function walk(d, acc = []) {
  for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.tsx?$/.test(ent.name) && !ent.name.startsWith('_check_')) acc.push(p);
  }
  return acc;
}

const files = walk(root);
const exportsByFile = new Map();
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const names = [...text.matchAll(/export function (\w+)/g)].map((m) => m[1]);
  exportsByFile.set(path.resolve(file), new Set(names));
}

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const importRe = /import \{([^}]+)\} from '(\.[^']+)'/g;
  let m;
  while ((m = importRe.exec(text))) {
    const resolved = path.resolve(path.dirname(file), m[2]);
    const target = exportsByFile.has(resolved + '.ts')
      ? resolved + '.ts'
      : exportsByFile.has(resolved + '.tsx')
        ? resolved + '.tsx'
        : exportsByFile.has(resolved)
          ? resolved
          : null;
    const names = m[1].split(',').map((s) => s.trim().split(/\s+as\s+/)[0]).filter(Boolean);
    for (const name of names) {
      if (!target) {
        console.log(`${path.relative(root, file)}: missing module ${m[2]} for ${name}`);
        continue;
      }
      if (!exportsByFile.get(target).has(name)) {
        let owner = 'NONE';
        for (const [fp, set] of exportsByFile) {
          if (set.has(name)) owner = path.relative(root, fp);
        }
        console.log(`${path.relative(root, file)}: ${name} not in ${path.relative(root, target)}; actual=${owner}`);
      }
    }
  }
}
