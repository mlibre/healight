"use strict";

let space = require( consV.methods.space );
let DBMain = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.route('/')
.get(function(req , res)
{
	DBMain.resources(function(err, result)
	{
		let title = 'پنل هیلایت. ویرایش منابع';
		res.render("panel/adminStuff/resTrusUsers",
		{
			title: title,
			resES: result
		});
	});
	
})
.post(function(req , res)
{
	let resId = null;
	async.series
	([
		function (callback)
		{
			let formVars = req.body;
			let imageName = null;			
			if(typeof req.files.file != 'undefined')
			{
				imageName = req.files.file.name;
			}
			DBMain.create_edit_resources(formVars.formResLang, formVars.formResType, formVars.formResName,
			formVars.formResFamily, formVars.formResWriter, formVars.formResURL,
			formVars.formResLic, formVars.formResLicO, formVars.formResEx,
			imageName, function(err, result)
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
					if(err)
					{
						callback(err);
					}
					else
					{
						space.copyFile(consV.space.resourcesFolderName + resId + '/', req.files.file.name, req.files.file.data ,function (err, res)
						{
							callback(err);
						});
					}
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
			res.json( results[0] );
		}
	});
});

module.exports = router;
