import type { TypedObject } from '@portabletext/types';
import type { BlogCategory } from './categories';

export interface SanityReference {
	_ref: string;
	_type: 'reference';
}

export interface SanityImage {
	_type: 'image';
	asset?: SanityReference;
	alt?: string;
}

export interface AuthorLinks {
	linkedin?: string;
	website?: string;
	email?: string;
}

export interface AuthorProfile {
	_id: string;
	name: string;
	slug: string;
	role?: string;
	bio?: string;
	image?: SanityImage;
	links?: AuthorLinks;
}

export interface BlogPost {
	_id: string;
	id: string;
	title: string;
	description: string;
	pubDate: Date;
	updatedDate?: Date;
	category?: BlogCategory;
	heroImage?: SanityImage;
	body: TypedObject[];
	author?: AuthorProfile;
}

export interface RawAuthorProfile {
	_id: string;
	name: string;
	slug: string;
	role?: string;
	bio?: string;
	image?: SanityImage;
	links?: AuthorLinks;
}

export interface RawBlogPost {
	_id: string;
	slug: string;
	title: string;
	description: string;
	publishedAt: string;
	updatedAt?: string;
	category?: BlogCategory;
	heroImage?: SanityImage;
	body?: TypedObject[];
	author?: RawAuthorProfile;
}

export interface TocHeading {
	depth: number;
	slug: string;
	text: string;
}
