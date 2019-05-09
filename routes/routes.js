"use strict";

let middlewares = require( consV.methods.middlewares);
let express = require("express");
let router = express.Router();

// Routing
router.use('/' , require('./start'));

//Helper
router.use('/helper/' , require('./helper'));

// MiddleWares
router.use(middlewares.CreLasUrs);
router.use(middlewares.CreLangVar);
router.use(middlewares.setLocaleGlo);
router.use(middlewares.SpSes);
router.use(middlewares.isSessCreated);

// Routing
let langRoutes = "(";
consV.site.langs.inArray.forEach( (el , index) =>
{
	langRoutes += el;
	if(index != consV.site.langs.inArray.length -1)
	{
		langRoutes += '|';
	}
});
langRoutes += ")";

router.use(new RegExp('(\/+)'+langRoutes+'[\/]?$') , require('./home'));
router.use(new RegExp('(\/+)'+langRoutes+'(\/+)home[\/]?$') , require('./home'));
router.use(new RegExp('(\/+)'+langRoutes+'(\/+)license[\/]?$') , require('./license'));
router.use(new RegExp('(\/+)'+langRoutes+'(\/+)signIn[\/]?$') , require('./sign/signIn'));
router.use(new RegExp('(\/+)'+langRoutes+'(\/+)signUp[\/]?$') , require('./sign/signUp'));
router.use('/sign/sign_out' , require('./sign/sign_out'));
router.use('/stuff/lanPopShow' , require('./stuff/lanPopShow'));
router.use('/stuff/mediumCB' , require('./stuff/mediumCB'));
router.use(new RegExp('(\/+)'+langRoutes+'(\/+)searchRes[\/]?$') , require('./searchRes'));
router.use(new RegExp('(\/+)'+langRoutes+'(\/+)searchRes(\/+)\\w+') , require('./searchRes'));
router.use(new RegExp('(\/+)'+langRoutes+'(\/+)encyclopedia(\/+)(\\w+)') , require('./encyclopedia/'));
router.use(new RegExp('(\/+)'+langRoutes+'(\/+)portals(\/+)(\\w+)') , require('./portals/home'));
router.use(new RegExp('(\/+)'+langRoutes+'(\/+)online_services(\/+)home[\/]?$') , require('./online_services/home'));
router.use(new RegExp('(\/+)'+langRoutes+'(\/+)online_services(\/+)temperament[\/]?$') , require('./online_services/temperament'));
router.use(new RegExp('(\/+)'+langRoutes+'(\/+)stuff(\/+)notTranslated[\/]?$') , require('./stuff/notTranslated'));
router.use(new RegExp('(\/+)'+langRoutes+'(\/+)stuff(\/+)500[\/]?$') , require('./stuff/500'));

// Routing - Panel
router.use(new RegExp('(\/+)'+langRoutes+'(\/+)panel') , require('./panel/'));
router.use(new RegExp('(\/+)'+langRoutes+'(\/+)panel\/') , require('./panel/'));

// Routing - Blog
// router.use(new RegExp('(\/+)'+langRoutes+'\/blog[\/]') , require('./blog/'));

// Routing - Account
router.use(new RegExp('(\/+)'+langRoutes+'(\/+)myaccount') , require('./myaccount/'));

//Web Services
router.use('/web_services' , require('./web_services/'));

// 404 happend
router.use(require('./stuff/404'));
module.exports = router;
