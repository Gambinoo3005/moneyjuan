import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';
import { JSDOM } from 'jsdom';
import { htmlToBlocks } from '@portabletext/block-tools';
import { Schema } from '@sanity/schema';
import { createClient } from '@sanity/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const BLOG_CONTENT_DIR = path.join(ROOT_DIR, 'src', 'content', 'blog');

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID ?? '2zosv2ys';
const SANITY_DATASET = process.env.SANITY_DATASET ?? 'production';
const SANITY_API_VERSION = process.env.SANITY_API_VERSION ?? '2026-02-16';
const SANITY_WRITE_TOKEN = process.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_READ_TOKEN;

if (!SANITY_WRITE_TOKEN) {
	throw new Error(
		'Missing SANITY_WRITE_TOKEN (or SANITY_READ_TOKEN). Set one of them before running migration.',
	);
}

const client = createClient({
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET,
	apiVersion: SANITY_API_VERSION,
	useCdn: false,
	token: SANITY_WRITE_TOKEN,
});

const AUTHORS = [
	{
		slug: 'bryan-jacinto',
		name: 'Bryan Jacinto',
		role: 'Founder, MoneyJuan',
		imagePath: '/author/bryan_author.png',
		bio: 'Bryan Jacinto is a content strategist and researcher with a decade-long track record of driving growth for enterprise brands. As the founder of MoneyJuan, he translates complex economic trends into straightforward financial advice for the Filipino community. Bryan specializes in creating high-quality, research-founded guides that help readers navigate investments, budgeting, and the unique financial challenges of the Philippine landscape.',
		links: {
			linkedin: 'https://www.linkedin.com/in/bryan-jacinto-writer/',
			website: 'https://bryanjacinto.com',
			email: 'bryan@moneyjuan.com',
		},
	},
	{
		slug: 'jhaeyd-qynfei-buere',
		name: 'Jhaeyd Buere',
		role: 'Contributor',
		imagePath: '/author/jhaeyd_author.webp',
		bio: 'Jhaeyd Buere is an SEO content writer with a track record of driving digital growth for international brands. From refining AI-driven strategies to boosting e-commerce visibility, she specializes in making information both searchable and impactful. At MoneyJuan, she blends her technical expertise with clear storytelling to help Filipinos master their finances.',
		links: {
			linkedin: 'https://www.linkedin.com/in/jhaeyd-qynfei-buere-6a4698313/',
			email: 'jhaeydqyn@gmail.com',
		},
	},
];

const EXTENSION_TO_CONTENT_TYPE = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
};

const schema = Schema.compile({
	name: 'moneyjuanImportSchema',
	types: [
		{
			name: 'post',
			type: 'document',
			fields: [
				{
					name: 'body',
					type: 'array',
					of: [{ type: 'block' }],
				},
			],
		},
	],
});

const bodyField = schema
	.get('post')
	.fields.find((field) => field.name === 'body');

if (!bodyField) {
	throw new Error('Could not find body field in import schema.');
}

const portableTextBodyType = bodyField.type;
const imageCache = new Map();

const sanitizeDoc = (doc) =>
	Object.fromEntries(Object.entries(doc).filter(([, value]) => value !== undefined));

function toIsoDate(value, fieldName, fileName) {
	if (!value) {
		return undefined;
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		throw new Error(`Invalid ${fieldName} in ${fileName}: ${String(value)}`);
	}

	return date.toISOString();
}

async function uploadImage(filePath, fallbackAltText) {
	if (!filePath) {
		return undefined;
	}

	const normalizedPath = path.resolve(filePath);
	if (imageCache.has(normalizedPath)) {
		const cachedImage = imageCache.get(normalizedPath);
		return fallbackAltText
			? { ...cachedImage, alt: fallbackAltText }
			: cachedImage;
	}

	const imageBuffer = await fs.readFile(normalizedPath);
	const extension = path.extname(normalizedPath).toLowerCase();
	const contentType = EXTENSION_TO_CONTENT_TYPE[extension] ?? undefined;

	const asset = await client.assets.upload('image', imageBuffer, {
		filename: path.basename(normalizedPath),
		...(contentType ? { contentType } : {}),
	});

	const imageValue = {
		_type: 'image',
		asset: {
			_type: 'reference',
			_ref: asset._id,
		},
	};

	imageCache.set(normalizedPath, imageValue);

	return fallbackAltText
		? {
			...imageValue,
			alt: fallbackAltText,
		}
		: imageValue;
}

function resolveAuthorImagePath(relativePath) {
	if (!relativePath) {
		return undefined;
	}

	const trimmed = relativePath.replace(/^\//, '');
	return path.join(ROOT_DIR, 'public', trimmed);
}

function resolvePostHeroPath(postFilePath, heroPath) {
	if (!heroPath) {
		return undefined;
	}

	return path.resolve(path.dirname(postFilePath), heroPath);
}

function markdownToPortableText(markdown) {
	const html = marked.parse(markdown);
	const blocks = htmlToBlocks(html, portableTextBodyType, {
		parseHtml: (input) => new JSDOM(input).window.document,
	});

	if (blocks.length > 0) {
		return blocks;
	}

	return [
		{
			_type: 'block',
			style: 'normal',
			markDefs: [],
			children: [
				{
					_type: 'span',
					text: markdown,
					marks: [],
				},
			],
		},
	];
}

async function migrateAuthors() {
	const authorIdByName = new Map();

	for (const author of AUTHORS) {
		const authorId = `author.${author.slug}`;
		const imagePath = resolveAuthorImagePath(author.imagePath);
		const image = imagePath ? await uploadImage(imagePath, author.name) : undefined;

		const authorDoc = sanitizeDoc({
			_id: authorId,
			_type: 'author',
			name: author.name,
			slug: {
				_type: 'slug',
				current: author.slug,
			},
			role: author.role,
			bio: author.bio,
			image,
			links: author.links,
		});

		await client.createOrReplace(authorDoc);
		authorIdByName.set(author.name.trim().toLowerCase(), authorId);
		console.log(`Synced author: ${author.name}`);
	}

	return authorIdByName;
}

async function migratePosts(authorIdByName) {
	const files = (await fs.readdir(BLOG_CONTENT_DIR))
		.filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
		.sort();

	for (const file of files) {
		const postFilePath = path.join(BLOG_CONTENT_DIR, file);
		const fileContents = await fs.readFile(postFilePath, 'utf8');
		const { data, content } = matter(fileContents);

		const slug = file.replace(/\.mdx?$/i, '');
		const authorName = typeof data.author === 'string' ? data.author.trim().toLowerCase() : '';
		const authorId = authorIdByName.get(authorName);
		if (!authorId) {
			throw new Error(`No matching author found for "${data.author}" in ${file}`);
		}

		const heroImagePath = resolvePostHeroPath(postFilePath, data.heroImage);
		const heroImage = heroImagePath ? await uploadImage(heroImagePath, data.title) : undefined;
		const body = markdownToPortableText(content);

		const postDoc = sanitizeDoc({
			_id: `post.${slug}`,
			_type: 'post',
			title: data.title,
			description: data.description,
			slug: {
				_type: 'slug',
				current: slug,
			},
			publishedAt: toIsoDate(data.pubDate, 'pubDate', file),
			updatedAt: toIsoDate(data.updatedDate, 'updatedDate', file),
			category: data.category,
			author: {
				_type: 'reference',
				_ref: authorId,
			},
			heroImage,
			body,
		});

		await client.createOrReplace(postDoc);
		console.log(`Synced post: ${slug}`);
	}
}

async function run() {
	console.log(`Sanity project: ${SANITY_PROJECT_ID}, dataset: ${SANITY_DATASET}`);
	console.log('Starting migration...');

	const authorIdByName = await migrateAuthors();
	await migratePosts(authorIdByName);

	console.log('Migration complete.');
}

run().catch((error) => {
	console.error('Migration failed:', error);
	process.exit(1);
});
