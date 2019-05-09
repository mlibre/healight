"use strict";

let express = require("express");
let middlewares = require( consV.methods.middlewares);
var router = express.Router({mergeParams: true});

router.use(middlewares.checkPageStuffAccess);

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
