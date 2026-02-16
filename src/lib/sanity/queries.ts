const AUTHOR_PROJECTION = `{
	_id,
	name,
	"slug": slug.current,
	role,
	bio,
	image,
	links
}`;

const POST_PROJECTION = `{
	_id,
	title,
	description,
	"slug": slug.current,
	"publishedAt": coalesce(publishedAt, _createdAt),
	updatedAt,
	category,
	heroImage,
	body,
	"author": author->${AUTHOR_PROJECTION}
}`;

const PUBLISHED_POST_FILTER = `_type == "post" && defined(slug.current) && !(_id in path("drafts.**")) && coalesce(publishedAt, _createdAt) <= now()`;

export const POSTS_QUERY = `*[
	${PUBLISHED_POST_FILTER}
] | order(coalesce(publishedAt, _createdAt) desc) ${POST_PROJECTION}`;

export const POST_BY_SLUG_QUERY = `*[
	${PUBLISHED_POST_FILTER} && slug.current == $slug
][0] ${POST_PROJECTION}`;

export const POSTS_BY_CATEGORY_QUERY = `*[
	${PUBLISHED_POST_FILTER} && category == $category
] | order(coalesce(publishedAt, _createdAt) desc) ${POST_PROJECTION}`;

export const RELATED_POSTS_QUERY = `*[
	${PUBLISHED_POST_FILTER} && category == $category && slug.current != $slug
] | order(coalesce(publishedAt, _createdAt) desc)[0...3] ${POST_PROJECTION}`;

export const POSTS_BY_AUTHOR_SLUG_QUERY = `*[
	${PUBLISHED_POST_FILTER} && author->slug.current == $authorSlug
] | order(coalesce(publishedAt, _createdAt) desc) ${POST_PROJECTION}`;

export const AUTHORS_QUERY = `*[
	_type == "author" && defined(slug.current)
] | order(name asc) ${AUTHOR_PROJECTION}`;

export const AUTHOR_BY_SLUG_QUERY = `*[
	_type == "author" && slug.current == $slug
][0] ${AUTHOR_PROJECTION}`;
