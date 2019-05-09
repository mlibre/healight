"use strict";

let DBMain = require( consV.methods.db.main);
let space = require( consV.methods.space );
let middlewares = require( consV.methods.middlewares);
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.route('/')
.post(function(req , res)
{
	let formVars = req.body;	
	if(req.files.file == "" || typeof req.files.file == "undefined")
	{
		res.send( consV.codes.lackOfInformation.toString() );
		return;
	}
	async.series
	([
		function (callback)
		{
			space.copyFile(consV.space.slideshowFolderName, req.files.file.name, req.files.file.data ,function (err, res)
			{
				callback(err);
			});
		},
		function (callback)
		{
			let alts = [formVars.slideShowFormImageAlt1 , formVars.slideShowFormImageAlt2, formVars.slideShowFormImageAlt3].join(' ');			
			DBMain.setSlideshowInf(formVars.slideShowFormPage, formVars.slideShowFormLang, formVars.slideShowFormSN,
			alts,	formVars.slideShowFormTitle, formVars.selectedNodeInput,
			consV.space.slideshowFolderName + req.files.file.name, function(err)
			{
				callback(err);
			});
		}
	],
	function (err, results)
	{		
		if(err)
		{
			console.error( new Error(`#error. message: ${err} `.red) );
			res.send( consV.codes.db.Error.toString() );
		}
		else
		{
			res.send( consV.codes.space.success.toString() );
		}
	});
});

module.exports = router;
