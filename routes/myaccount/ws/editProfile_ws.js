"use strict";

let DBProfile = require( consV.methods.db.profile );
let express = require("express");
let router = express.Router({mergeParams: true});

router.route('/')
.post(async function (req , res)
{
	let err ,result = await DBProfile.editUserInfo(req.session.user._id, req.body)
	if(err)
	{
		res.send( consV.codes.db.Error.toString() );
	}
	else
	{
		res.send( consV.codes.db.success.toString() );
	}
});

module.exports = router;
