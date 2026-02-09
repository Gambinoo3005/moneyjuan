import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { AUTHORS } from './data/authors';

const AUTHOR_NAMES = AUTHORS.map((author) => author.name) as [string, ...string[]];

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			category: z.enum(['saving', 'earning', 'debt', 'investing', 'family', 'resources', 'events']).optional(),
			author: z.enum(AUTHOR_NAMES),
		}),
});

export const collections = { blog };
