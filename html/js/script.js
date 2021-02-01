import { utils } from './../core/utils.js';
import { core } from './../core/core.js';

window.vSettings = {
	brand: 'WSBsignal',
}

core.init();

(async () => {
	window.wsbData = await utils.loadJSON('./../wsbdata.json');
})();