"use strict";

let space = require( consV.methods.space );
let DBMain = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.route('/')
.post(function(req , res)
{
	let formVars = req.body;
	let resId = formVars.formResId || null;
	let imageName = null;			
	async.series
	([
		function (callback)
		{
			if(resId != null)
			{
				DBMain.resInf(resId, function(err , resource)
				{
					if(err)
					{
						callback( err, null );
					}
					else
					{
						imageName = resource.image;
						callback(null);
					}
				});
			}
			else
			{
				callback(null);
			}
		},
		function (callback)
		{
			if(typeof req.files.file != 'undefined')
			{
				formVars.imageAdd = req.files.file.name;
			}
			DBMain.create_edit_resources(formVars, function(err, result)
			{
				resId = result[1];
				callback(err, result[0] );
			});
		},
		function (callback)
		{
			if(typeof req.files.file != 'undefined')
			{
				space.CreateFolder(consV.space.resourcesFolderName , resId , function(err, res)
				{
					space.copyFile(consV.space.resourcesFolderName + resId + '/', req.files.file.name, req.files.file.data ,function (err, res)
					{
						callback(err);
					});
				});
			}
			else
			{
				callback(null);
			}
		}
	],
	function (err, results)
	{		
		if(err)
		{
			console.error( new Error("#error. message: %s ".red, err) );
			res.send( consV.codes.db.Error.toString() );
		}
		else
		{			
			res.json( results[1] );
		}
	});
});

module.exports = router;
