/**
 * Lists services/*.ts import edges for the gate pipeline graph (debug/diversify aid).
 * Does not modify files.
 */
const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, '..', 'services');
const files = fs
  .readdirSync(servicesDir)
  .filter((f) => f.endsWith('.ts') && !f.endsWith('.d.ts'));

for (const file of files.sort()) {
  const full = path.join(servicesDir, file);
  const src = fs.readFileSync(full, 'utf8');
  const imports = [];
  const re = /from\s+['"](\.\/[^'"]+)['"]/g;
  let m;
  while ((m = re.exec(src))) {
    imports.push(m[1]);
  }
  console.log(file);
  if (imports.length === 0) {
    console.log('  (no relative imports)');
  } else {
    for (const imp of imports) {
      console.log('  ->', imp);
    }
  }
}
