/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
	readonly PUBLIC_GA_ID?: string;
	readonly SANITY_PROJECT_ID?: string;
	readonly SANITY_DATASET?: string;
	readonly SANITY_API_VERSION?: string;
	readonly SANITY_READ_TOKEN?: string;
	readonly SANITY_WRITE_TOKEN?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
