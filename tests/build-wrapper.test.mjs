import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

test("Local .env parsing and comment stripping behaves correctly", () => {
  // Mock env content with trailing spaces, quotes, and inline comments
  const mockEnv = `
    NEXT_PUBLIC_TINA_CLIENT_ID=01b2869a-fc84-4ea6-8882-ca1054ada8f1
    TINA_TOKEN="12f121e3e418539a9181a14c85352f3d7d1320e3" # keep private
  `;

  const parsedEnv = {};
  for (const line of mockEnv.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const index = trimmed.indexOf("=");
      if (index !== -1) {
        const key = trimmed.slice(0, index).trim();
        let value = trimmed.slice(index + 1).trim();
        
        // 1. Strip inline comment first
        const hashIndex = value.indexOf("#");
        if (hashIndex !== -1) {
          const firstQuoteIndex = value.indexOf('"');
          const lastQuoteIndex = value.lastIndexOf('"');
          if (firstQuoteIndex === 0 && lastQuoteIndex > 0 && lastQuoteIndex < hashIndex) {
            value = value.slice(0, hashIndex).trim();
          } else {
            const firstSingleQuoteIndex = value.indexOf("'");
            const lastSingleQuoteIndex = value.lastIndexOf("'");
            if (firstSingleQuoteIndex === 0 && lastSingleQuoteIndex > 0 && lastSingleQuoteIndex < hashIndex) {
              value = value.slice(0, hashIndex).trim();
            } else if (firstQuoteIndex === -1 && firstSingleQuoteIndex === -1) {
              value = value.slice(0, hashIndex).trim();
            }
          }
        }
        
        // 2. Strip surrounding quotes
        const hasDoubleQuotes = value.startsWith('"') && value.endsWith('"');
        const hasSingleQuotes = value.startsWith("'") && value.endsWith("'");
        if (hasDoubleQuotes || hasSingleQuotes) {
          value = value.slice(1, -1);
        }
        
        parsedEnv[key] = value;
      }
    }
  }

  // Assertions to verify the parser handles comments and quotes correctly
  assert.equal(parsedEnv.NEXT_PUBLIC_TINA_CLIENT_ID, "01b2869a-fc84-4ea6-8882-ca1054ada8f1");
  assert.equal(parsedEnv.TINA_TOKEN, "12f121e3e418539a9181a14c85352f3d7d1320e3");
});
