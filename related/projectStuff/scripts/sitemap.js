const SitemapGenerator = require('sitemap-generator');
let consV = require('../../../constantVars');

// create generator
const generator = SitemapGenerator(consV.project.html_genWebURL,
{
	stripQuerystring: false,
	filepath: './space/stuff/sitemap.xml',
});

// register event listeners
generator.on('done', () => {
	console.log("done");
});

// start the crawler
generator.start();