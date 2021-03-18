"use strict";

let DBMain = require( consV.methods.db.main);
let middlewares = require( consV.methods.middlewares);
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

// router.route('*/:portalName/*') u can splite the params that is not splited here by this way
router.route('*')
.get(function(req , res, next)
{
	let encData = consV.database.enc[req.params[4]];
	if( typeof encData == 'undefined' )
	{
		return next();
	}
	let nodeId = null;
	async.series
	([
		function (callback)
		{
			DBMain.last_article( encData.CollName , res.locals.lang, function(err, LA)
			{
				if(err || typeof LA == 'undefined')
				{
					callback(null , LA);					
				}
				else
				{
					nodeId = LA._id;
					callback(null , LA);
				}
			});
		},
		function (callback)
		{
			DBMain.slideshowInf("portals_" + encData.name , res.locals.lang, function(err, doc)
			{
				if(err || doc == null)
				{
					console.error( new Error( `#SlideShow Problem. err: ${err}`) );
					callback(err);
				}
				else
				{
					doc.forEach(function(el , index)
					{
						if(typeof el.url != 'undefined' && el.url != null)
						{
							let Surl = el.url;
							Surl.push('/' + res.locals.lang + '/encyclopedia');
							Surl.reverse();
							doc[index].url = Surl.join('/');
						}
					});
					callback(err , doc);
				}
			});
		},
		function (callback)
		{
			DBMain.url_by_NodeId(nodeId, encData.CollName, function(err , url)
			{
				if(err || (url == null) )
				{
					callback( consV.codes.db.Error );
				}
				else
				{
					url.push('/' + res.locals.lang + '/encyclopedia');
					url.reverse();
					url = url.join('/');
					callback( null, url );
				}
			});
		}
	],
	function (err , results)
	{
		let title = "پرتال دانشنامه ی " + encData.title[res.locals.lang] + " . هیلایت";
		res.render("portals/home",
		{
			title: title ,
			slideshows: results[1],
			LA: results[0],
			url: results[2],
			encData: encData
		});
	});
});

module.exports = router;
