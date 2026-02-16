export const BLOG_CATEGORIES = [
	'saving',
	'earning',
	'debt',
	'investing',
	'family',
	'resources',
	'events',
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
	saving: 'Saving & Budgeting',
	earning: 'Earning More',
	debt: 'Debt & Credit',
	investing: 'Investing',
	family: 'Family & Life Goals',
	resources: 'Resources',
	events: 'Financial Events',
};

export function isBlogCategory(value: string): value is BlogCategory {
	return BLOG_CATEGORIES.includes(value as BlogCategory);
}

export function formatCategoryLabel(category?: string | null) {
	if (!category) {
		return 'Article';
	}

	if (isBlogCategory(category)) {
		return CATEGORY_LABELS[category];
	}

	return category.replace(/-/g, ' ');
}

export function toTitleCase(value: string) {
	return value
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}
