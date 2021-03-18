"use strict";

let DBProfile = require( consV.methods.db.profile );
let express = require("express");
let router = express.Router({mergeParams: true});
let middlewares = require( consV.methods.middlewares);

router.use(middlewares.CheckLogedIn);

router.route('/')
.post(async function (req , res, next)
{	
	if(req.body.userID != req.session.user._id)
	{
		res.send( consV.codes.notAllowed.toString() );
		next(new Error('Access denied.'.red));		
	}
	else
	{
		let err, user = await DBProfile.userInfoById(req.session.user._id);		
		{
			if(err)
			{
				res.send( consV.codes.db.Error.toString() );
			}
			else if( user )
			{	
				res.send( user );
			}
		}
	}
});

module.exports = router;
