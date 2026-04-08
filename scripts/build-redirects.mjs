/**
 * Generates vercel.json redirects from src/data/affiliates.json.
 * Runs automatically before every `npm run build` via the prebuild script,
 * so deploys always have the latest cloak map. Each affiliate becomes:
 *
 *   /recommends/<slug> -> <real url>  (302 — so we can swap freely)
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const affiliates = JSON.parse(
  await readFile(resolve(root, 'src/data/affiliates.json'), 'utf8')
);

const vercelPath = resolve(root, 'vercel.json');
const vercel = JSON.parse(await readFile(vercelPath, 'utf8'));

vercel.redirects = affiliates.map((a) => ({
  source: `/recommends/${a.slug}`,
  destination: a.url,
  permanent: false,
}));

await writeFile(vercelPath, JSON.stringify(vercel, null, 2) + '\n', 'utf8');

console.log(`build-redirects: wrote ${vercel.redirects.length} affiliate redirects to vercel.json`);
