"use strict";

let DBArticles = require( consV.methods.db.articles);
let space = require( consV.methods.space );
let middlewares = require( consV.methods.middlewares);
let express = require("express");
let async = require('async');
let Chance = require('chance');
let router = express.Router({mergeParams: true});

router.use(middlewares.CheckUpArAccess);

router.route('/')
.post(function (req , res)
{
	let formVars = req.body;
	
	if(formVars.articleContent == "" || typeof formVars.articleContent == "undefined" ||
	formVars.formArtLang == "" || typeof formVars.formArtLang == "undefined" ||
	formVars.spaceFolderName == "" || typeof formVars.spaceFolderName == "undefined")
	{
		res.send( consV.codes.lackOfInformation.toString() );
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
			DBArticles.edit_art_by_spaceFName(formVars.spaceFolderName, formVars.treeTitle , formVars.articleContent,
			formVars.tags, license, formVars.formArtLang,
			req.session.user._id,  function(err, art)
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
