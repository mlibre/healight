"use strict";

let DBArticles = require( consV.methods.db.articles);
let DBMain = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.route('/')
.get(function(req , res)
{
	DBMain.resources(function(err, result)
	{
		for(var val in result)
		{				
			if( result[val].trusted_users.indexOf(req.session.user._id) == -1 )
			{
				delete result[val];
			}
		};
		
		let title = 'پنل هیلایت. تایید مطالب توسط منبع';
		res.render("panel/adminStuff/resApproveArt",
		{
			title: title,
			resES: result
		});
	});
})
.post(function(req , res)
{
	let formVars = req.body;

	if(formVars.nodeId == "" || typeof formVars.nodeId == "undefined" ||
		formVars.nodeEnc == "" || typeof formVars.nodeEnc == "undefined" ||
		formVars.AR == "" || typeof formVars.AR == "undefined")
		{
			res.send( consV.codes.lackOfInformation.toString() );
			return;
		}		
		if(formVars.AR == '1')
		{
			DBArticles.AArt(formVars.nodeId, formVars.nodeEnc, req.session.user._id, function(err)
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
		}
		else if(formVars.AR == '-1')
		{
			DBArticles.RArt(formVars.nodeId, formVars.nodeEnc, req.session.user._id, formVars.RAText, function(err)
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
		}
		else if(formVars.AR == '0')
		{
			DBArticles.NOArt(formVars.nodeId, formVars.nodeEnc, req.session.user._id, function(err)
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
		}
});

module.exports = router;
