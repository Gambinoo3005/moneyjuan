// @ts-check

import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';
import sanity from '@sanity/astro';
import { defineConfig } from 'astro/config';

const sanityProjectId = process.env.SANITY_PROJECT_ID ?? '2zosv2ys';
const sanityDataset = process.env.SANITY_DATASET ?? 'production';
const sanityApiVersion = process.env.SANITY_API_VERSION ?? '2026-02-16';
const sanityReadToken = process.env.SANITY_READ_TOKEN;

// https://astro.build/config
export default defineConfig({
	site: 'https://moneyjuan.com',
	output: 'server',
	adapter: vercel(),
	integrations: [
		mdx(),
		react(),
		sanity({
			projectId: sanityProjectId,
			dataset: sanityDataset,
			apiVersion: sanityApiVersion,
			useCdn: true,
			...(sanityReadToken ? { token: sanityReadToken } : {}),
			studioBasePath: '/studio',
		}),
	],
	vite: {
		server: {
			headers: {
				// Avoid stale dev chunks when Studio dependencies are re-optimized.
				'Cache-Control': 'no-store',
			},
		},
		build: {
			assetsInlineLimit: 0,
		},
	},
});
