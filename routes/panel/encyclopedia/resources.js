"use strict";

let DBArticles = require( consV.methods.db.articles);
let DBMain = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.use(middlewares.checkApArAccess);

router.route('/')
.get(function(req , res)
{
	async.series
	([
		function (callback)
		{
			DBMain.resources(function(err, result)
			{
				callback(err , result);
			});
		}
	],
	function (err , result)
	{
		if( err )
		{
			res.send( consV.codes.db.Error.toString() );
			return;
		}

		let title = 'پنل هیلایت. منابع مطالب';
		res.render("panel/encyclopedia/resources",
		{
			title: title,
			resES: result[0]
		});
	});
});

router.use(middlewares.checkAddResArAccess);
router.route('/')
.post(function(req , res)
{	
	let fromVars = req.body;
	fromVars.res = JSON.parse(fromVars.res);	
	if(fromVars.res == "" || typeof fromVars.res == "undefined" ||
		fromVars.nodeId == "" || typeof fromVars.nodeId == "undefined" ||
		fromVars.nodeEnc == "" || typeof fromVars.nodeEnc == "undefined")
	{
		res.send( '-1' );
		return;
	}		
	let nodeId = fromVars.nodeId;
	let resources = fromVars.res;
	let nodeEnc = fromVars.nodeEnc;

	async.forEachOf(resources , function(value , key , callB)
	{
		if(typeof resources[key].content_user[req.session.user._id] != 'undefined')
		{
			resources[key] = resources[key].content_user[req.session.user._id];
		}
		else
		{
			delete resources[key];
		}
		callB(null)
	},
	function (err)
	{
		if(err)
		{
			console.error( new Error("#article. #article_approves function. message: %s".red, err) );
		}		
		DBArticles.addEditArtResources(nodeId, nodeEnc, req.session.user._id, resources, function(err)
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
});

module.exports = router;
