"use strict";

let middlewares = require( consV.methods.middlewares);
let express = require("express");
var router = express.Router({mergeParams: true});

router.use(middlewares.CheckLogedIn);

// Routing
require('fs').readdirSync(__dirname).forEach(function (file)
{
	
	if(file.indexOf(".ignore") == -1)
	{
		file = file.replace(".js" , "");
		if(file != 'index')
		{
			router.use('/' + file , require('./' + file));
		}
	}
});

module.exports = router;
