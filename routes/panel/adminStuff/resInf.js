"use strict";

let DBMain = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.use(middlewares.checkEncTreeAccess);

router.route('/')
.post(function (req , res)
{	
	let formVars = req.body;
	if(formVars.resId == "" || typeof formVars.resId == "undefined")
	{
		res.send( consV.codes.lackOfInformation.toString() );
		return;
	}
	DBMain.resInf(formVars.resId, function(err , resource)
	{
		if(err)
		{
			res.send( consV.codes.db.Error.toString() );
		}
		else
		{
			res.json( resource );
		}
	});
});

module.exports = router;
