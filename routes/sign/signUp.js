"use strict";

let DBProfile = require( consV.methods.db.profile);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
var async = require('async');
var router = express.Router({mergeParams: true});

router.route('/')
.get(function(req , res)
{
	let title = "هیلایت . ثبت نام در سایت";		
	res.render("sign/signUp" ,
	{
		title: title
	});
})
.post(function(req , res)
{
	if(req.body.email == "" || typeof req.body.email == "undefined" ||
	req.body.password == "" || typeof req.body.password == "undefined")
	{
		res.send( consV.codes.lackOfInformation.toString() );
		return;
	}
	async.series
	([
		function (callback)
		{
			DBProfile.emailInf(req.body.email , function(err, user)
			{
				if( err )
				{
					callback(true , consV.codes.db.Error);
				}
				else if(user)
				{
					callback(true , consV.codes.db.docFound);
				}
				else
				{
					callback(null , user);
				}
			});
		},
		function (callback)
		{
			DBProfile.signUp(req.body.email , req.body.password , res.locals.lang , function (err, user)
			{
					if(err)
					{
						callback(true , consV.codes.db.Error);
					}
					else
					{
						callback(null , user);
					}
			});
		}
	],
	function (err , result)
	{
		if(err)
		{
			if( result[0] == consV.codes.db.Error || result[1] == consV.codes.db.Error )
			{
					res.send( consV.codes.db.Error.toString() );
			}
			else if(result[0] == consV.codes.db.docFound)
			{
					res.send( consV.codes.db.docFound.toString() );
			}
		}
		else
		{
			// User Created
			req.session.logged = true;
			req.session.user = result[1];
			res.send( "1" );
		}
	});
});

module.exports = router;
