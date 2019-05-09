"use strict";

var mongo = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
var async = require('async');
var router = express.Router({mergeParams: true});

router.use(middlewares.checkEncTreeAccess);

router.route('/')
.post(function (req , res)
{	
	var formVars = req.body;

	if(formVars.URLName == "" || typeof formVars.URLName == "undefined" ||
	formVars.parentNodeId == "" || typeof formVars.parentNodeId == "undefined")
	{
		res.send( consV.codes.lackOfInformation.toString() );
		return;
	}

	async.series
	([
		function (callback)
		{
			var re = /^[A-Za-z0-9_]+$/;
			if( re.test(formVars.URLName) == false)
			{
				callback(true, consV.codes.validationError);
			}
			else
			{
				callback(null);
			}
		},
		function (callback)
		{
			mongo.checkChildDup(formVars.nodeId, formVars.parentNodeId, formVars.URLName , function(err , child)
			{
				if(err)
				{
					callback(true , consV.codes.db.Error);
				}
				else if( child == null )
				{
					callback(null);
				}
				else
				{
					callback(true , consV.codes.db.docFound);
				}
			});
		}
	],
	function (err , result)
	{
		if(err)
		{
			if(result[0])
			{
				res.send( result[0].toString() );
			}
			else if(result[1])
			{
				res.send( result[1].toString() );
			}
			else
			{
				res.send( consV.codes.db.Error.toString() );
			}
		}
		else
		{
			res.send( consV.codes.db.success.toString() );
		}
	});
});

module.exports = router;
