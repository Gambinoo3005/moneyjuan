import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from 'sanity:client';

type ImageUrlOptions = {
	width?: number;
	height?: number;
};

const imageBuilder = imageUrlBuilder(sanityClient);

export function getSanityImageUrl(source: unknown, options: ImageUrlOptions = {}) {
	if (!source) {
		return null;
	}

	let builder = imageBuilder.image(source).auto('format');

	if (options.width) {
		builder = builder.width(options.width);
	}

	if (options.height) {
		builder = builder.height(options.height);
	}

	return builder.url();
}
