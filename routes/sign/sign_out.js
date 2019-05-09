"use strict";

var mongo = require( consV.methods.db.main);
let express = require("express");
var async = require('async');
var router = express.Router({mergeParams: true});

router.route('/')
.get(function(req , res)
{
    req.session.destroy(function (err)
    {
        res.redirect('/');
    });
})
.post(function(req , res)
{
    req.session.destroy(function (err)
    {
        if(err)
        {
            res.send( false );
        }
        else
        {
            res.send( true );
        }
    });
});

module.exports = router;
