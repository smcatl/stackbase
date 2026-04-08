import rss from '@astrojs/rss';

export async function GET(context) {
  return rss({
    title: 'OperatorStack',
    description: 'Software reviews and tech stack advice for multi-location business operators.',
    site: context.site,
    items: [
      { title: 'How to Build a Partner Onboarding System That Runs Itself', pubDate: new Date('2026-04-02'), description: 'The exact 8-step automated onboarding system running across 50+ venues using GHL, PandaDoc, Tally, and Zapier.', link: '/guides/build-partner-onboarding-system' },
      { title: 'GoHighLevel Snapshots: The Feature That Makes Multi-Location Management Possible', pubDate: new Date('2026-04-01'), description: 'Deep dive into Snapshots -- what they capture, how to build one, and the real SkyYield deployment workflow.', link: '/guides/gohighlevel-snapshots' },
      { title: 'Monday.com Review 2026: Project Management for Operators', pubDate: new Date('2026-04-01'), description: 'Template-based project management for repeatable multi-location operations.', link: '/reviews/monday' },
      { title: 'Best POS Systems for Multi-Location Restaurants in 2026', pubDate: new Date('2026-03-31'), description: 'Toast, Square, Lightspeed, and Clover compared for multi-unit restaurant operations.', link: '/guides/best-pos-restaurants' },
      { title: 'Zapier Review 2026: The Automation Tool Every Operator Needs', pubDate: new Date('2026-03-31'), description: 'The connective tissue of every operator stack. 15 active Zaps across 50+ venues.', link: '/reviews/zapier' },
      { title: 'Best Employee Scheduling Software for Multi-Location Businesses (2026)', pubDate: new Date('2026-03-26'), description: 'Homebase, When I Work, Deputy, and 7shifts compared for multi-location operators.', link: '/guides/best-scheduling-software' },
      { title: 'ConvertKit vs AWeber 2026: Which Email Platform Wins for Operators?', pubDate: new Date('2026-03-25'), description: 'Both offer lifetime recurring commissions. AWeber wins for operators wanting pricing stability and 50% commissions.', link: '/comparisons/convertkit-vs-aweber' },
      { title: 'Best Payroll Software for Multi-Location Small Business in 2026', pubDate: new Date('2026-03-25'), description: 'Gusto, QuickBooks, ADP, and Paychex compared for multi-location operators.', link: '/guides/best-payroll-software' },
      { title: 'PandaDoc Review 2026: The Contract Tool That Replaced DocuSign for Us', pubDate: new Date('2026-03-24'), description: 'Proposals, contracts, and e-signatures in one platform with document analytics across 50+ venue agreements.', link: '/reviews/pandadoc' },
      { title: 'Kinsta vs SiteGround 2026: Which Hosting Is Right for Your Business?', pubDate: new Date('2026-03-24'), description: 'Premium vs value hosting. Kinsta for performance, SiteGround for budget.', link: '/comparisons/kinsta-vs-siteground' },
      { title: 'GoHighLevel Pricing 2026: What You Actually Pay at Every Tier', pubDate: new Date('2026-03-19'), description: 'Starter $97, Agency Unlimited $297, SaaS $497 -- what each tier includes, hidden costs, and which one operators actually need.', link: '/guides/gohighlevel-pricing' },
      { title: 'Best WiFi Management Software for Multi-Location Venues (2026)', pubDate: new Date('2026-03-18'), description: 'How to manage WiFi across 50+ venues -- access point selection, cloud management, captive portals, and network infrastructure.', link: '/guides/best-wifi-management' },
      { title: 'AWeber Review 2026: 25 Years of Email Marketing -- Still Worth It?', pubDate: new Date('2026-03-18'), description: 'Battle-tested deliverability and 50% lifetime affiliate commissions. After testing six platforms, here is where AWeber fits.', link: '/reviews/aweber' },
      { title: 'Thinkific Review 2026: Best Course Platform for Operator Training?', pubDate: new Date('2026-03-17'), description: 'After building a partner training program across 50+ venues, Thinkific is the platform that scaled.', link: '/reviews/thinkific' },
      { title: 'Thinkific vs Teachable 2026: Which Wins for Operator Training?', pubDate: new Date('2026-03-17'), description: 'Two course platforms, two different strengths. Thinkific wins for internal training, Teachable wins for selling.', link: '/comparisons/thinkific-vs-teachable' },
      { title: 'Best Software for Restaurant Chains and Multi-Location Food Service (2026)', pubDate: new Date('2026-03-14'), description: 'POS, scheduling, payroll, CRM, email, and WiFi -- the complete stack for multi-location restaurant operators.', link: '/guides/best-restaurant-software' },
      { title: 'Best Software for Franchise Operations in 2026', pubDate: new Date('2026-03-14'), description: 'CRM, training, project management, contracts, automation, and payroll for franchise operators scaling to 50+ units.', link: '/guides/best-franchise-software' },
      { title: 'Best Software for Salon and Spa Chains in 2026', pubDate: new Date('2026-03-14'), description: 'Booking, CRM, email, payroll, and WiFi management for multi-location salon and spa operators.', link: '/guides/best-salon-software' },
      { title: 'Best Software for Multi-Location Retail in 2026', pubDate: new Date('2026-03-14'), description: 'POS, inventory, CRM, email, and payroll for retail chains scaling across multiple locations.', link: '/guides/best-retail-software' },
      { title: 'Best CRM for Multi-Location Businesses in 2026', pubDate: new Date('2026-03-14'), description: 'Tested across 50+ venues. Here are the five CRMs that actually hold up at scale.', link: '/guides/crm-for-operators' },
      { title: 'Best Email Marketing Software for Small Business in 2026', pubDate: new Date('2026-03-14'), description: 'Tested six platforms. Here is which email tool works for operators.', link: '/guides/best-email-marketing' },
      { title: 'ConvertKit Review 2026: Built for Operators Who Actually Grow', pubDate: new Date('2026-03-14'), description: 'After testing six email platforms, ConvertKit is the one I kept.', link: '/reviews/convertkit' },
      { title: 'Kinsta Review 2026: Is the Premium Price Worth It?', pubDate: new Date('2026-03-14'), description: 'I moved three business sites to Kinsta. The performance difference is real.', link: '/reviews/kinsta' },
      { title: "How to Automate Client Onboarding: The Operator's 8-Step System", pubDate: new Date('2026-03-14'), description: 'I onboard new venue partners across 50+ locations without touching anything manually.', link: '/guides/automate-onboarding' },
      { title: 'GoHighLevel vs HubSpot 2026: Which Wins for Operators?', pubDate: new Date('2026-03-13'), description: 'A genuine head-to-head from an operator who has used both.', link: '/comparisons/gohighlevel-vs-hubspot' },
      { title: "GoHighLevel Review 2026: An Operator's Honest Take", pubDate: new Date('2026-03-13'), description: "I've deployed CRMs across 50+ venues. Here's why GHL finally replaced our entire stack.", link: '/reviews/gohighlevel' },
      { title: "The Operator's Tech Stack: 8 Tools That Run My Business", pubDate: new Date('2026-03-13'), description: 'Every tool I pay for monthly with exact costs and what each replaced.', link: '/guides/operator-tech-stack' },
    ],
    customData: '<language>en-us</language>',
  });
}
