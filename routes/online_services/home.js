"use strict";

var mongo = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
var async = require('async');
var router = express.Router({mergeParams: true});

router.route('/')
.all(function(req , res)
{
    let title = 'خدمات آنلاین. هیلایت';
    res.render("online_services/home" ,
    {
        title: title
    });
});

module.exports = router;
