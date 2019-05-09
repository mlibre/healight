"use strict";

let DBMain = require( consV.methods.db.main);
let express = require("express");
let router = express.Router({mergeParams: true});

router.route('/')
.get(function(req , res)
{
	let item = {};
	item.type = "";
	item.name = {};
	item.family = {};

	let title = 'پنل هیلایت. اضافه کردن منبع';
	res.render("panel/adminStuff/addResources",
	{
		title: title,
		resItem: item
	});
});

module.exports = router;
