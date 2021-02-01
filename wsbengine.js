const fs = require('fs');
const fetch = require('node-fetch');

let data = {
	keywords: [],
	bestPosts: {},
	keywordsArr: [],
	tickers: [],
	prices: {},
	stats: {},
};

fs.readFile('./html/wsbbackup.json', 'utf-8', (err, content) => {
	try {
		data = JSON.parse(content);
	} catch (e) {
		console.log(`Couldn't find html/wsbbackup.json, starting again...`);
	}
});

const badTickers = ['WSB','FUD','HODL','THE','THIS','THAT','AND','BUY','SELL','STOCK','LIKE','PRICE','ORDER','APE','IS','TV','NOT','SEC','HOLD','TLDR','YOU','BS','DFV','YOUR','TO', 'US','LIFE','IF','IT','DO','ON','USD','LIMIT','ARE','OF','ATM','PLAY','PUTS','CALLS','YOLO','IN','WE','BE','BY','APES','AN','CAN','WILL','STOP','FUCK','AUM','APR','IQ','NYC','FBI','DYOR','SPAC'];

const getStats = async () => {
	const dat1 = await fetch(`https://www.reddit.com/r/wallstreetbets/about.json`).catch(err => console.log(err));
	const res1 = await dat1.json().catch(err => console.log(err));
	if (!data.stats) data.stats = {};
	data.stats.subscribers = res1.data.subscribers;
	data.stats.active = res1.data.active_user_count;
}

const findKeywords = async () => {
	//const res = await reddit.get('/r/wallstreetbets/new');
	const dat1 = await fetch(`https://www.reddit.com/r/wallstreetbets/new.json`).catch(err => console.log(err));
	const res1 = await dat1.json().catch(err => console.log(err));
	const keywords = {};
	res1.data.children.forEach((c) => {
		const text = c.data.selftext;
		if (text) {
			let capitalCount = 0;
			text.match(/\S+\s*/g).forEach((word) => {
				if (capitalCount > 5) return false;
				word = word.trim();
				if (word.includes('$')) word = word.split('$').join('');
				if (word.length < 2) return false;
				if (word.length > 5) return false;
				if (word !== word.toUpperCase()) return false;
				if (word.split(/[^A-Z]/).join('') !== word) return false;
				if (badTickers.includes(word)) return false;
				if (!keywords[word]) keywords[word] = 0;
				keywords[word] += 1;
				capitalCount += 1;
			});
		}
	});
	const mostKeywords = {};
	Object.keys(keywords).forEach((key) => {
		if (keywords[key] > 1) mostKeywords[key] = { sym: key, mentions: keywords[key] };
	});
	if (!data.keywordsArr) data.keywordsArr = [];
	data.keywordsArr.push(mostKeywords);
	if (data.keywordsArr.length > 6 * 24) data.keywordsArr.shift();
	return false;
}

const formatKeywords = async () => {
	const totals = {};
	data.keywordsArr.forEach((kwObjects) => {
		Object.keys(kwObjects).forEach((kwKey) => {
			const kwObj = kwObjects[kwKey];
			if (!totals[kwObj.sym]) totals[kwObj.sym] = { sym: kwObj.sym, mentions: 0 };
			totals[kwObj.sym].mentions += kwObj.mentions;
		});
	});
	const sortable = [];
	Object.keys(totals).forEach((kwObj) => {
		if (badTickers.includes(kwObj.sym)) return false;
		sortable.push(totals[kwObj]);
	});
	const sorted = sortable.sort((a, b) => {	return b.mentions - a.mentions });
	data.keywords = sorted.slice(0,20);
	console.log('----------------------');
	console.log('kw',data.keywords);
}

const getFinancials = async () => {
	return new Promise((resolve) => {
		data.keywords.forEach(async (kwObj,i) => {
			if (badTickers.includes(kwObj.sym)) return false;
			await new Promise(r => setTimeout(r, i*500));
			const dat1 = await fetch(`https://query2.finance.yahoo.com/v10/finance/quoteSummary/${kwObj.sym}?modules=financialData`).catch(err => console.log(err));
			const res1 = await dat1.json().catch(err => console.log(err));
			if (res1 && res1.quoteSummary && res1.quoteSummary.result && res1.quoteSummary.result[0].financialData) {
				kwObj.price = res1.quoteSummary.result[0].financialData.currentPrice.raw;
				if (!data.prices) data.prices = {};
				if (!data.prices[kwObj.sym]) data.prices[kwObj.sym] = [];
				data.prices[kwObj.sym].push(kwObj.price);
				if (data.prices[kwObj.sym].length > 6 * 24) data.prices[kwObj.sym].shift();
				if (data.prices[kwObj.sym].length > 6 * 12) {
					kwObj.priceChange = (kwObj.price - data.prices[kwObj.sym][0]) / data.prices[kwObj.sym][0];
				}
				// there's a whole lot more info we could take if we want it
			}
			if (i === data.keywords.length-1) resolve();
		});
	});
}

const bestPosts = async () => {
	const dat1 = await fetch(`https://www.reddit.com/r/wallstreetbets/hot.json?limit=100`).catch(err => console.log(err));
	const res1 = await dat1.json().catch(err => console.log(err));
	res1.data.children.forEach((c) => {
		const title = c.data.title;
		const link = `https://www.reddit.com${c.data.permalink}`;
		const text = c.data.selftext;
		const html = c.data.selftext_html;
		const author = c.data.author;
		const ts = c.data.created_utc;
		if (text && scorePost(c.data) > 50) {
			console.log(title);
			data.bestPosts[c.data.id] = {
				id: c.data.id,
				title,
				link,
				text,
				html,
				author,
				ts,
			}
		}
	});
}

const scorePost = (p) => {
	let score = 50;
	const allText = p.title + ' ' + p.selftext;
	data.keywords.forEach((kwObj) => {
		if (allText.includes(kwObj.sym)) score += 10;
	});
	const badWords = ['fuck','retard','wife','boyfriend','cunt','shit','🚀','💎','👐','💸','🦍','🙌','🐒','💩','autist','troll','bitch','porn','cock','cuck','dude','diamond hand','mum','mom','stupid','newbie','lover'];
	badWords.forEach((bw) => {
		if (allText.toLowerCase().includes(bw)) score -= 25;
	});
	const capCount = allText.length - allText.replace(/[A-Z]/g, '').length;
	if (capCount > 30) score -= 20;
	if (capCount > 100) score -= 20;
	const goodWords = ['risk','management','short','long','position','interest','clearing','broker','analyst','contract','volatility','volatile','index','diligence','float','exposure','volume','percentage','ratio','financial advise','filing','market','bull','bear','leverage','levered','deleveraging','investor','potential','gama','option','fund','investigation','gross','margin'];
	goodWords.forEach((gw) => {
		if (allText.toLowerCase().includes(gw)) score += 10;
	});
	return score;
}

const writeOut = async () => {
	const finalPosts = {}
	let fpCount = 0;
	Object.keys(data.bestPosts).reverse().forEach((key) => {
		fpCount += 1;
		if (fpCount > 200) return false;
		finalPosts[key] = data.bestPosts[key];
	});

	const finalKeywords = [];
	data.keywords.forEach((kwObj) => {
		if (kwObj.price) finalKeywords.push(kwObj);
	});

	const finalData = {
		keywords: finalKeywords,
		bestPosts: finalPosts,
		stats: data.stats,
	}
	fs.writeFile(`./html/wsbdata.json`, JSON.stringify(finalData)+"\n", (err) => {
		if (err) console.error(err)
	});
	fs.writeFile(`./html/wsbbackup.json`, JSON.stringify(data)+"\n", (err) => {
		if (err) console.error(err)
	});
	return false;
}

const run = async () => {
	await getStats();
	await findKeywords();
	await formatKeywords();
	await getFinancials();
	await bestPosts();
	await writeOut();
};

run();
/*
setInterval(() => {
	run();
}, 60000);
*/