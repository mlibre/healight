"use strict";

let DBRelatedP = require(consV.methods.db.relatedP);
let DBMain = require(consV.methods.db.main);
let ObjectID = require('mongodb').ObjectID;
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.route('/')
.post(function (req , res)
{
	async.waterfall
	([
		function (callback)
		{
			DBRelatedP.telNonArts(function(err , result)
			{
				callback(null, result);
			});
		},
		function (result, callback)
		{
			async.forEachOf(result.list, function(el, index, asFEcb)
			{
				DBMain.nodeInfCObj(el, function(err , art)
				{
					if(err)
					{
						asFEcb(err);
					}
					else if( art )
					{
						result[el] = art;
						asFEcb(null);
					}
					else
					{
						asFEcb(null);
					}
				});
			},
			function (err)
			{
				if(err)
				{
					console.error( new Error(`#error: " + ${err}`.red) );
				}
				callback(null, result);
			});
		},
		function (result, callback)
		{
			async.forEachOf(result.list, function(el, index, asFEcb)
			{
				let el_Ob = new ObjectID (el);				
				DBMain.url_by_NodeId_NoObj_NoColl(el_Ob, function(err , url)
				{
					if(err)
					{
						asFEcb(err);
					}
					else if( url )
					{
						url.push('/' + res.locals.lang + '/encyclopedia');
						url.reverse();
						url = url.join('/');
						result[el].url = url;
						asFEcb(null);
					}
					else
					{
						asFEcb(null);
					}
				});
			},
			function (err)
			{
				if(err)
				{
					console.error( new Error("#error: ".red + err) );
				}
				callback(null, result);
			});
		}
	],
	function (err, result)
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
