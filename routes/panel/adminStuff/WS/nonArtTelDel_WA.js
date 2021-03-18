"use strict";

let DBRelatedP = require(consV.methods.db.relatedP);
let express = require("express");
let router = express.Router({mergeParams: true});

router.route('/')
.post(function (req , res)
{
	DBRelatedP.telNonArtDel(req.body.nodeId, function(err , result)
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
