"use strict";

let express = require("express");
let router = express.Router({mergeParams: true});

router.route('/')
.all(function(req , res)
{
	let title = "نتایج جستجو . هیلایت";
	let query = "";
	if(typeof req.query.q != "undefined")
	{
		query = req.query.q
	}	
	res.render("searchRes",
	{
		title: title,
		query: query
	});
});

module.exports = router;
