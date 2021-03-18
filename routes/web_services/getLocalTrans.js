"use strict";


let middlewares = require( consV.methods.middlewares );
let express = require("express");
let router = express.Router({mergeParams: true});
const fs = require('fs');

router.use(middlewares.checkPageStuffAccess);

router.route('/')
.post(function (req , res)
{

	let data = fs.readFileSync(consV.space.locales + req.body.language + '.json');
	let transObj = JSON.parse(data);
	
	if( transObj == null )
	{
		res.send( consV.codes.db.Error.toString() );
	}
	else
	{
		res.json( transObj );
	}
});

module.exports = router;
