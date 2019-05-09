"use strict";

let i18n = require('i18n');
let express = require("express");
var async = require('async');
var router = express.Router({mergeParams: true});

router.route('*')
.all(function(req, res, next)
{
	res.send( req.query.code );
})

module.exports = router;
