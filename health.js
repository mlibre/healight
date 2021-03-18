"use strict";

// Set consV In Global
global.consV = require('./constantVars');

let express = require("express");
let fileupload = require('express-fileupload');
let session = require('express-session');
let redis = require('redis');
let redis_store = require('connect-redis')(session);
let cookie_parser = require('cookie-parser');
let mongo = require(consV.methods.db.main);
global.i18n = require('i18n');
let helper = require(consV.methods.helper);
let colors = require('colors');
let fix_maintain = require(consV.methods.init_maintain); // Fixing Stuff 
let ups = require('./UsPs');


// Reading command line inputs
let port = process.argv[2] || 3000;
if(process.argv[3] == "true" || process.argv[3] == true)
{
	console.log("Runnign in clone mod".yellow);
	
	consV.project.html_gen = true;
}

// Client Javascript Files.
helper.ejsToJsFolder('./public/js/eJS/' , './public/js/eJS/', './public/js/JS/');

// Module Javascript Files.
helper.ejsToJsFolder('./public/modules/' , '.ejs.js' , '.js' , '.ejs');

// Font Iran
helper.ejsToJsFile(
	__dirname +  '/public/stylesheet/fonts/IRANSans/FontLicense.ejs' ,
	__dirname +  '/public/stylesheet/fonts/IRANSans/FontLicense.txt'
);

// Disqus
helper.ejsToJsFile(
	__dirname +  '/public/framework/disqus/disqus.ejs' ,
	__dirname +  '/public/framework/disqus/disqus.js'
)

// express object
let health = express();

// File Upload
health.use(fileupload());

// Session manager
let RedisClient = redis.createClient();
RedisClient.on('error', function (e)
{
	console.log('Something is wrong with Redis. You probably have not start it: npm run srm'.red , e);
});
health.use(session
({
	store: new redis_store({client: RedisClient}),
	secret: 'Free',
	resave: false,
	saveUninitialized: false
}));

// i18n
health.use(i18n.init);

i18n.configure
({
	locales: consV.site.langs.inArray,
	directory: __dirname + '/public/locales',
	defaultLocale: 'fa'
});

// Views directory
health.set('views' , __dirname + '/site/');

// View engine
health.set('view engine' , 'ejs');

// Files
health.use(express.static('public'));
health.use(express.static('space'));
health.use(express.static('space/stuff'));

// Body parseer
health.use( express.json({limit: '200mb'}) );
health.use( express.urlencoded({ limit: '200mb', extended: true }) );

// Cookie parser
health.use( cookie_parser() );

// Connect to mongodb
mongo.db_connect(function ()
{
	// Fix Or Maintain
	fix_maintain.createColls(); // Will Create Missing Collections
	fix_maintain.createRoots(); // Create Missing Root Articles
	fix_maintain.createBasicDocuments(); // Create Some basic data for db schema
	fix_maintain.signUpAdmin(ups.admin.username , ups.admin.email , ups.admin.password , ups.admin.lang);
	fix_maintain.addAdminAsOwnerToAllArts();
	fix_maintain.isEveryArticleHaveItsFolder();
	fix_maintain.deleteOrphanFolders();
	// fix_maintain.deleteDeletedResources();
	fix_maintain.deltedDeltedNonArtTelArts();
	fix_maintain.lostArticles();
	fix_maintain.deleteDeletedUsers();
	fix_maintain.reviewAlltheArtiles();
	fix_maintain.checkForExternalLinks();
	// fix_maintain.customUpdateOnEachArt();
	// fix_maintain.checkAllLinksInArts();

	// Routing
	health.use(require('./routes/routes.js'));
	
	let server = health.listen(port , '0.0.0.0', function()
	{
		console.log(`#Server. Server Is Running Fine on port ${server.address().port}`.green);
	});
});
