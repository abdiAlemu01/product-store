// arcjet.js
import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import "dotenv/config";

const isDev = process.env.NODE_ENV !== "production";

// Initialize arcjet
export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  // Use "ip.src" (not "ip.scr" — that was a typo causing fingerprint errors)
  // In development, IP is 127.0.0.1 so we fall back to no custom characteristic
  characteristics: isDev ? [] : ["ip.src"],
  rules: [
    // Shield: protect from common web attacks (SQLi, XSS, etc.)
    shield({ mode: isDev ? "DRY_RUN" : "LIVE" }),
    // Bot detection — block scrapers, allow search engines
    detectBot({
      mode: isDev ? "DRY_RUN" : "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        // See full list: https://arcjet.com/bot-list
      ],
    }),
    // Rate limiting: 5 requests per 10s, burst up to 10
    tokenBucket({
      mode: isDev ? "DRY_RUN" : "LIVE",
      refillRate: 5,
      capacity: 10,
      interval: 10,
    }),
  ],
});