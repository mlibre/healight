"use strict";

let DBMain = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let ObjectID = require('mongodb').ObjectID;
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.use(middlewares.checkEncTreeAccess);

router.route('/')
.post(function (req , res)
{	
	let formVars = req.body;

	if(formVars.nodeId == "" || typeof formVars.nodeId == "undefined" ||
		formVars.nodeEnc == "" || typeof formVars.nodeEnc == "undefined")
	{
		res.send( '-1' );
		return;
	}
	formVars.nodeId = new ObjectID (formVars.nodeId);
	DBMain.url_by_NodeId(formVars.nodeId, formVars.nodeEnc, function(err , url)
	{
		if(err || (url == null) )
		{
			res.send( consV.codes.db.Error.toString() );
		}
		else
		{
			url.push('/' + res.locals.lang + '/encyclopedia');
			url.reverse();
			url = url.join('/');
			res.send( url );
		}
	});

});

module.exports = router;
