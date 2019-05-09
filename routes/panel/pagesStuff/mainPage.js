"use strict";

let DBMain = require( consV.methods.db.main);
let DBArticles = require( consV.methods.db.articles);
let middlewares = require( consV.methods.middlewares);
let ObjectID = require('mongodb').ObjectID;
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.route('/')
.get(function(req , res)
{
	let title = 'پنل هیلایت. اطلاعات صفحه ی اصلی';
	res.render("panel/pagesStuff/mainPage.ejs",
	{
		title: title
	});
})
.post(function(req , res)
{
	let formVars = req.body;
	if(formVars.nodeId == "" || typeof formVars.nodeId == "undefined" ||
		formVars.nodeEnc == "" || typeof formVars.nodeEnc == "undefined" ||
		formVars.nodeLang == "" || typeof formVars.nodeLang == "undefined")
		{
			res.send( '-1' );
			return;
		}
	formVars.nodeId = new ObjectID (formVars.nodeId);
	DBMain.set_today_article(formVars.nodeId, formVars.nodeEnc, formVars.nodeLang, function(err)
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

module.exports = router;
