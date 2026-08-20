/**
 * auth-gate.js — Tribune Trader server-side auth (Netlify Edge Function)
 * Deno runtime — intercepts ALL requests at CDN edge before content is served.
 * Adapted from Sales-Sleuth auth-gate (hardened 2026-07-01).
 *
 * ENV VARS (set in Netlify → Site config → Environment variables):
 *   TT_SECRET    — random 32-byte hex string for HMAC cookie signing
 *   TT_PASSWORD  — the access password for the dashboard
 *
 * Cookie: __Secure-tt-auth (HttpOnly, Secure, SameSite=Strict, 24h)
 * Tokens: HMAC-SHA-256(password:weekNumber, secret) — auto-expire at week boundary
 */

const TT_SECRET   = Deno.env.get("TT_SECRET")   || "";
const TT_PASSWORD = Deno.env.get("TT_PASSWORD")  || "";

// Fail closed — refuse to serve if env vars are not configured
if (!TT_SECRET || !TT_PASSWORD) {
  throw new Error("TT_AUTH_CONFIG_MISSING: set TT_SECRET and TT_PASSWORD in Netlify env vars");
}

const COOKIE  = "__Secure-tt-auth";
const MAX_AGE = 60 * 60 * 24; // 24h

// Static asset extensions — pass through without auth check
const ASSET_EXTS = new Set([
  "css", "js", "png", "jpg", "jpeg", "gif", "ico", "svg",
  "webp", "woff", "woff2", "ttf", "eot", "map", "txt",
]);

// Safe redirect allowlist — prevents open redirect
const SAFE_REDIRECT = new Set(["/", "/index.html", "/dashboard.html"]);

// ── Time-windowed token (server-side expiry, 7-day rotation) ──────────────────
function weekNumber() {
  return Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
}

async function hmacSign(message, secret) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function generateToken() {
  return hmacSign(`${TT_PASSWORD}:${weekNumber()}`, TT_SECRET);
}

async function verifyToken(token) {
  // Accept current week + previous (graceful overlap at boundary)
  const week = weekNumber();
  for (const w of [week, week - 1]) {
    const expected = await hmacSign(`${TT_PASSWORD}:${w}`, TT_SECRET);
    if (token.length !== expected.length) continue;
    // Constant-time compare
    let diff = 0;
    for (let i = 0; i < token.length; i++) diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
    if (diff === 0) return true;
  }
  return false;
}

// ── Cookie reader ─────────────────────────────────────────────────────────────
function readCookie(request, name) {
  const h = request.headers.get("cookie") || "";
  const safe = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = h.match(new RegExp(`(?:^|;\\s*)${safe}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

// ── Gate HTML (served instead of the real page when unauthenticated) ──────────
function gateHTML(error, redirectTo) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<meta name="robots" content="noindex,nofollow"/>
<title>Tribune Trader — Private Access</title>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#050507;--card:#0c0c12;--border:rgba(255,255,255,0.07);--accent:#7A1A5C;--gold:#C6A35A;--text:#d8dae0;--dim:#5c6370}
body{font-family:'JetBrains Mono',monospace;background:var(--bg);color:var(--text);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.5rem}
.gate{width:100%;max-width:360px;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:2.5rem 2rem;text-align:center}
.logo{margin-bottom:2rem;display:flex;align-items:center;justify-content:center;gap:.75rem}
.logo svg{width:32px;height:auto}
.logo-text{font-family:'Archivo',sans-serif;font-size:.95rem;font-weight:800;letter-spacing:.2em;color:var(--gold)}
.logo-text span{color:var(--accent)}
.sub{font-size:.6rem;color:var(--dim);margin-bottom:2rem;letter-spacing:.08em;line-height:1.7;text-transform:uppercase}
label{display:block;font-size:.55rem;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);margin-bottom:.5rem;text-align:left}
input[type=password]{width:100%;padding:.7rem 1rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:4px;color:var(--text);font-size:1rem;font-family:'JetBrains Mono',monospace;outline:none;transition:border-color .2s;letter-spacing:.15em}
input[type=password]:focus{border-color:var(--accent)}
.err{margin:.8rem 0;padding:.55rem;background:rgba(255,23,68,0.08);border:1px solid rgba(255,23,68,0.2);border-radius:4px;color:#ff6b7a;font-size:.6rem;letter-spacing:.06em}
button{width:100%;margin-top:1rem;padding:.75rem;background:var(--accent);color:#fff;border:none;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:.65rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;transition:opacity .15s}
button:hover{opacity:.82}
.conf{margin-top:1.8rem;font-size:.5rem;color:var(--dim);letter-spacing:.1em;text-transform:uppercase}
</style>
</head>
<body>
<div class="gate">
  <div class="logo">
    <svg viewBox="0 0 100 112" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="10" width="64" height="16" rx="2" fill="#C6A35A"/>
      <polygon points="18,33 46,33 46,86 37,86 18,60" fill="#C6A35A"/>
      <polygon points="54,33 82,33 82,60 63,86 54,86" fill="#C6A35A"/>
      <polygon points="40,90 60,90 50,104" fill="#7A1A5C"/>
    </svg>
    <div class="logo-text">TRIBUNE <span>TRADER</span></div>
  </div>
  <p class="sub">Authorised personnel only<br>All access attempts are logged</p>
  <form method="POST" action="/_tt_auth" autocomplete="off">
    <input type="hidden" name="r" value="${redirectTo}"/>
    <label for="pw">Access Code</label>
    ${error ? '<p class="err">⚠ Incorrect access code</p>' : ""}
    <input type="password" id="pw" name="p" autocomplete="off" autofocus required placeholder="••••••••••••"/>
    <button type="submit">Enter</button>
  </form>
  <p class="conf">Tribune Inc. &nbsp;·&nbsp; Internal &nbsp;·&nbsp; Confidential</p>
</div>
</body>
</html>`;
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(request, context) {
  const url = new URL(request.url);

  // Normalize path
  const path = url.pathname
    .replace(/^\/\/+/, "/")
    .replace(/\/{2,}/g, "/")
    .replace(/\/+$/, "") || "/";

  // ── Login POST ────────────────────────────────────────────────────────────
  if (request.method === "POST" && path === "/_tt_auth") {
    let body;
    try { body = await request.formData(); }
    catch { return new Response("Bad Request", { status: 400 }); }

    const submitted = (body.get("p") || "").trim();
    const rawRedir  = body.get("r") || "/";

    // Decode safely, then validate against allowlist (prevent open redirect)
    let decoded = "/";
    try { decoded = decodeURIComponent(rawRedir); } catch { decoded = "/"; }
    const safeRedir = SAFE_REDIRECT.has(decoded) ? decoded : "/";

    if (submitted === TT_PASSWORD) {
      const token = await generateToken();
      return new Response(null, {
        status: 302,
        headers: {
          "Location": safeRedir,
          "Set-Cookie": `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`,
          "Cache-Control": "no-store",
        },
      });
    }

    return new Response(gateHTML(true, safeRedir), {
      status: 401,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  // ── Pass through: Netlify internals + function calls ──────────────────────
  if (url.pathname.startsWith("/.netlify/")) return context.next();

  // ── Pass through: static assets ──────────────────────────────────────────
  const ext = path.split(".").pop().toLowerCase();
  if (ASSET_EXTS.has(ext)) return context.next();

  // ── Verify cookie ─────────────────────────────────────────────────────────
  const token = readCookie(request, COOKIE);
  if (token && await verifyToken(token)) {
    const resp = await context.next();
    const out  = new Response(resp.body, resp);
    out.headers.set("Cache-Control", "private, no-store");
    return out;
  }

  // ── Unauthenticated — serve gate ──────────────────────────────────────────
  const safePath = SAFE_REDIRECT.has(path) ? path : "/";
  return new Response(gateHTML(false, safePath), {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
