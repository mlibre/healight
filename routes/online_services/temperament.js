"use strict";

let i18n = require('i18n');
let express = require("express");
let router = express.Router({mergeParams: true});

router.route('/')
.get(function(req , res)
{
	let title = "تشخیص طبع آنلاین . هیلایت";		
	res.render("online_services/temperament.ejs" ,
	{
		title: i18n.__(title)
	});
});

module.exports = router;
