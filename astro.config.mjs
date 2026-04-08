import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Site URL is driven by the same env var as src/config/site.ts so cloning a
// new vertical only requires updating .env, not editing config files.
const siteUrl = process.env.PUBLIC_SITE_URL || 'https://operatorstack.tech';

export default defineConfig({
  site: siteUrl,
  integrations: [
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
