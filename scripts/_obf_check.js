const { checkProjectPaths } = require("./autosetup/checkPaths");
checkProjectPaths(require("path").resolve(__dirname, "..")).then((r) => {
  console.log(JSON.stringify(r, null, 2));
});
