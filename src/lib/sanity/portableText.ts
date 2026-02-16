import type { TocHeading } from './types';

function joinText(value: unknown): string {
	if (!value) {
		return '';
	}

	if (typeof value === 'string') {
		return value;
	}

	if (Array.isArray(value)) {
		return value.map((item) => joinText(item)).join('');
	}

	if (typeof value === 'object') {
		const node = value as { text?: unknown; children?: unknown };
		if (typeof node.text === 'string') {
			return node.text;
		}
		if (node.children) {
			return joinText(node.children);
		}
	}

	return '';
}

export function portableTextToPlainText(value: unknown) {
	return joinText(value).trim();
}

export function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

export function getPortableTextHeadings(blocks: unknown[]): TocHeading[] {
	const headings: TocHeading[] = [];

	for (const block of blocks ?? []) {
		if (!block || typeof block !== 'object') {
			continue;
		}

		const node = block as { _type?: string; style?: string; children?: unknown };
		if (node._type !== 'block') {
			continue;
		}

		if (!node.style || !['h2', 'h3', 'h4'].includes(node.style)) {
			continue;
		}

		const text = portableTextToPlainText(node.children);
		if (!text) {
			continue;
		}

		headings.push({
			depth: Number(node.style.slice(1)),
			slug: slugify(text),
			text,
		});
	}

	return headings;
}
