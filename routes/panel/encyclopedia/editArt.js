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
.get(function(req , res)
{
	let title = 'پنل هیلایت. صفحه ی اصلی';
	res.render("panel/encyclopedia/editArt",
	{
		title: title
	});
})
router.route('/')
.post(function (req , res)
{
	let formVars = req.body;
	
	if(formVars.formArtLang == "" || typeof formVars.formArtLang == "undefined" ||
	formVars.spaceFolderName == "" || typeof formVars.spaceFolderName == "undefined")
	{
		res.send( consV.codes.lackOfInformation.toString() );
		return;
	}

	async.series
	([
		function (callback)
		{
			DBArticles.edit_art_by_spaceFName(req.body, req.session.user._id , function(err, art)
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
