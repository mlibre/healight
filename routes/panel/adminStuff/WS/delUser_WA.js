"use strict";

let DBProfile = require( consV.methods.db.profile );
let ObjectID = require('mongodb').ObjectID;
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.route('/')
.post(function (req , res)
{
	DBProfile.deleteUser(req.body.nodeId, function (err, result)
	{
		if(err)
		{
			res.send( consV.codes.db.Error.toString() );
		}
		else
		{
			res.json( result );
		}
	});
});

module.exports = router;
