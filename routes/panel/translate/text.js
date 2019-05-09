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
				callback(err , spaceFolderName);
			});
		}
	],
	function (err , result)
	{
		if(err)
		{
			res.send( consV.codes.db.Error.toString() );
			return;
		}
		let item = {};
		item.spaceFolderName = result[0];
		item.treeTitle = {};
		item.tags = {};
		item.content = {};
		
		var title = 'پنل هیلایت. صفحه ی اصلی';
		res.render("panel/translate/text",
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
		res.send( '-1' );
		return;
	}

	if( formVars.tags != "" && typeof formVars.tags != "undefined")
	{
		var tags = formVars.tags.match(/[^\,]+/ig);
		for (var i = 0; i < tags.length; i++)
		{
			tags[i] = tags[i].trim();
		}
		formVars.tags = tags;
	}
	if(formVars.tags == "")
	{
		formVars.tags = null;
	}
	if(formVars.treeTitle == "")
	{
		formVars.treeTitle = null;
	}
	let license = {};
	license.type = formVars.formArtResLicType;
	license.text = formVars.formArtResLic;

	async.series
	([
		function (callback)
		{
			DBArticles.create_edit_draft_art(formVars.spaceFolderName , formVars.treeTitle , formVars.articleContent,
			formVars.tags, license, formVars.formArtLang,
			req.session.user._id , function(err, art)
			{
				if(err)
				{
					callback(true , consV.codes.db.Error);
				}
				else
				{
					callback(null , art);
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
