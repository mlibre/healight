"use strict";

let space = require( consV.methods.space );
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
		let title = 'پنل هیلایت. ویرایش منابع';
		res.render("panel/adminStuff/editResources",
		{
			title: title,
			resES: result
		});
	});
});

module.exports = router;
