import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const env = {};
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const index = trimmed.indexOf('=');
        if (index !== -1) {
          const key = trimmed.slice(0, index).trim();
          let value = trimmed.slice(index + 1).trim();
          
          // 1. Strip inline comment first
          const hashIndex = value.indexOf('#');
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
          
          env[key] = value;
        }
      }
    }
  }
} catch (e) {
  console.warn('Error reading local .env:', e.message);
}

const pEnv = { ...process.env };

// If the environment variables are masked by Netlify CLI (start with *), override them with raw values from .env
if ((process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '').startsWith('*') && env.NEXT_PUBLIC_TINA_CLIENT_ID) {
  pEnv.NEXT_PUBLIC_TINA_CLIENT_ID = env.NEXT_PUBLIC_TINA_CLIENT_ID;
}
if ((process.env.TINA_TOKEN || '').startsWith('*') && env.TINA_TOKEN) {
  pEnv.TINA_TOKEN = env.TINA_TOKEN;
}

console.log('Starting optimized build with unmasked credentials...');

const tinaResult = spawnSync('pnpm', ['exec', 'tinacms', 'build'], {
  stdio: 'inherit',
  env: pEnv,
  shell: true,
});

if (tinaResult.status !== 0) {
  process.exit(tinaResult.status || 1);
}

const astroResult = spawnSync('pnpm', ['exec', 'astro', 'build'], {
  stdio: 'inherit',
  env: pEnv,
  shell: true,
});

process.exit(astroResult.status || 0);
