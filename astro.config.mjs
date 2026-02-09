// @ts-check

import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://moneyjuan.com',
	integrations: [mdx()],
	vite: {
		build: {
			assetsInlineLimit: 0,
		},
	},
});
