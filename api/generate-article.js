export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const { title, keyword, category, slug, affiliateLinks } = req.body || {};

  if (!title || !keyword || !category || !slug) {
    return res.status(400).json({
      error: 'Missing required fields: title, keyword, category, slug',
    });
  }

  const today = new Date().toISOString().split('T')[0];

  const systemPrompt = `You are a member of the OperatorStack editorial team. Your team has collectively managed thousands of business locations across restaurants, gyms, salons, retail, and service businesses, and evaluated thousands of software tools over your careers. Write from a team perspective using 'we' and 'our team' rather than 'I'. Voice is direct, experienced, and credible. Never use filler phrases. Always include real operator context — what breaks at scale, what the tool actually costs at 10+ locations, and who it's for.`;

  const userPrompt = `Write a complete SEO-optimized .astro article file for OperatorStack.tech.

Title: ${title}
Target keyword: ${keyword}
Category: ${category}
Affiliate links (max 3 CTAs): ${affiliateLinks || 'none'}

Output a COMPLETE .astro file using this exact structure — no markdown fences, no explanation, raw file content only:

---
import Article from '../../layouts/Article.astro';
---
<Article
  title='${title}'
  description='[Write a 150-160 char meta description with the target keyword]'
  publishDate='${today}'
  category='${category}'
  readTime='[X] min read'
>

Article body requirements:
1. verdict-box div at top with bottom line up front
2. quick-stats div with 4 stats: rating, price, key metric, affiliate %
3. H2 headings with emoji and id attributes throughout
4. Sections in order: What Is [Tool], Our Experience (reference managing thousands of locations), Key Features (H3 for each), Pricing (HTML table), Pros & Cons (pros-cons div with pros and cons divs inside), Who It's For, Final Verdict
5. At least 2 callout divs using classes: callout-blue (tips), callout-orange (warnings), callout-green (further reading)
6. Affiliate CTAs as:
   <a href='https://operatorstack.tech/recommends/[tool]' class='affiliate-cta'>
     [Specific CTA text] →
   </a>
   Do NOT add any disclaimer text after CTAs. Maximum 3 CTAs: after intro, mid-article, end
7. FAQPage JSON-LD script block at end with 3-5 operator Q&As
8. callout-green Further Reading div with 3 internal links to real existing pages on operatorstack.tech
9. 1,800-2,400 words total
10. At least 3 internal links in body content

</Article>`;

  try {
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
      const errorBody = await response.text();
      return res.status(response.status).json({
        error: 'Anthropic API error',
        status: response.status,
        detail: errorBody,
      });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';

    if (!content) {
      return res.status(500).json({ error: 'Empty response from Anthropic API' });
    }

    return res.status(200).json({ content, slug, category });
  } catch (err) {
    return res.status(500).json({
      error: 'Internal server error',
      detail: err.message,
    });
  }
}
