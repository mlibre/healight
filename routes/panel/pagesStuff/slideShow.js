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
	let title = 'پنل هیلایت. اسلاید شو';
	res.render("panel/pagesStuff/slideShow.ejs",
	{
		title: title
	});
});
module.exports = router;
