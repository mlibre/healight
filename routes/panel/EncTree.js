"use strict";

var DBArticles = require( consV.methods.db.articles);
let DBMain = require( consV.methods.db.main);
var space = require( consV.methods.space );
let middlewares = require( consV.methods.middlewares);
var ObjectID = require('mongodb').ObjectID;
let express = require("express");
var async = require('async');
var router = express.Router({mergeParams: true});

router.use(middlewares.checkEncTreeAccess);

router.route('/')
.post(function (req , res)
{
	let formVars = req.body;	
	if( formVars.nodeId == "root")
	{
		formVars.nodeId = DBMain.root_id_by_coll_name(formVars.enc);
	}
	formVars.nodeId = new ObjectID (formVars.nodeId);
	async.series
	([
		function (callback)
		{
			DBMain.build_tree_with_owner_label(formVars.enc, formVars.nodeId, formVars.depth,
			req.session.user._id, function(err, tree , depth)
			{
				callback(err, tree.json().rootIds, tree.json().nodes);
			});
		}
	],
	function (err , result)
	{
		if(err)
		{
			res.send( consV.codes.db.Error.toString() );
		}
		else
		{
			res.json( result[0] );
		}
	});
});

module.exports = router;
