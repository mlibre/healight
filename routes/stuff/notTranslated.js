"use strict";

let express = require("express");
var async = require('async');
var router = express.Router({mergeParams: true});

router.route('/')
.get(function(req , res)
{
	res.render("stuff/notTranslated");
});
module.exports = router;
