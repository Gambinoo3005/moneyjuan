const params = new URLSearchParams(window.location.search);
const rawQuery = params.get('q');
const searchStatus = document.getElementById('blog-search-status');
const pageTitle = document.querySelector('.page-title');
const postCards = Array.from(document.querySelectorAll('.post-card'));

if (rawQuery && rawQuery.trim().length > 0) {
	const query = rawQuery.trim().toLowerCase();
	let visibleCount = 0;

	for (const card of postCards) {
		const haystack = (card.getAttribute('data-search') || '').toLowerCase();
		const isMatch = haystack.includes(query);
		card.hidden = !isMatch;
		if (isMatch) visibleCount += 1;
	}

	if (pageTitle) {
		pageTitle.textContent = 'Search Results';
	}

	if (searchStatus) {
		searchStatus.hidden = false;
		searchStatus.textContent =
			visibleCount > 0
				? `Showing ${visibleCount} result${visibleCount === 1 ? '' : 's'} for "${rawQuery}".`
				: `No results found for "${rawQuery}".`;
		searchStatus.classList.toggle('is-empty', visibleCount === 0);
	}
}
