"use strict";

let DBMain = require( consV.methods.db.main);
let DBArticles = require( consV.methods.db.articles);
let space = require( consV.methods.space );
let middlewares = require( consV.methods.middlewares);
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.use(middlewares.CheckGlPlArAccess);

router.route('/')
.get(function(req , res)
{
	async.waterfall
	([
		function (callback)
		{
			DBArticles.drafts(function(err, dratfs)
			{
				callback(err , dratfs);
			});
		},
		function (dratfs, callback)
		{			
			let MDrafts = [];
			async.forEachOf(dratfs , function(el , index , callback)
			{				
				if( el.owners.indexOf(req.session.user._id) != -1 )
				{
					MDrafts.push(el);
				};
				callback(null);
			},
			function (err)
			{
				if(err)
				{
					console.error( new Error("#routes. #placeArt, dratfs. message: %s".red, err) );
				}
				callback(err , MDrafts);
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
		let title = 'پنل هیلایت. صفحه ی اصلی';
		res.render("panel/encyclopedia/placeArt",
		{
			title: title,
			drafts: result
		});
	});
});

router.use(middlewares.CheckPlArAccess);
router.route('/')
.post(function (req , res)
{
	var formVars = req.body;
	if(formVars.nodePlaceInput == "" || typeof formVars.nodePlaceInput == "undefined" ||
	formVars.URLName == "" || typeof formVars.URLName == "undefined")
	{
		res.send( consV.codes.lackOfInformation.toString() );
		return;
	}

	async.series
	([
		function (callback)
		{
			var re = /^[A-Za-z0-9_]+$/;
			if( re.test(formVars.URLName) == false)
			{
				callback(true, consV.codes.validationError);
			}
			else
			{
				callback(null);
			}
		},
		function (callback)
		{
			DBMain.checkChildDup(formVars.placeArtnodeId, formVars.nodePlaceInput, formVars.URLName , function(err , child)
			{
				if(err)
				{
					callback(true , consV.codes.db.Error);
				}
				else if( child == null )
				{
					callback(null);
				}
				else
				{
					callback(true , consV.codes.db.docFound);
				}
			});
		},
		function (callback)
		{
			DBArticles.replace_art(formVars.placeArtEnc, formVars.placeArtnodeId, formVars.nodePlaceInput,
			formVars.URLName, function(err, result)
			{
				callback(err);
			});
		}
	],
	function (err , result)
	{
		if(err)
		{
			if(result[0])
			{
				res.send( result[0].toString() );
			}
			else if(result[1])
			{
				res.send( result[1].toString() );
			}
			else
			{
				res.send( consV.codes.db.Error.toString() );
			}
		}
		else
		{
			res.send( consV.codes.db.success.toString() );
		}
	});
});

module.exports = router;
