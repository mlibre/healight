"use strict";

var DBArticles = require( consV.methods.db.articles );
let middlewares = require( consV.methods.middlewares);
var ObjectID = require('mongodb').ObjectID;
let express = require("express");
var async = require('async');
var router = express.Router({mergeParams: true});

router.route('/')
.post(function (req , res)
{	
	var formVars = req.body;

	if(formVars.nodeId == "" || typeof formVars.nodeId == "undefined" ||
		formVars.nodeEnc == "" || typeof formVars.nodeEnc == "undefined")
	{
		res.send( consV.codes.lackOfInformation.toString() );
		return;
	}
	formVars.nodeId = new ObjectID (formVars.nodeId);

	async.series
	([
		function (callback)
		{
			DBArticles.article_approves(formVars.nodeId, formVars.nodeEnc, function(err , ArtApprvs)
			{
				if(err)
				{
					callback(err);
				}
				else if( ArtApprvs == null )
				{
					callback(consV.codes.db.docNotFound);
				}
				else
				{
					callback(null , ArtApprvs);
				}
			});
		}
	],
	function (err , result)
	{
		if(err)
		{
			res.send( consV.codes.db.Error.toString() );
		}
		else
		{
			res.json( result[0] );
		}
	});
});

module.exports = router;
