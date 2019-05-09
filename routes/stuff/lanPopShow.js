"use strict";

let express = require("express");
var async = require('async');
var router = express.Router({mergeParams: true});

router.route('/')
.get(function(req , res)
{
	req.session.lanPopShow = false;
   res.redirect('/');
})
.post(function(req , res)
{
	req.session.lanPopShow = false;	
   res.send( true );
});

module.exports = router;
