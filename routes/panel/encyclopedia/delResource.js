"use strict";

let DBArticles = require( consV.methods.db.articles);
var mongo = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.use(middlewares.checkApArAccess);

router.route('/')
.post(function(req , res)
{
	let fromVars = req.body;	
	if(fromVars.resId == "" || typeof fromVars.resId == "undefined" ||
		fromVars.nodeId == "" || typeof fromVars.nodeId == "undefined" ||
		fromVars.nodeEnc == "" || typeof fromVars.nodeEnc == "undefined")
	{
		res.send( '-1' );
		return;
	}		
	let resId = fromVars.resId;
	let nodeId = fromVars.nodeId;
	let nodeEnc = fromVars.nodeEnc;

	DBArticles.delArtResources(nodeId, nodeEnc, req.session.user._id, resId, res.locals.lang, function(err)
	{
		if(err)
		{
			res.send( consV.codes.db.Error.toString() );
		}
		else
		{
			res.send( consV.codes.db.success.toString() );
		}
	});
});

module.exports = router;
