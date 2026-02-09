const copyButton = document.querySelector('.copy-link');

const createCheckIcon = () => {
	const NS = 'http://www.w3.org/2000/svg';
	const svg = document.createElementNS(NS, 'svg');
	svg.setAttribute('xmlns', NS);
	svg.setAttribute('width', '20');
	svg.setAttribute('height', '20');
	svg.setAttribute('viewBox', '0 0 24 24');
	svg.setAttribute('fill', 'none');
	svg.setAttribute('stroke', 'currentColor');
	svg.setAttribute('stroke-width', '2');
	svg.setAttribute('stroke-linecap', 'round');
	svg.setAttribute('stroke-linejoin', 'round');

	const polyline = document.createElementNS(NS, 'polyline');
	polyline.setAttribute('points', '20 6 9 17 4 12');
	svg.appendChild(polyline);

	return svg;
};

if (copyButton) {
	let resetTimer;

	copyButton.addEventListener('click', async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);

			const originalNodes = Array.from(copyButton.childNodes).map((node) => node.cloneNode(true));
			copyButton.replaceChildren(createCheckIcon());
			copyButton.style.color = 'var(--color-primary)';
			copyButton.style.borderColor = 'var(--color-primary)';

			if (resetTimer) {
				clearTimeout(resetTimer);
			}

			resetTimer = setTimeout(() => {
				copyButton.replaceChildren(...originalNodes);
				copyButton.style.color = '';
				copyButton.style.borderColor = '';
			}, 2000);
		} catch (err) {
			console.error('Failed to copy link:', err);
		}
	});
}

const progressBar = document.getElementById('reading-progress');
const tocLinks = document.querySelectorAll('.toc-item a');
const toc = document.querySelector('.toc');
const headings = Array.from(document.querySelectorAll('.prose h2, .prose h3, .prose h4'));
const prose = document.querySelector('.prose');
let activeHeadingId = '';

function updateProgress() {
	if (!progressBar || !prose) return;

	const scrollTop = window.scrollY;
	const viewportHeight = window.innerHeight;
	const proseRect = prose.getBoundingClientRect();
	const proseTop = proseRect.top + scrollTop;
	const proseHeight = proseRect.height;

	const start = proseTop - viewportHeight * 0.2;
	const end = proseTop + proseHeight - viewportHeight * 0.5;

	let progress = 0;
	if (scrollTop > start) {
		progress = ((scrollTop - start) / (end - start)) * 100;
	}

	progress = Math.max(0, Math.min(100, progress));
	progressBar.style.width = `${progress}%`;
}

function updateActiveToc() {
	let currentHeadingId = '';

	for (const heading of headings) {
		const headingTop = heading.getBoundingClientRect().top;
		if (headingTop <= 170) {
			currentHeadingId = heading.getAttribute('id') || '';
		} else {
			break;
		}
	}

	if (!currentHeadingId && headings.length > 0) {
		currentHeadingId = headings[0].getAttribute('id') || '';
	}

	if (currentHeadingId === activeHeadingId) return;
	activeHeadingId = currentHeadingId;

	let activeLink = null;
	tocLinks.forEach((link) => {
		const isActive = link.getAttribute('href') === `#${currentHeadingId}`;
		link.classList.toggle('active', isActive);
		if (isActive) {
			activeLink = link;
		}
	});

	if (activeLink && toc) {
		const desiredTop = activeLink.offsetTop - toc.clientHeight * 0.35;
		const maxTop = toc.scrollHeight - toc.clientHeight;
		const nextTop = Math.max(0, Math.min(desiredTop, maxTop));
		toc.scrollTo({ top: nextTop, behavior: 'smooth' });
	}
}

let ticking = false;
const handleScroll = () => {
	if (ticking) return;
	ticking = true;
	requestAnimationFrame(() => {
		updateProgress();
		updateActiveToc();
		ticking = false;
	});
};

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', handleScroll);

updateProgress();
updateActiveToc();
