/* ==========================================================================
   NOAH — toegangstoken voor de maintenance-gate
   Gedeeld door middleware.js (edge runtime) en api/unlock.js (node runtime).
   Beide runtimes hebben een globale `crypto` met WebCrypto, dus dit werkt
   in allebei zonder dependencies.

   Het token is stateless: "<vervaltijd>.<hmac van die vervaltijd>".
   Zonder AUTH_SECRET valt er niets te vervalsen; er is geen database nodig.
   ========================================================================== */

export const COOKIE = "noah_access";
export const FLAG_COOKIE = "noah_in"; // leesbaar voor js/main.js (geen geheim)
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 dagen

const encoder = new TextEncoder();

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function base64url(buffer) {
  let binary = "";
  for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signature(payload, secret) {
  const mac = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(payload));
  return base64url(mac);
}

/* Vergelijking zonder vroegtijdig afbreken, zodat de looptijd niets verraadt. */
export function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createToken(secret, maxAgeSeconds = MAX_AGE_SECONDS) {
  const expiresAt = String(Date.now() + maxAgeSeconds * 1000);
  return `${expiresAt}.${await signature(expiresAt, secret)}`;
}

export async function verifyToken(token, secret) {
  if (!token || !secret) return false;
  const dot = token.indexOf(".");
  if (dot < 1) return false;

  const expiresAt = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^\d+$/.test(expiresAt) || Number(expiresAt) < Date.now()) return false;

  return safeEqual(sig, await signature(expiresAt, secret));
}

export function readCookie(header, name) {
  if (!header) return null;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === name) {
      return decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return null;
}
