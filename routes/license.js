"use strict";

let DBMain = require( consV.methods.db.main );
let express = require("express");
let router = express.Router({mergeParams: true});

router.route('/')
.all(function(req , res)
{
	DBMain.nodeInfNoObjWColl("leg", "site", function(err , leg)
	{
		if(err)
		{
			console.error( new Error(`#panel leg. message: ${err}`.red) );			
			// cbf(err);
		}
		else if( leg )
		{			
			let title = 'قوانین شرایط . هیلایت';
			res.render("license",
			{
				title: title,
				item: leg
			});
		}
	});
});

module.exports = router;
