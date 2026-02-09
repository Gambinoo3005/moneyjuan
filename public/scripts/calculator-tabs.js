const tabs = document.querySelectorAll('.tab-btn');
const modules = document.querySelectorAll('.calculator-module');

tabs.forEach((tab) => {
	tab.addEventListener('click', () => {
		tabs.forEach((button) => button.classList.remove('active'));
		tab.classList.add('active');

		modules.forEach((module) => module.classList.add('hidden'));

		const targetId = tab.getAttribute('data-target');
		if (targetId) {
			document.getElementById(targetId)?.classList.remove('hidden');
		}
	});
});

window.addEventListener('restore-calc', (event) => {
	const customEvent = event;
	const typeToId = {
		Employee: 'employee-calculator',
		Freelancer: 'freelancer-calculator',
		Business: 'business-calculator',
		Bonus: 'bonus-calculator',
		Reverse: 'reverse-calculator',
	};

	const targetId = typeToId[customEvent.detail?.type];
	if (!targetId) return;

	const tabBtn = document.querySelector(`.tab-btn[data-target="${targetId}"]`);
	if (tabBtn && !tabBtn.classList.contains('active')) {
		tabBtn.click();
	}
});
