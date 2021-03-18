"use strict";

let DBMain = require( consV.methods.db.main );
let space = require( consV.methods.space );
let middlewares = require( consV.methods.middlewares );
let fixAndMaintain = require( consV.methods.init_maintain );
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.use(middlewares.CheckCrArAccess);

router.route('/')
.get(function(req , res)
{
	DBMain.nodeInfNoObjWColl("leg", "site", function(err , leg)
	{
		if(err)
		{
			console.error( new Error(`#panel leg. message: ${err}`.red) );			
			// cbf(err);
		}
		else if(leg == null)
		{
			fixAndMaintain.createLegInfoNode(res.locals.lang);
		}
		else if( leg )
		{			
			let title = 'قوانین شرایط هیلایت';
			res.render("panel/adminStuff/leg",
			{
				title: title,
				item: leg
			});
		}
	});
})
.post(function (req , res)
{
	let formVars = req.body;
	
	if(formVars.articleContent == "" || typeof formVars.articleContent == "undefined" ||
	formVars.formArtLang == "" || typeof formVars.formArtLang == "undefined")
	{
		res.send( consV.codes.lackOfInformation.toString() );
		return;
	}

	if( formVars.tags != "" && typeof formVars.tags != "undefined")
	{
		var tags = formVars.tags.match(/[^\,]+/ig);
		for (var i = 0; i < tags.length; i++)
		{
			tags[i] = tags[i].trim();
		}
		formVars.tags = tags;
	}
	if(formVars.tags == "")
	{
		formVars.tags = null;
	}
	if(formVars.treeTitle == "")
	{
		formVars.treeTitle = null;
	}
	DBMain.setLegInf(formVars.treeTitle , formVars.articleContent,
	formVars.tags, formVars.formArtLang, function(err, result)
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
