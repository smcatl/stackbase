const GITHUB_REPO = 'smcatl/OperatorStack';
const GITHUB_BRANCH = 'main';

const AFFILIATE_PROGRAMS = {
  gohighlevel: {
    name: 'GoHighLevel',
    commission: '40% lifetime recurring',
    links: {
      default: 'https://www.gohighlevel.com/?fp_ref=stosh61',
      annual: 'https://gohighlevel.com/annual?fp_ref=stosh61',
      pro: 'https://www.gohighlevel.com/protrial?fp_ref=stosh61',
      upgrade: 'https://app.gohighlevel.com/offers/affiliate-upgrade?fp_ref=stosh61',
    },
    primaryLink: 'https://www.gohighlevel.com/?fp_ref=stosh61',
  },
  aweber: {
    name: 'AWeber',
    commission: '30% lifetime recurring',
    note: 'Promotes both Free and Plus plans',
    primaryLink: 'https://www.aweber.com/easy-email.htm?id=560455',
  },
  cloudways: {
    name: 'Cloudways',
    commission: '$30 + 7% lifetime recurring',
    primaryLink: 'https://www.cloudways.com/en/?id=2108276',
  },
  moosend: {
    name: 'Moosend',
    commission: '30% lifetime recurring',
    primaryLink: 'https://trymoo.moosend.com/68v8v144fh7a',
  },
  profitbooks: {
    name: 'ProfitBooks',
    commission: '30% recurring for 3 years',
    primaryLink: 'https://www.profitbookshq.com/users/sign_up?partner=DZvqxdd4t0vk',
  },
  esignly: {
    name: 'Esignly',
    commission: '10% recurring',
    primaryLink: 'https://www.esignly.com/?via=stosh',
  },
  docparser: {
    name: 'Docparser',
    commission: 'recurring — 30 day cookie',
    primaryLink: 'https://docparser.com/?ref=efhmj',
    note: 'Add ?ref=efhmj to any docparser.com URL',
  },
};

export default async function handler(req, res) {
  const githubToken = process.env.OSGIT_TOKEN;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!githubToken || !anthropicKey) {
    return res.status(500).json({ error: 'Missing OSGIT_TOKEN or ANTHROPIC_API_KEY' });
  }

  // ── Step 1: Read queue.json from GitHub ──
  let queueData, queueSha;
  try {
    const queueRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/queue.json?ref=${GITHUB_BRANCH}`,
      { headers: ghHeaders(githubToken) }
    );
    if (!queueRes.ok) {
      return res.status(500).json({ error: 'Failed to read queue.json', status: queueRes.status });
    }
    const queueFile = await queueRes.json();
    queueSha = queueFile.sha;
    queueData = JSON.parse(Buffer.from(queueFile.content, 'base64').toString('utf-8'));
  } catch (err) {
    return res.status(500).json({ error: 'Failed to parse queue.json', detail: err.message });
  }

  // ── Step 2: Find next queued article ──
  const nextIndex = queueData.articles.findIndex((a) => a.status === 'queued');
  if (nextIndex === -1) {
    return res.status(200).json({ published: false, message: 'Queue empty' });
  }
  const article = queueData.articles[nextIndex];

  // ── Step 3: Generate article via Claude ──
  const today = new Date().toISOString().split('T')[0];
  let generatedContent;
  try {
    generatedContent = await callClaude(anthropicKey, article, today);
  } catch (err) {
    return res.status(500).json({ error: 'Claude API failed', detail: err.message });
  }

  if (!generatedContent) {
    return res.status(500).json({ error: 'Empty content from Claude' });
  }

  // ── Step 4: Determine file path ──
  const filePath = getFilePath(article.category, article.slug);

  // ── Step 5: Check if file already exists (need sha for update) ──
  let existingSha = null;
  try {
    const existingRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
      { headers: ghHeaders(githubToken) }
    );
    if (existingRes.ok) {
      const existing = await existingRes.json();
      existingSha = existing.sha;
    }
  } catch (_) {
    // File doesn't exist, that's fine
  }

  // ── Step 6: Commit the generated article ──
  try {
    const commitBody = {
      message: `publish: ${article.title}`,
      content: Buffer.from(generatedContent, 'utf-8').toString('base64'),
      branch: GITHUB_BRANCH,
    };
    if (existingSha) commitBody.sha = existingSha;

    const commitRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: ghHeaders(githubToken),
        body: JSON.stringify(commitBody),
      }
    );
    if (!commitRes.ok) {
      const err = await commitRes.text();
      return res.status(500).json({ error: 'Failed to commit article', detail: err });
    }
  } catch (err) {
    return res.status(500).json({ error: 'GitHub commit failed', detail: err.message });
  }

  // ── Step 7: Re-fetch queue.json for fresh SHA, then update ──
  queueData.articles[nextIndex].status = 'published';
  queueData.articles[nextIndex].publishedDate = today;

  try {
    const freshQueueRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/queue.json?ref=${GITHUB_BRANCH}`,
      { headers: ghHeaders(githubToken) }
    );
    if (!freshQueueRes.ok) {
      return res.status(500).json({ error: 'Failed to re-fetch queue.json for fresh SHA' });
    }
    const freshQueue = await freshQueueRes.json();
    const freshSha = freshQueue.sha;

    const updateRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/queue.json`,
      {
        method: 'PUT',
        headers: ghHeaders(githubToken),
        body: JSON.stringify({
          message: `queue: mark "${article.title}" as published`,
          content: Buffer.from(JSON.stringify(queueData, null, 2) + '\n', 'utf-8').toString('base64'),
          sha: freshSha,
          branch: GITHUB_BRANCH,
        }),
      }
    );
    if (!updateRes.ok) {
      const err = await updateRes.text();
      return res.status(500).json({ error: 'Failed to update queue.json', detail: err });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Queue update failed', detail: err.message });
  }

  // ── Step 8: Fire-and-forget queue refill check ──
  try {
    const host = req.headers.host || 'operatorstack.tech';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    fetch(`${protocol}://${host}/api/refill-queue`).catch(() => {});
  } catch (_) {
    // Non-critical — don't block the response
  }

  // ── Step 9: Ping search engines to recrawl sitemap ──
  try {
    fetch('https://www.google.com/ping?sitemap=https://operatorstack.tech/sitemap-index.xml').catch(() => {});
    fetch('https://www.bing.com/ping?sitemap=https://operatorstack.tech/sitemap-index.xml').catch(() => {});
  } catch (_) {}

  // ── Step 10: Return success ──
  return res.status(200).json({
    published: true,
    title: article.title,
    slug: article.slug,
    path: filePath,
    date: today,
  });
}

// ── Helper: GitHub API headers ──
function ghHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'OperatorStack-Publisher',
  };
}

// ── Helper: Determine file path from category ──
function getFilePath(category, slug) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('review')) return `src/pages/reviews/${slug}.astro`;
  if (cat.includes('comparison')) return `src/pages/comparisons/${slug}.astro`;
  if (cat.includes('guide')) return `src/pages/guides/${slug}.astro`;
  return `src/pages/blog/${slug}.astro`;
}

// ── Helper: Resolve affiliate links from article data ──
function resolveAffiliateLinks(articleLinks) {
  if (!articleLinks) return 'none';
  // Replace any /recommends/slug patterns with real tracking URLs
  let resolved = articleLinks;
  for (const [slug, program] of Object.entries(AFFILIATE_PROGRAMS)) {
    resolved = resolved.replace(
      new RegExp(`/recommends/${slug}`, 'g'),
      program.primaryLink
    );
  }
  return resolved;
}

// ── Helper: Call Claude API ──
async function callClaude(apiKey, article, today) {
  const affiliateInfo = resolveAffiliateLinks(article.affiliateLinks);

  const systemPrompt = `You are a member of the OperatorStack editorial team. Your team has collectively managed thousands of business locations across restaurants, gyms, salons, retail, and service businesses, and evaluated thousands of software tools over your careers. Write from a team perspective using 'we' and 'our team' rather than 'I'. Voice is direct, experienced, and credible. Never use filler phrases. Always include real operator context — what breaks at scale, what the tool actually costs at 10+ locations, and who it's for.`;

  const userPrompt = `Write a complete SEO-optimized .astro article file for OperatorStack.tech.

Title: ${article.title}
Target keyword: ${article.keyword}
Category: ${article.category}
Affiliate links (max 3 CTAs): ${affiliateInfo}

Output a COMPLETE .astro file using this exact structure — no markdown fences, no explanation, raw file content only:

---
import Article from '../../layouts/Article.astro';
---
<Article
  title='${article.title}'
  description='[Write a 150-160 char meta description with the target keyword]'
  publishDate='${today}'
  category='${article.category}'
  readTime='[X] min read'
>

Article body requirements:
1. verdict-box div at top with bottom line up front
2. quick-stats div with 4 stats: rating, price, key metric, affiliate %
3. H2 headings with emoji and id attributes throughout
4. Sections in order: What Is [Tool], Our Experience (reference managing thousands of locations), Key Features (H3 for each), Pricing (HTML table), Pros & Cons (pros-cons div with pros and cons divs inside), Who It's For, Final Verdict
5. At least 2 callout divs using classes: callout-blue (tips), callout-orange (warnings), callout-green (further reading)
6. Affiliate CTAs using the EXACT affiliate tracking URL provided above — never use placeholder URLs. Format:
   <a href='[EXACT TRACKING URL FROM ABOVE]' class='affiliate-cta'>
     [Specific CTA text] →
   </a>
   Do NOT add any disclaimer text after CTAs. Maximum 3 CTAs: after intro, mid-article, end
7. FAQPage JSON-LD script block at end with 3-5 operator Q&As
8. callout-green Further Reading div with 3 internal links to real existing pages on operatorstack.tech
9. 1,800-2,400 words total
10. At least 3 internal links in body content

</Article>`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}
