import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemaTypes';

const projectId = '2zosv2ys';
const dataset = 'production';

export default defineConfig({
	name: 'moneyjuan-cms',
	title: 'MoneyJuan CMS',
	projectId,
	dataset,
	plugins: [structureTool()],
	schema: {
		types: schemaTypes,
	},
});
