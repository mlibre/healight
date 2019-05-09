"use strict";

let DBArticles = require( consV.methods.db.articles );
let space = require( consV.methods.space );
let middlewares = require( consV.methods.middlewares );
let express = require("express");
let async = require('async');
let Chance = require('chance');
let router = express.Router({mergeParams: true});

router.use(middlewares.CheckCrArAccess);

router.route('/')
.get(function(req , res)
{
	let chance = new Chance();
	let spaceFolderName = chance.hash();
	async.series
	([
		function (callback)
		{
			space.CreateFolder(consV.space.articlesFolderName , spaceFolderName , function(err, res)
			{
				if( err )
				{
					res.send( consV.codes.db.Error.toString() );
					return;
				}
				else
				{
					callback(null , spaceFolderName);
				}
			});
		}
	],
	function (err , result)
	{
		let item = {};
		item.spaceFolderName = result[0];
		item.treeTitle = {};
		item.tags = {};
		item.content = {};
		item.summary = {};
		item.license = {};
		item.license.type = "default";

		let title = 'پنل هیلایت. ساخت مقاله';
		res.render("panel/encyclopedia/createArt",
		{
			title: title,
			item: item
		});
	});
})
.post(function (req , res)
{
	let formVars = req.body;
	
	if(formVars.articleContent == "" || typeof formVars.articleContent == "undefined" ||
	formVars.formArtLang == "" || typeof formVars.formArtLang == "undefined")
	{
		res.send( consV.codes.lackOfInformation.toString() );
		return;
	}

	async.series
	([
		function (callback)
		{
			DBArticles.create_edit_draft_art(req.body, req.session.user._id , function(err, art)
			{
				callback(err , art);
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
