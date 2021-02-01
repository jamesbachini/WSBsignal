const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const archiver = require('archiver');

module.exports = {
	entry: './html/js/script.js',
	output: {
		filename: 'script.min.js',
		path: path.resolve(__dirname, '../docs/js/'),
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: path.resolve(__dirname, '../docs/js/routes_master.js'), to: path.resolve(__dirname, '../docs/js/routes.js') },
				{ from: path.resolve(__dirname, '../html'), to: path.resolve(__dirname, '../docs') },
			],
			options: {
				concurrency: 100,
			},
		}),
		{
			apply: (compiler) => {
				compiler.hooks.afterEmit.tap('done', (compilation) => {

				/*
					console.log('Editing index.html to include packaged JS');
					const indexPath = path.resolve(__dirname, '../docs/index.html');
					let indexHTML = fs.readFileSync(indexPath, 'utf8');
					indexHTML = indexHTML.split(`js/script.js`).join(`js/script.min.js`);
					fs.writeFile(indexPath, indexHTML, function (err) {
						if (err) return console.log(err);
					});
				*/
					console.log('Zip up html directory to dist/vanillaHTML.zip');
					const output = fs.createWriteStream(path.resolve(__dirname, '../docs/vanillaHTML.zip'));
					const archive = archiver('zip', {
						zlib: { level: 9 } // Sets the compression level.
					});
					output.on('close', function() {
						console.log(archive.pointer() + ' total bytes');
					});
					archive.pipe(output);
					archive.directory(path.resolve(__dirname, '../html'), false).finalize();
				});
			}
		}
	],
};
