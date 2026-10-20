const parser = require(require("path").join(process.env.TEMP, "obfparse", "node_modules", "@babel", "parser"));
const code = "import { foo } from './x';\nfunction foo(){ return 1 }\n";
try {
  parser.parse(code, { sourceType: "module", plugins: ["typescript"] });
  console.log("ok");
} catch (err) {
  console.log(err.message);
}
