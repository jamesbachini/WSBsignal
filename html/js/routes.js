import { utils } from './../core/utils.js';
/* global vSettings */

export const routes = {
	init: async () => {
		const get = utils.getQueryParams();
		if (get.page && get.page === 'home') {
			// Home Page
			await utils.loadModule('pages/home.html','content');
			utils.setTitle(`${vSettings.brand} | Home`);
		} else if (get.page && get.page === 'terms') {
			// Terms & Conditions
			await utils.loadModule('pages/terms.html','content', (pageContent) => {
				return pageContent.split('[brand]').join(vSettings.brand);
			});
			utils.setTitle(`${vSettings.brand} Terms and Conditions`);
		} else if (get.page && get.page === 'privacy') {
			// Privacy Policy
			await utils.loadModule('pages/privacy.html','content', (pageContent) => {
				return pageContent.split('[brand]').join(vSettings.brand);
			});
			utils.setTitle(`${vSettings.brand} Privacy Policy`);
		} else if (get.page && get.page === 'smallstreetbets') {
			await utils.loadModule('pages/smallstreetbets.html','content');
			utils.setTitle(`SmallStreetBets | Filtered News Feed`);
		} else if (get.page && get.page === 'investing') {
			await utils.loadModule('pages/investing.html','content');
			utils.setTitle(`r/Investing | Todays Best Posts`);
		} else if (get.page && get.page === 'cryptocurrency') {
			await utils.loadModule('pages/cryptocurrency.html','content');
			utils.setTitle(`r/Cryptocurrency | Signal Separated From Noise`);
		} else if (get.page) {
			// automatically catch any pages without dedicated routes
			const cleanPage = utils.cleanString(get.page);
			const cleanTitle = utils.titleCase(cleanPage);
			await utils.loadModule(`pages/${cleanPage}.html`,'content');
			utils.setTitle(`${vSettings.brand} | ${cleanTitle}`);
		} else {
			// load home page if no page= variable specified in URL
			await utils.loadModule('pages/home.html','content');
			utils.setTitle(`WSBsignal | WallStreetBets Signal`);
			utils.setDescription(`Separating the signal from the noise on WallStreetBets.`);
		}
		utils.scrollTo();
		return true;
	},
}
