"use strict";

let express = require("express");
let middlewares = require( consV.methods.middlewares);
let router = express.Router({mergeParams: true});

router.use(middlewares.checkAdminStuffAccess);

// Routing
require('fs').readdirSync(__dirname).forEach(function (file)
{
	file = file.replace(".js" , "");
	if(file != 'index')
	{
		router.use('/' + file , require('./' + file));
	}
});

module.exports = router;
