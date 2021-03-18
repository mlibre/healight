"use strict";

let DBMain = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.use(middlewares.checkEncTreeAccess);

router.route('/')
.post(function (req , res)
{	
	let formVars = req.body;
	if(formVars.nodeId == "" || typeof formVars.nodeId == "undefined")
	{
		res.send( '-1' );
		return;
	}
	DBMain.nodeInfCObj(formVars.nodeId, function(err , art)
	{
		if(err || (art == null) )
		{
			res.send( consV.codes.db.Error.toString() );
		}
		else
		{
			res.json( art );
		}
	});
});

module.exports = router;
