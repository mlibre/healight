"use strict";

let express = require("express");
var async = require('async');
var router = express.Router({mergeParams: true});

router.route('*')
.all(function(req, res, next)
{
	res.send( req.query.code );
})

module.exports = router;
