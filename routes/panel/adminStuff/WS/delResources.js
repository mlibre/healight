"use strict";

let space = require( consV.methods.space );
let DBMain = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.route('/')
.post(function(req , res)
{
	if(req.body.resId == '' || req.body.resId == null)
	{
		res.send( consV.codes.lackOfInformation.toString() );
		return;
	}
	let resId = req.body.resId;
	DBMain.delete_resources(resId, function(err, result)
	{
		if(err)
		{
			console.error( new Error("#error. message: %s ".red, err) );
			res.send( consV.codes.db.Error.toString() );
		}
		else
		{			
			res.json( consV.codes.general.success.toString() );
		}
	});
});

module.exports = router;
