import { sanityClient } from 'sanity:client';
import type { BlogCategory } from './categories';
import {
	AUTHOR_BY_SLUG_QUERY,
	AUTHORS_QUERY,
	POST_BY_SLUG_QUERY,
	POSTS_BY_AUTHOR_SLUG_QUERY,
	POSTS_BY_CATEGORY_QUERY,
	POSTS_QUERY,
	RELATED_POSTS_QUERY,
} from './queries';
import type { AuthorProfile, BlogPost, RawAuthorProfile, RawBlogPost } from './types';

const hasReadToken = typeof import.meta.env.SANITY_READ_TOKEN === 'string' && import.meta.env.SANITY_READ_TOKEN.length > 0;

const fetchOptions = hasReadToken
	? {
			token: import.meta.env.SANITY_READ_TOKEN,
			perspective: 'published' as const,
			useCdn: false,
		}
	: {
			perspective: 'published' as const,
			useCdn: true,
		};

function mapAuthor(author: RawAuthorProfile): AuthorProfile {
	return {
		_id: author._id,
		name: author.name,
		slug: author.slug,
		role: author.role,
		bio: author.bio,
		image: author.image,
		links: author.links,
	};
}

function mapPost(post: RawBlogPost): BlogPost {
	return {
		_id: post._id,
		id: post.slug,
		title: post.title,
		description: post.description,
		pubDate: new Date(post.publishedAt),
		updatedDate: post.updatedAt ? new Date(post.updatedAt) : undefined,
		category: post.category,
		heroImage: post.heroImage,
		body: post.body ?? [],
		author: post.author ? mapAuthor(post.author) : undefined,
	};
}

async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}) {
	return sanityClient.fetch<T>(query, params, fetchOptions);
}

export async function getAllPosts() {
	const posts = await fetchSanity<RawBlogPost[]>(POSTS_QUERY);
	return posts.map(mapPost);
}

export async function getPostBySlug(slug: string) {
	const post = await fetchSanity<RawBlogPost | null>(POST_BY_SLUG_QUERY, { slug });
	if (!post) {
		return null;
	}

	return mapPost(post);
}

export async function getPostsByCategory(category: BlogCategory) {
	const posts = await fetchSanity<RawBlogPost[]>(POSTS_BY_CATEGORY_QUERY, { category });
	return posts.map(mapPost);
}

export async function getRelatedPosts(category: BlogCategory, slug: string) {
	const posts = await fetchSanity<RawBlogPost[]>(RELATED_POSTS_QUERY, { category, slug });
	return posts.map(mapPost);
}

export async function getAllAuthors() {
	const authors = await fetchSanity<RawAuthorProfile[]>(AUTHORS_QUERY);
	return authors.map(mapAuthor);
}

export async function getAuthorBySlug(slug: string) {
	const author = await fetchSanity<RawAuthorProfile | null>(AUTHOR_BY_SLUG_QUERY, { slug });
	if (!author) {
		return null;
	}

	return mapAuthor(author);
}

export async function getPostsByAuthorSlug(authorSlug: string) {
	const posts = await fetchSanity<RawBlogPost[]>(POSTS_BY_AUTHOR_SLUG_QUERY, { authorSlug });
	return posts.map(mapPost);
}
