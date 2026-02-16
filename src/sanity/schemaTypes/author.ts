import { defineField, defineType } from 'sanity';

export const authorType = defineType({
	name: 'author',
	title: 'Author',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Name',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'name', maxLength: 96 },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'role',
			title: 'Role',
			type: 'string',
		}),
		defineField({
			name: 'image',
			title: 'Profile Image',
			type: 'image',
			options: { hotspot: true },
			fields: [
				defineField({
					name: 'alt',
					title: 'Alt Text',
					type: 'string',
				}),
			],
		}),
		defineField({
			name: 'bio',
			title: 'Bio',
			type: 'text',
			rows: 6,
		}),
		defineField({
			name: 'links',
			title: 'Links',
			type: 'object',
			fields: [
				defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
				defineField({ name: 'website', title: 'Website URL', type: 'url' }),
				defineField({ name: 'email', title: 'Email', type: 'string' }),
			],
		}),
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'role',
			media: 'image',
		},
	},
});
