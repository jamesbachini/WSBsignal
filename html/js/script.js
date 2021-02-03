import { utils } from './../core/utils.js';
import { core } from './../core/core.js';

window.vSettings = {
	brand: 'WSBsignal',
}

core.init();

utils.loadModule('components/feedback.html','feedback');

window.timeSince = (ts) => {
	const date = new Date(ts);
	const seconds = Math.floor((new Date() - date) / 1000);
	let interval = Math.floor(seconds / 31536000);
	if (interval > 1) {
		return interval + ' years ago';
	}
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
		return interval + ' months ago';
	}
	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
		return interval + ' days ago';
	}
	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
		return interval + ' hours ago';
	}
	interval = Math.floor(seconds / 60);
	if (interval > 1) {
		return interval + ' minutes ago';
	}
	return Math.floor(seconds) + ' seconds ago';
}

window.decodeHtml = (html) => {
	const txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
}

(async () => {
	window.wsbData = await utils.loadJSON('./../wsbdata.json');
	const loc = window.location.toString();
	if (loc.includes('smallstreetbets') || loc.includes('investing') || loc.includes('cryptocurrency')) {
		window.altData = await utils.loadJSON('./../altdata.json');
	}
})();