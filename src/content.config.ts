/**
 * Astro v6 content collections — uses the glob loader pattern.
 *
 * New articles: drop MDX files into src/content/<collection>/<slug>.mdx.
 * Existing .astro pages under src/pages/reviews|guides|comparisons|blog
 * coexist alongside these collections; migrate lazily.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const baseFields = {
  title: z.string().max(200),
  description: z.string().min(50).max(200),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  category: z.string(),
  readTime: z.string().default('8 min read'),
  tags: z.array(z.string()).default([]),
  affiliateSlugs: z.array(z.string()).default([]),
  affiliateDisclosure: z.boolean().default(true),
  draft: z.boolean().default(false),
  image: z.string().optional(),
};

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reviews' }),
  schema: z.object({
    ...baseFields,
    productName: z.string(),
    rating: z.number().min(1).max(5),
    bestPrice: z.string().optional(),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    verdict: z.string().optional(),
  }),
});

const comparisons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/comparisons' }),
  schema: z.object({
    ...baseFields,
    products: z.array(z.string()).min(2),
    winner: z.string().optional(),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({ ...baseFields }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({ ...baseFields }),
});

export const collections = { reviews, comparisons, guides, blog };
