const menuToggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('primary-nav');
const searchOverlay = document.getElementById('header-search-overlay');
const searchOverlayForm = searchOverlay?.querySelector('.search-overlay-form');
const searchInput = document.getElementById('header-search-input');
const searchOpenButtons = document.querySelectorAll('[data-search-open]');

const closeMenu = () => {
	if (!menuToggle || !nav) return;
	nav.classList.remove('is-open');
	menuToggle.setAttribute('aria-expanded', 'false');
};

const openSearch = () => {
	if (!searchOverlay) return;
	closeMenu();
	searchOverlay.classList.add('is-open');
	searchOverlay.setAttribute('aria-hidden', 'false');
	searchInput?.focus();
};

const closeSearch = () => {
	if (!searchOverlay) return;
	searchOverlay.classList.remove('is-open');
	searchOverlay.setAttribute('aria-hidden', 'true');
};

searchOpenButtons.forEach((button) => {
	button.addEventListener('click', openSearch);
});

if (searchOverlay) {
	searchOverlay.addEventListener('click', (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		if (target.closest('[data-search-open]')) return;
		if (searchOverlayForm && searchOverlayForm.contains(target)) return;
		closeSearch();
	});
}

if (menuToggle && nav) {
	menuToggle.addEventListener('click', () => {
		const isOpen = nav.classList.toggle('is-open');
		menuToggle.setAttribute('aria-expanded', String(isOpen));
	});

	nav.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', () => {
			if (window.matchMedia('(max-width: 900px)').matches) {
				closeMenu();
			}
		});
	});

	window.addEventListener('resize', () => {
		if (window.innerWidth > 900) {
			closeMenu();
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			if (searchOverlay?.classList.contains('is-open')) {
				closeSearch();
			} else {
				closeMenu();
			}
		}
	});
}
