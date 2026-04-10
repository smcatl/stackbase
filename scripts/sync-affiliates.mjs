/**
 * Fetches affiliate registry from stackedaffiliate admin API and writes
 * src/data/affiliates.json. Runs before build-redirects.mjs in the
 * prebuild chain. Falls back to existing local file if the API is
 * unreachable (so builds never break on network issues).
 *
 * Required env vars:
 *   AFFILIATES_API_URL  — e.g. https://stackedaffiliate.vercel.app/api/affiliates/export
 *   AFFILIATES_API_KEY  — matches AFFILIATES_EXPORT_KEY on the admin side
 *   SITE_ID             — (optional) filter affiliates to this site
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outPath = resolve(root, 'src/data/affiliates.json');

const apiUrl = process.env.AFFILIATES_API_URL;
const apiKey = process.env.AFFILIATES_API_KEY;
const siteId = process.env.SITE_ID;

if (!apiUrl || !apiKey) {
  console.log('sync-affiliates: AFFILIATES_API_URL or AFFILIATES_API_KEY not set, skipping sync');
  process.exit(0);
}

try {
  const url = new URL(apiUrl);
  if (siteId) url.searchParams.set('site_id', siteId);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    throw new Error(`API returned ${res.status}: ${await res.text()}`);
  }

  const { data } = await res.json();

  await mkdir(resolve(root, 'src/data'), { recursive: true });
  await writeFile(outPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`sync-affiliates: wrote ${data.length} affiliates to src/data/affiliates.json`);
} catch (err) {
  console.warn(`sync-affiliates: API fetch failed (${err.message}), keeping existing local file`);
}
