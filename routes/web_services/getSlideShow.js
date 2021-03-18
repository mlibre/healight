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
	if(formVars.slideShowFormPage == "" || typeof formVars.slideShowFormPage == "undefined" ||
		formVars.slideShowFormSN == "" || typeof formVars.slideShowFormSN == "undefined" ||
		formVars.slideShowFormLang == "" || typeof formVars.slideShowFormLang == "undefined")
	{
		res.send( consV.codes.lackOfInformation.toString() );
		return;
	}
	async.series
	([
		function (callback)
		{
			DBMain.slideshowInfSpecifySN(
			formVars.slideShowFormPage, formVars.slideShowFormLang, formVars.slideShowFormSN,
			function(err, result)
			{
				callback(err, result);
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
			res.json(results[0]);
		}
	});
});

module.exports = router;
