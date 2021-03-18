"use strict";

var mongo = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
var async = require('async');
var router = express.Router({mergeParams: true});

router.route('/')
.get(function(req , res)
{
	let title = "هیلایت. نمای کلی پروفایل";		
	res.render("myaccount/overview" ,
	{
		title: title
	});
});

module.exports = router;
