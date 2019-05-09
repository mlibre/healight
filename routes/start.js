"use strict";

let express = require("express");
let router = express.Router({mergeParams: true});

router.route('/')
.all(function(req , res)
{
	//detect lan and redirect
	res.redirect('/' + consV.site.langs.default + '/home');
});

module.exports = router;