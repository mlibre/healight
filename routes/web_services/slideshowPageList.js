"use strict";

let DBMain = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
let router = express.Router({mergeParams: true});

router.use(middlewares.checkPageStuffAccess);

router.route('/')
.post(function (req , res)
{	
	DBMain.getSlideShowPageList(function(err , info)
	{
		if(err || (info == null) )
		{
			res.send( consV.codes.db.Error.toString() );
		}
		else
		{
			res.json( info );
		}
	});
});

module.exports = router;
