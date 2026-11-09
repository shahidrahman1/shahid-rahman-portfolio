/**
 * Every fact on this site comes from Shahid Rahman's resume.
 * Edit here, and the whole site updates. Do not add numbers that aren't on the resume.
 * The phone number is deliberately NOT included anywhere.
 */

export const profile = {
  name: "Shahid Rahman",
  firstName: "Shahid",
  lastName: "Rahman",
  role: "SEO & AI Search Strategist",
  email: "khanshahid78965@gmail.com",
  linkedin: "https://www.linkedin.com/in/shahidkhanseo/",
  linkedinHandle: "shahidkhanseo",
  // The resume has no city. Change this to your city (e.g. "Multan, Pakistan").
  location: "Pakistan",
  bio: "Technical SEO, content and links that grow organic visibility on Google and in AI search: AI Overviews, ChatGPT, Perplexity and Gemini.",
} as const;

export type Stat = { value: string; label: string };

export const heroStats: Stat[] = [
  { value: "+79%", label: "Organic clicks in 3 months · 288K → 516K" },
  { value: "#1", label: "Ranking for 5 high-intent business keywords" },
  { value: "519.5K", label: "Monthly organic traffic for a dental clinic" },
];

export const workStats: Stat[] = [
  { value: "+64.9K", label: "Organic clicks, education platform" },
  { value: "88", label: "Keywords driven into the Top 3" },
  { value: "12→180", label: "Organic keywords, NY agency" },
];

export type Project = {
  title: string;
  client: string;
  period?: string;
  highlight: Stat;
  bullets: string[];
  chips: string[];
  /** Optional public links. Only rendered when set — leave undefined rather than inventing URLs. */
  liveUrl?: string;
  codeUrl?: string;
};

export const projects: Project[] = [
  {
    title: "AI Search Visibility: AEO & SEO Growth",
    client: "North American power sector company",
    period: "May 2025 – Nov 2025",
    highlight: { value: "AI Overviews", label: "Featured for high-intent queries" },
    bullets: [
      "Improved organic visibility across Google and AI platforms: Google AI Overviews, ChatGPT, Perplexity and Gemini.",
      "Resolved technical SEO issues: sitemaps, crawlability and Core Web Vitals.",
      "Built semantic content clusters aligned with search intent, supported by structured data and a quality-focused backlink strategy.",
      "Site featured in Google AI Overviews for owner's engineer, substation design, NERC compliance and solar farm engineering services.",
    ],
    chips: ["AEO", "GEO", "Technical SEO", "Structured Data", "Content Clusters"],
  },
  {
    title: "AI SEO Audit & Technical SEO Optimization",
    client: "Comprehensive site audit",
    period: "Sep 2024",
    highlight: { value: "+79%", label: "Clicks in 3 months" },
    bullets: [
      "Audited crawlability, indexing, Core Web Vitals, internal linking, schema markup, metadata and canonical issues.",
      "Optimized content for semantic SEO, entity SEO, AEO and GEO.",
      "Clicks grew from 288K to 516K (+79%) within 3 months.",
      "Impressions grew from 5.96M to 10.49M (+76%); average position improved from 13.7 to 9.1.",
    ],
    chips: ["Technical SEO", "Schema Markup", "Entity SEO", "Core Web Vitals"],
  },
  {
    title: "USA Data Solutions: SEO & Link Building",
    client: "USA-based database company",
    highlight: { value: "#1", label: "For 5 high-intent keywords" },
    bullets: [
      "Implemented a targeted SEO and link-building strategy.",
      "Reached Position #1 for 5 high-intent business keywords.",
      "7 of 11 tracked keywords ranking in the Top 10.",
    ],
    chips: ["SEO Strategy", "Link Building", "Keyword Research"],
  },
  {
    title: "SEO Growth Strategy",
    client: "USA-based online education platform",
    highlight: { value: "+64.9K", label: "Organic clicks" },
    bullets: [
      "Delivered a complete SEO growth strategy.",
      "Drove +64,900 organic clicks and +1.22M impressions.",
      "Moved 88 keywords into the Top 3.",
    ],
    chips: ["SEO Strategy", "Content Strategy", "On-Page SEO"],
  },
  {
    title: "Dental Clinic SEO & Local Search",
    client: "Dental clinic",
    highlight: { value: "519.5K", label: "Monthly organic traffic" },
    bullets: [
      "Executed a focused SEO and local search strategy.",
      "Reached 519.5K monthly organic traffic.",
      "Grew to 99.9K ranking keywords with stronger local visibility.",
    ],
    chips: ["Local SEO", "Google Business Profile", "On-Page SEO"],
  },
  {
    title: "Link Building for a New York-Based Agency",
    client: "Nexora, NC",
    period: "Jul 2014 – May 2016",
    highlight: { value: "12→180", label: "Organic keywords" },
    bullets: [
      "Ran a 3-month link-building campaign with strategic guest posting and manual outreach.",
      "Secured high-quality, niche-relevant contextual backlinks that strengthened domain authority.",
      "Grew organic keywords from 12 to 180 and expanded the site's keyword footprint.",
    ],
    chips: ["Link Building", "Guest Posting", "Outreach"],
  },
];

/** Tools and platforms named on the resume. */
export const stack: string[] = [
  "Ahrefs",
  "Semrush",
  "Screaming Frog",
  "WordPress",
  "Google Analytics 4",
  "Google Search Console",
  "Google Business Profile",
  "Google AI Overviews",
  "ChatGPT",
  "Perplexity",
  "Gemini",
  "Schema Markup",
  "Core Web Vitals",
  "Excel",
];

export type RecordItem = {
  date: string;
  kind: "Experience" | "Education" | "Certification";
  title: string;
  org: string;
  note?: string;
};

export const record: RecordItem[] = [
  {
    date: "2026",
    kind: "Certification",
    title: "Google Analytics 4 Certified",
    org: "Google",
  },
  {
    date: "May 2025 – Nov 2025",
    kind: "Experience",
    title: "AI Search Visibility | AEO & SEO Growth",
    org: "North American power sector company",
    note: "Featured in Google AI Overviews for high-intent engineering service queries.",
  },
  {
    date: "Sep 2024",
    kind: "Experience",
    title: "AI SEO Audit & Technical SEO Optimization",
    org: "Technical SEO audit",
    note: "Clicks 288K → 516K, impressions 5.96M → 10.49M, avg. position 13.7 → 9.1.",
  },
  {
    date: "2024",
    kind: "Education",
    title: "Bachelor of Science in Physics",
    org: "Bahauddin Zakariya University",
    note: "GPA 3.60",
  },
  {
    date: "Nov 2023",
    kind: "Certification",
    title: "Foundations: Data, Data, Everywhere",
    org: "Google via Coursera",
  },
  {
    date: "Sep 2023",
    kind: "Certification",
    title: "Excel Skills for Business: Essentials",
    org: "Macquarie University via Coursera",
  },
  {
    date: "Aug 2023",
    kind: "Certification",
    title: "Financial Management Essentials Certificate Program",
    org: "DisasterReady (Cornerstone OnDemand Foundation)",
  },
  {
    // Dates exactly as written on the resume.
    date: "Jul 2014 – May 2016",
    kind: "Experience",
    title: "Link Building for a New York-Based Agency",
    org: "Nexora, NC",
    note: "Organic keywords grew from 12 to 180.",
  },
];

export const about = {
  paragraphs: [
    "I'm an SEO and AI search strategist. My job is to make websites easier to find, both on Google and on the AI platforms where people now ask their questions. That covers keyword research, technical SEO, content optimization and link building, plus Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO).",
    "I've worked with a North American power sector company, a USA-based database company, an online education platform, a dental clinic and a New York-based agency. I hold a BS in Physics from Bahauddin Zakariya University and I'm Google Analytics 4 certified.",
  ],
};

export type SkillIcon =
  | "search"
  | "sparkles"
  | "wrench"
  | "file"
  | "map"
  | "key"
  | "pen"
  | "link"
  | "activity"
  | "layers";

export const skills: { name: string; detail: string; icon: SkillIcon }[] = [
  { name: "Search Engine Optimization", detail: "SEO", icon: "search" },
  { name: "AI Search Optimization", detail: "GEO & AEO · AI Overviews, ChatGPT, Perplexity", icon: "sparkles" },
  { name: "Technical SEO", detail: "Audits, crawl, indexing, site speed", icon: "wrench" },
  { name: "On-Page SEO", detail: "Content, metadata, internal links", icon: "file" },
  { name: "Local SEO", detail: "Google Business Profile optimization", icon: "map" },
  { name: "Keyword Research", detail: "Search intent analysis", icon: "key" },
  { name: "SEO Content Strategy", detail: "Content briefs", icon: "pen" },
  { name: "Link Building", detail: "Off-page SEO", icon: "link" },
  { name: "GA4 & Search Console", detail: "Measurement and reporting", icon: "activity" },
  { name: "WordPress SEO", detail: "Ahrefs, Semrush, Screaming Frog", icon: "layers" },
];

/** Principles drawn directly from how the resume describes the work. */
export const principles: { title: string; body: string }[] = [
  {
    title: "Foundations first",
    body: "Sitemaps, crawlability, indexing and Core Web Vitals get fixed before anything else. Content can't rank on a site search engines can't read.",
  },
  {
    title: "Intent over keywords",
    body: "Content is organized into semantic clusters around what people actually search for, backed by structured data.",
  },
  {
    title: "Quality links only",
    body: "High-quality, niche-relevant, contextual backlinks earned through manual outreach and strategic guest posting.",
  },
  {
    title: "Visible wherever answers live",
    body: "Optimizing for Google and for AI-powered answers: AI Overviews, ChatGPT, Perplexity and Gemini.",
  },
];

export const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#stack", label: "Stack" },
  { href: "#record", label: "Record" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];
