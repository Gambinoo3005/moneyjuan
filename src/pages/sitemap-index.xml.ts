const FALLBACK_SITE_URL = 'https://moneyjuan.com/';

const formatDate = (value: Date) => value.toISOString().slice(0, 10);

const escapeXml = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

export const prerender = false;

export async function GET({ site }: { site?: URL }) {
	const baseUrl = site ?? new URL(FALLBACK_SITE_URL);
	const sitemapLoc = new URL('/sitemap-0.xml', baseUrl).toString();
	const lastmod = formatDate(new Date());

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${escapeXml(sitemapLoc)}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	});
}
