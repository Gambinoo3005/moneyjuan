import { defineArrayMember, defineField, defineType } from 'sanity';

const categoryOptions = [
	{ title: 'Saving & Budgeting', value: 'saving' },
	{ title: 'Earning More', value: 'earning' },
	{ title: 'Debt & Credit', value: 'debt' },
	{ title: 'Investing', value: 'investing' },
	{ title: 'Family & Life Goals', value: 'family' },
	{ title: 'Resources', value: 'resources' },
	{ title: 'Financial Events', value: 'events' },
];

export const postType = defineType({
	name: 'post',
	title: 'Post',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'title', maxLength: 120 },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required().max(300),
		}),
		defineField({
			name: 'publishedAt',
			title: 'Published At',
			type: 'datetime',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'updatedAt',
			title: 'Updated At',
			type: 'datetime',
		}),
		defineField({
			name: 'category',
			title: 'Category',
			type: 'string',
			options: {
				list: categoryOptions,
				layout: 'dropdown',
			},
		}),
		defineField({
			name: 'author',
			title: 'Author',
			type: 'reference',
			to: [{ type: 'author' }],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'heroImage',
			title: 'Hero Image',
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
			name: 'body',
			title: 'Body',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'block',
					styles: [
						{ title: 'Normal', value: 'normal' },
						{ title: 'Heading 2', value: 'h2' },
						{ title: 'Heading 3', value: 'h3' },
						{ title: 'Heading 4', value: 'h4' },
						{ title: 'Quote', value: 'blockquote' },
					],
					lists: [{ title: 'Bullet', value: 'bullet' }, { title: 'Numbered', value: 'number' }],
					marks: {
						decorators: [
							{ title: 'Strong', value: 'strong' },
							{ title: 'Emphasis', value: 'em' },
							{ title: 'Underline', value: 'underline' },
							{ title: 'Code', value: 'code' },
						],
						annotations: [
							{
								name: 'link',
								type: 'object',
								title: 'Link',
								fields: [
									defineField({
										name: 'href',
										type: 'url',
										title: 'URL',
									}),
								],
							},
						],
					},
				}),
				defineArrayMember({
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
			],
		}),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'author.name',
			media: 'heroImage',
		},
	},
});
