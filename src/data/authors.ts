export interface AuthorProfile {
	slug: string;
	name: string;
	role: string;
	image: string;
	bio: string;
	links?: {
		linkedin?: string;
		website?: string;
		email?: string;
	};
}

export const AUTHORS: AuthorProfile[] = [
	{
		slug: 'bryan-jacinto',
		name: 'Bryan Jacinto',
		role: 'Founder, MoneyJuan',
		image: '/author/bryan_author.png',
		bio: 'Bryan Jacinto is a content strategist and researcher with a decade-long track record of driving growth for enterprise brands. As the founder of MoneyJuan, he translates complex economic trends into straightforward financial advice for the Filipino community. Bryan specializes in creating high-quality, research-founded guides that help readers navigate investments, budgeting, and the unique financial challenges of the Philippine landscape.',
		links: {
			linkedin: 'https://www.linkedin.com/in/bryan-jacinto-writer/',
			website: 'https://bryanjacinto.com',
			email: 'bryan@moneyjuan.com',
		},
	},
	{
		slug: 'jhaeyd-qynfei-buere',
		name: 'Jhaeyd Qynfei Buere',
		role: 'Contributor',
		image: '/author/jhaeyd_author.webp',
		bio: 'Jhaeyd Qynfei Buere is an SEO content writer with a track record of driving digital growth for international brands. From refining AI-driven strategies to boosting e-commerce visibility, she specializes in making information both searchable and impactful. At MoneyJuan, she blends her technical expertise with clear storytelling to help Filipinos master their finances.',
		links: {
			linkedin: 'https://www.linkedin.com/in/jhaeyd-qynfei-buere-6a4698313/',
			email: 'jhaeydqyn@gmail.com',
		},
	},
];

const authorsBySlug = new Map(AUTHORS.map((author) => [author.slug, author]));
const authorsByName = new Map(AUTHORS.map((author) => [author.name.toLowerCase(), author]));

export function getAuthorBySlug(slug: string) {
	return authorsBySlug.get(slug);
}

export function getAuthorByName(name: string) {
	return authorsByName.get(name.trim().toLowerCase());
}
