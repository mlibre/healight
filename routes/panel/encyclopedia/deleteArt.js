"use strict";

let mongo = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
var async = require('async');
var router = express.Router({mergeParams: true});

router.use(middlewares.CheckDlArAccess);

router.route('/')
.post(function (req , res)
{	
	var formVars = req.body;

	if(formVars.nodeId == "" || typeof formVars.nodeId == "undefined")
	{
		res.send( '-1' );
		return;
	}

	async.series
	([
		function (callback)
		{
			mongo.deleteNode(formVars.nodeId, function(err)
            {
				if(err)
				{
					callback(true , consV.codes.db.Error);
				}
				else
				{
					callback(null, consV.codes.db.success);
				}
            });
		}
	],
	function (err , result)
	{
		res.send( result[0].toString() );
	});
});

module.exports = router;
