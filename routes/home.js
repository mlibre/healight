"use strict";

let DBMain = require(consV.methods.db.main);
let middlewares = require(consV.methods.middlewares);
let express = require("express");
let async = require('async');
let helper = require(consV.methods.helper);
let router = express.Router({mergeParams: true});

router.route('/')
.all(function(req , res)
{
	async.parallel
	([
		function (callback)
		{
			DBMain.last_article( null , res.locals.lang , function(err, LA)
			{
				if(typeof LA != 'undefined')
				{
					LA.url.push('/' + res.locals.lang + '/encyclopedia');
					LA.url.reverse();
					LA.url = LA.url.join('/');
					callback(err , LA);
				}
				else
				{
					callback(err , null);
				}
			});
		},
		function (callback)
		{
			DBMain.today_article(res.locals.lang, function(err, TA)
			{
				if(err == 'no article')
				{
					callback(null , null);
				}	
				else if(err)
				{
					console.error( new Error( `#Today Artilce Problem. err=${err}`.red) );
					callback(err);
				}
				else
				{
					TA.url.push('/' + res.locals.lang + '/encyclopedia');
					TA.url.reverse();
					TA.url = TA.url.join('/');
					callback(err , TA);
				}
			});
		},
		function (callback)
		{
			DBMain.slideshowInf("home", res.locals.lang, function(err, doc)
			{
				if(err == "No slideshow")
				{
					callback(null , null);
				}
				else if(err)
				{
					console.error( new Error( `#SlideShow Problem. err=${err}`) );
					callback(err);
				}
				else
				{					
					doc.forEach(function(el , index)
					{
						if(typeof el.url != 'undefined')
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
		}
	],
	function (err , results)
	{
		if(err)
		{
			res.status(500).render('stuff/500');
			return;
		}
		res.render("home" ,
		{
			title: consV.site.title[res.locals.lang],
			slideshows: results[2],
			LA: results[0],
			TA: results[1]
		});
	});
});

module.exports = router;
