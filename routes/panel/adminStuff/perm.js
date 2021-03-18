"use strict";

let DBProfile = require( consV.methods.db.profile );
let express = require("express");
let router = express.Router({mergeParams: true});

router.route('/')
.get(function(req , res)
{
	let title = 'پنل هیلایت. دسترسی به اعضا';
	res.render("panel/adminStuff/perm",
	{
		title: title,
	});
})
.post(function (req , res)
{
	let formVars = req.body;	
	Object.keys(formVars).forEach(function(key)
	{
		if(formVars[key] == 'true' || formVars[key] == 'on')
		{
			formVars[key] = true;
		}
		else if(formVars[key] == 'false' || formVars[key] == 'off')
		{
			formVars[key] = false;
		}
	});
	DBProfile.setUserPerm(formVars.nodeId, formVars, function(err , result)
	{
		if(err)
		{
			res.send( consV.codes.db.Error.toString() );
		}
		else
		{
			res.send( consV.codes.db.success.toString() );
		}
	});
});

module.exports = router;
