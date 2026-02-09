import { getCollection } from 'astro:content';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { AUTHORS } from '../data/authors';

type SitemapEntry = {
	pathname: string;
	lastmod: Date;
	priority: string;
};

const BLOG_CATEGORIES = ['saving', 'earning', 'debt', 'investing', 'family', 'resources'] as const;
const TOP_GUIDE_PRIORITIES: Record<string, string> = {
	'20-20-60-budget-rule-25k-salary': '0.9',
};

const FALLBACK_SITE_URL = 'https://moneyjuan.com/';

const formatDate = (value: Date) => value.toISOString().slice(0, 10);

const escapeXml = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

const getMaxDate = (values: Date[], fallback: Date) => {
	if (values.length === 0) return fallback;
	return new Date(Math.max(...values.map((value) => value.getTime())));
};

const getSourceLastModified = async (relativePath: string) => {
	try {
		const fileStat = await stat(path.join(process.cwd(), relativePath));
		return fileStat.mtime;
	} catch {
		return new Date();
	}
};

const buildLoc = (pathname: string, baseUrl: URL) => new URL(pathname, baseUrl).toString();

export async function GET({ site }: { site?: URL }) {
	const baseUrl = site ?? new URL(FALLBACK_SITE_URL);
	const posts = await getCollection('blog');

	const postLastModifiedDates = posts.map((post) => post.data.updatedDate ?? post.data.pubDate);
	const blogIndexLastModified = getMaxDate(
		postLastModifiedDates,
		await getSourceLastModified('src/pages/blog/index.astro'),
	);
	const categoryPageLastModified = await getSourceLastModified('src/pages/blog/category/[category].astro');
	const authorPageLastModified = await getSourceLastModified('src/pages/author/[authorname].astro');
	const homePageLastModified = getMaxDate(
		[await getSourceLastModified('src/pages/index.astro'), blogIndexLastModified],
		blogIndexLastModified,
	);

	const entries: SitemapEntry[] = [
		{
			pathname: '/',
			lastmod: homePageLastModified,
			priority: '1.0',
		},
		{
			pathname: '/about/',
			lastmod: await getSourceLastModified('src/pages/about.astro'),
			priority: '0.5',
		},
		{
			pathname: '/contact/',
			lastmod: await getSourceLastModified('src/pages/contact.astro'),
			priority: '0.5',
		},
		{
			pathname: '/blog/',
			lastmod: blogIndexLastModified,
			priority: '0.8',
		},
		{
			pathname: '/tools/calculator/',
			lastmod: await getSourceLastModified('src/pages/tools/calculator.astro'),
			priority: '0.9',
		},
		{
			pathname: '/editorial-policy/',
			lastmod: await getSourceLastModified('src/pages/editorial-policy.astro'),
			priority: '0.4',
		},
		{
			pathname: '/financial-disclaimer/',
			lastmod: await getSourceLastModified('src/pages/financial-disclaimer.astro'),
			priority: '0.3',
		},
		{
			pathname: '/privacy/',
			lastmod: await getSourceLastModified('src/pages/privacy.astro'),
			priority: '0.3',
		},
		{
			pathname: '/terms/',
			lastmod: await getSourceLastModified('src/pages/terms.astro'),
			priority: '0.3',
		},
	];

	for (const category of BLOG_CATEGORIES) {
		const categoryPosts = posts.filter((post) => post.data.category === category);
		const categoryLastModified = getMaxDate(
			categoryPosts.map((post) => post.data.updatedDate ?? post.data.pubDate),
			categoryPageLastModified,
		);

		entries.push({
			pathname: `/blog/category/${category}/`,
			lastmod: categoryLastModified,
			priority: '0.6',
		});
	}

	for (const author of AUTHORS) {
		const authorPosts = posts.filter((post) => post.data.author.toLowerCase() === author.name.toLowerCase());
		const authorLastModified = getMaxDate(
			authorPosts.map((post) => post.data.updatedDate ?? post.data.pubDate),
			authorPageLastModified,
		);

		entries.push({
			pathname: `/author/${author.slug}/`,
			lastmod: authorLastModified,
			priority: '0.6',
		});
	}

	for (const post of posts) {
		entries.push({
			pathname: `/blog/${post.id}/`,
			lastmod: post.data.updatedDate ?? post.data.pubDate,
			priority: TOP_GUIDE_PRIORITIES[post.id] ?? '0.8',
		});
	}

	const uniqueEntries = Array.from(
		new Map(entries.map((entry) => [entry.pathname, entry])).values(),
	);

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueEntries
	.map(
		(entry) => `  <url>
    <loc>${escapeXml(buildLoc(entry.pathname, baseUrl))}</loc>
    <lastmod>${formatDate(entry.lastmod)}</lastmod>
    <priority>${entry.priority}</priority>
  </url>`,
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	});
}
