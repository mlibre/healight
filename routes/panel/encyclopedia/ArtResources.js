"use strict";

let DBArticles = require( consV.methods.db.articles );
let middlewares = require( consV.methods.middlewares);
let ObjectID = require('mongodb').ObjectID;
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.route('/')
.post(function (req , res)
{	
	let formVars = req.body;

	if(formVars.nodeId == "" || typeof formVars.nodeId == "undefined" ||
		formVars.nodeEnc == "" || typeof formVars.nodeEnc == "undefined")
	{
		res.send( '-1' );
		return;
	}
	formVars.nodeId = new ObjectID (formVars.nodeId);
	DBArticles.article_resources_WUsersAResInfo(formVars.nodeId, formVars.nodeEnc, function(err , result)
	{
		if(err || result == null)
		{
			res.send( consV.codes.db.Error.toString() );
		}
		else
		{
			result[result.length] = {user_id : req.session.user._id};
			result[1][req.session.user._id] = req.session.user;
			res.json( result );
		}
	});
});

module.exports = router;
