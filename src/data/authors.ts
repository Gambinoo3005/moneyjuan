export interface AuthorProfile {
	slug: string;
	name: string;
	role: string;
	image: string;
	bio: string;
}

export const AUTHORS: AuthorProfile[] = [
	{
		slug: 'bryan-jacinto',
		name: 'Bryan Jacinto',
		role: 'Founder, MoneyJuan',
		image: '/author/bryan_author.png',
		bio: 'Bryan Jacinto is a content strategist and researcher with a decade-long track record of driving growth for enterprise brands. As the founder of MoneyJuan, he translates complex economic trends into straightforward financial advice for the Filipino community. Bryan specializes in creating high-quality, research-founded guides that help readers navigate investments, budgeting, and the unique financial challenges of the Philippine landscape.',
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
