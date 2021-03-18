"use strict";

let DBProfile = require( consV.methods.db.profile );
let middlewares = require( consV.methods.middlewares);
let express = require("express");
var async = require('async');
var router = express.Router({mergeParams: true});

router.route('/')
.get(async function(req , res)
{
	let user = await DBProfile.userInfoById(req.session.user._id);		
	let title = "هیلایت. پروفایل شخصی";
	res.render("myaccount/profile" ,
	{
		user: user,
		title: title
	});
});

module.exports = router;
