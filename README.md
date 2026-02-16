# MoneyJuan Blog

A content-driven blog platform built with Astro, focusing on delivering high-quality articles with optimal performance and SEO capabilities.

## Overview

This repository houses a modern blog platform using Astro SSR with Sanity as the content backend. The platform is optimized for multi-author publishing, search engine visibility, and a streamlined editorial workflow.

## Key Features

**Content Management**
- Sanity Studio embedded at `/studio` for multi-author publishing
- Author and post schemas with references and rich Portable Text editing
- URL-driven article search integrated into the site header

**Performance & SEO**
- SSR publishing flow for instant content updates
- Automatic sitemap generation for search engine crawling
- RSS feed support for content syndication
- Canonical URLs and OpenGraph metadata implementation
- Optimized image processing with Sharp

**Publishing Infrastructure**
- Sanity-backed editorial workflow (no Git commits required for content changes)
- Role-based author/editor access via Sanity project permissions
- Automated deployment with Vercel-compatible SSR output

## Technology Stack

- **Framework**: Astro 5.x
- **CMS**: Sanity (Studio + Content Lake)
- **Rendering**: Astro SSR/Hybrid on Vercel
- **Image Processing**: Sharp for optimized image delivery
- **Integrations**: Sitemap, RSS feed generation

## Content Strategy

The blog follows a structured content creation process with:
- Brand voice and style guidelines
- SEO-optimized article templates
- Internal and external linking strategies
- Quality assurance workflows

## Sanity CMS Setup

Set these environment variables locally and in Vercel:

```bash
SANITY_PROJECT_ID=2zosv2ys
SANITY_DATASET=production
SANITY_API_VERSION=2026-02-16
SANITY_READ_TOKEN=...
SANITY_WRITE_TOKEN=...
```

Run the one-time markdown migration:

```bash
npm run migrate:sanity
```

Then start the app and open Studio:

```bash
npm run dev
# Studio route: /studio
```

## Studio Troubleshooting

If `/studio` shows a blank page or errors like:
- `Failed to fetch dynamically imported module ... ViteDevServerStopped-*.js`
- missing files in `node_modules/.vite/deps/resources*.js`

Use this reset flow:

```bash
# stop any running dev servers first
npx rimraf node_modules/.vite .astro
npm run dev
```

Important:
- Run only one dev server at a time.
- Use `http://127.0.0.1:4321/studio` (same host as the dev script).

---

**Note**: This is a private repository for internal content management and development.
