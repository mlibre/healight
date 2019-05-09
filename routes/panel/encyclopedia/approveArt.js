"use strict";

let DBArticles = require( consV.methods.db.articles);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.use(middlewares.checkApArAccess);

router.route('/')
.get(function(req , res)
{
	let title = 'پنل هیلایت. تایید مطالب';
	res.render("panel/encyclopedia/approveArt",
	{
		title: title
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
