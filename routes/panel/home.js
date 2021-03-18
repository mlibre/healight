"use strict";

var mongo = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
var async = require('async');
var router = express.Router({mergeParams: true});

router.route('/')
.all(function(req , res)
{
	async.parallel
	([
		function (callback)
		{
			callback(null);
		},
	],
	function (err , results)
	{
		var title = 'ام پنل. پنل سایت هیلایت';
		res.render("panel/home" ,
		{
			title: title
		});
	});
});

module.exports = router;
