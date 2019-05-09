"use strict";

let i18n = require('i18n');
let express = require("express");
var async = require('async');
var router = express.Router({mergeParams: true});

router.route('*')
.all(function(req, res, next)
{
	console.warn( `#Warning. Wrong URL. ${req.originalUrl}`.yellow );
	let url = req.originalUrl;
	let splite = url.match(/[^\/]+/ig);
	res.status(404).render("stuff/404",
	{
		langs: consV.site.langs.inArray,
		query: splite
	});
})

module.exports = router;
