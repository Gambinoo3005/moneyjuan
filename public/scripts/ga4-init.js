(function initGa4() {
	const currentScript = document.currentScript;
	if (!(currentScript instanceof HTMLScriptElement)) return;

	const measurementId = new URL(currentScript.src, window.location.href).searchParams.get('id');
	if (!measurementId) return;

	// Keep GA data clean by tracking only production domains.
	const productionHosts = new Set(['moneyjuan.com', 'www.moneyjuan.com']);
	if (!productionHosts.has(window.location.hostname)) return;

	window.dataLayer = window.dataLayer || [];
	function gtag() {
		window.dataLayer.push(arguments);
	}
	window.gtag = gtag;

	gtag('js', new Date());
	gtag('config', measurementId, {
		anonymize_ip: true,
		allow_google_signals: false,
		send_page_view: true,
	});
})();
