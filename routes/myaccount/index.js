"use strict";

let middlewares = require( consV.methods.middlewares);
let express = require("express");
var router = express.Router({mergeParams: true});

// router.use(middlewares.CheckHelperAccess);
router.use(middlewares.CheckLogedIn);
router.use(middlewares.SpPIm);

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
