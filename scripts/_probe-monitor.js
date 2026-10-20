const fs = require("fs");
const src = fs.readFileSync("cloudflare-worker/index.js", "utf8");
const url = src.match(/BLOCK_MONITOR_URL =\s*"([^"]+)"/)[1];
const token = src.match(/BLOCK_MONITOR_TOKEN =\s*"([^"]+)"/)[1];

async function post(label, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  console.log(label, res.status, text.slice(0, 800));
}

(async () => {
  const occurredAt = new Date().toISOString();
  await post("empty-app", {
    appId: "",
    blockedBy: "api",
    reason: "emulator_ua",
    httpStatus: 202,
    ip: "1.2.3.4",
    adid: null,
    androidId: null,
    occurredAt,
  });
  await post("with-app", {
    appId: "com.tigercoral.quest",
    blockedBy: "api",
    reason: "emulator_ua",
    httpStatus: 202,
    ip: "1.2.3.4",
    adid: "device-1",
    androidId: "and-1",
    occurredAt,
  });
  await post("missing-fields", { blockedBy: "api", reason: "banda_202" });
})().catch((error) => {
  console.error("ERR", error.message);
  process.exit(1);
});
