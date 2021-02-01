import { utils } from './../core/utils.js';
import { core } from './../core/core.js';

window.vSettings = {
	brand: 'WSBsignal',
}

core.init();

utils.loadModule('components/feedback.html','feedback');

(async () => {
	window.wsbData = await utils.loadJSON('./../wsbdata.json');
})();