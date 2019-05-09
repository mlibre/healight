"use strict";

let DBMain = require(consV.methods.db.main);
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.route('/')
.get(function(req , res)
{
	let title = "تشخیص طبع آنلاین . هیلایت";		
	res.render("online_services/temperament.ejs" ,
	{
		title: title
	});
});

module.exports = router;
