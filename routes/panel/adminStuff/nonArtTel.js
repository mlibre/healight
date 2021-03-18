"use strict";

let express = require("express");
let router = express.Router({mergeParams: true});

router.route('/')
.get(function(req , res)
{
	let title = 'پنل هیلایت. بلک لیست مقاله های شبکه های اجتماعی';
	res.render("panel/adminStuff/nonArtTel",
	{
		title: title,
	});
});

module.exports = router;
