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
let ejs = require('ejs'); // Create Client Javascript Files.
let colors = require('colors');
let fix_maintain = require(consV.methods.fix_or_maintain); // Fixing Stuff 
let ups = require('./UsPs');

// Client Javascript Files.
let list = helper.directoryListRecursive('./public/js/eJS/');
list.forEach(function (file)
{
	ejs.renderFile(file , function (err, str)
	{
		helper.createFileSync(file.replace('./public/js/eJS/','./public/js/JS/') , str);
	});	
});

// Module Javascript Files.
list = helper.directoryListRecursive('./public/modules/');
list.forEach(function (file)
{
	if(file.indexOf('.ejs') != -1)
	{		
		ejs.renderFile(file , function (err, str)
		{
			helper.createFileSync(file.replace('.ejs.js','.js') , str);
		});	
	}
});

// Font Iran
ejs.renderFile(__dirname +  '/public/stylesheet/fonts/IRANSans/FontLicense.ejs', function (err, str)
{
	helper.createFileSync(__dirname +  '/public/stylesheet/fonts/IRANSans/FontLicense.txt' , str);
});
// Disqus
ejs.renderFile(__dirname +  '/public/framework/disqus/disqus.ejs', function (err, str)
{
	helper.createFileSync(__dirname +  '/public/framework/disqus/disqus.js' , str);
});

// express object
let health = express();

// File Upload
health.use(fileupload());

// Session manager
let RedisClient = redis.createClient();
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
	// fix_maintain.createColls();
	// fix_maintain.createRoots();
	// fix_maintain.createBasicDocuments();
	// fix_maintain.signUpAdmin(ups.admin.username , ups.admin.email , ups.admin.password , ups.admin.lang);
	// fix_maintain.addAdminAsOwnerToAllArts();
	// fix_maintain.isEveryArticleHaveItsFolder();
	// fix_maintain.deleteOrphanFolders();
	// fix_maintain.deleteDeletedResources();
	// fix_maintain.deltedDeltedNonArtTelArts();
	// fix_maintain.lostArticles();
	// fix_maintain.deleteDeletedUsers();
	// fix_maintain.checkAllLinksInArts();

	// Routing
	health.use(require('./routes/routes.js'));
	
	// Server
	let port = 3000;
	let server = health.listen(port , '0.0.0.0', function()
	{
		console.log(`#Server. Server Is Running Fine on port ${server.address().port}`.green);
	});
});
