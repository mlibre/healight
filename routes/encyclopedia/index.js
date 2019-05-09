"use strict";

let DBMain = require( consV.methods.db.main);
let DBArticles = require( consV.methods.db.articles );
let middlewares = require( consV.methods.middlewares);
let ObjectID = require('mongodb').ObjectID;
let express = require("express");
let async = require('async');
let router = express.Router({mergeParams: true});

router.route('*')
.get(function(req , res, next)
{
	let url = req.originalUrl;
	let path = [req.params[4]].concat(req.params[5].split('/').remove(''));
	let canonicalUrl = null;
	if( url.indexOf('?tree_nodeid') != -1)
	{
		canonicalUrl = 'https://' + consV.host.domain + url.slice(0 , url.indexOf('?tree_nodeid'));
	}
	else
	{
		canonicalUrl = 'https://' + consV.host.domain + url;
		if(canonicalUrl[canonicalUrl.length-1] != '/')
		{
			canonicalUrl = canonicalUrl + '/';
		}
	}
	let encData = consV.database.enc[req.params[4]];
	let target_node_id = null;
	let tree_nodeid = null;
	let branch = null;
	
	if(typeof encData == 'undefined')
	{
		return next();
	}
	if(typeof req.query.tree_nodeid != "undefined")
	{
		try
		{
			tree_nodeid = new ObjectID (req.query.tree_nodeid);
		}
		catch (error)
		{
			console.error( new Error(`ignoring wrong tree_nodeid=${req.query.tree_nodeid}. message: ${error}`.red) );
		}
	}
	async.series
	([
		function (callback)
		{
			DBMain.node_byPath(path , encData.CollName , function(err, resul)
			{
				if(!err)
				{
					res.locals.dontGenAltPage  = {};
					consV.site.langs.inArray.forEach( (el , index) =>
					{
						if(typeof resul.content[el] == 'undefined' || resul.content[el] == null || resul.content[el] == "")
						{
							res.locals.dontGenAltPage[el] = true;
						}
					});
				}
				if(err == true && resul == consV.codes.db.docNotFound)
				{
					callback(err , consV.codes.db.docNotFound);
				}
				else if(err)
				{
					callback(err);
				}
				else if(typeof resul.content[res.locals.lang] == 'undefined')
				{
					res.redirect('/' + res.locals.lang + consV.pages.notTranslated);
					return;
				}
				else
				{
					target_node_id = resul._id;
					callback(null, resul);
				}
			});
		},
		function (callback)
		{
			if(tree_nodeid == null)
			{
				DBMain.parentId_by_nodeId(encData.CollName, target_node_id, function (err, re)
				{
					tree_nodeid = re;
					callback(null);						
				});
			}
			else
			{
				callback(null);
			}
		},
		function (callback)
		{
			DBMain.loc_byPath(path , encData.CollName , res.locals.lang, function(err, loc_path)
			{
				if(err)
				{
					callback(err);
				}
				else
				{
					loc_path.splice(0,1);
					let location = ['دانشنامه' , encData.title].concat(loc_path);
					callback(null, location);
				}
			});
		},
		function (callback)
		{
			DBArticles.article_approves(target_node_id, encData.CollName, function(err , ArtApprvs)
			{
				if(err)
				{
					callback(err);
				}
				else if( ArtApprvs == null )
				{
					callback(true , consV.codes.db.docNotFound);
				}
				else
				{
					callback(null , ArtApprvs.length);					
				}
			});
		},
		function (callback)
		{
			DBArticles.article_resources_WUsersAResInfo(target_node_id, encData.CollName, function(err , res)
			{
				if(err || res == null)
				{
					callback(consV.codes.db.Error.toString());
				}
				else
				{
					callback(null , res);
				}
			});
		},
		function (callback)
		{
			DBMain.build_tree(encData.CollName, tree_nodeid || target_node_id, 4 , function(err, tree , depth)
			{
				if(err)
				{
					callback(err);
				}
				else
				{
					callback(null , tree.json().rootIds , tree.json().nodes);
				}
			});
		},
		function (callback)
		{			
			if(tree_nodeid != null)
			{
				DBMain.url_by_NodeId(tree_nodeid, encData.CollName, function(err , url)
				{
					if( url == null )
					{
						err = consV.codes.db.docNotFound;
					}
					url.push('/' + res.locals.lang + '/encyclopedia');
					url.reverse();
					url = url.join('/');
					callback(err , url);
				});
			}
			else
			{
				callback(null);
			}
		},
		function (callback)
		{
			DBMain.branch_by_NodeId(target_node_id, encData.CollName, res.locals.lang, function(err , br)
			{
				if( br == null )
				{
					err = consV.codes.db.docNotFound;
				}
				branch = br;
				callback(err, br);				
			});
		},
		function (callback)
		{
			let treeNodeIdIndex;
			branch.forEach(function(el, index)
			{
				if(el._id.valueOf().toString() == tree_nodeid)
				{
					treeNodeIdIndex = index;					
				}
			});
			callback(null, treeNodeIdIndex);
		}
	],
	function(err , result)
	{
		if(err)
		{
			if(result[0] == consV.codes.db.docNotFound)
			{
				return next();
			}
			else
			{
				res.status(500).render('stuff/500');
				return;
			}
		}
		let title;		
		if(res.locals.lang == 'fa')
		{			
			title = result[0].treeTitle[res.locals.lang] + ' . هیلایت';
		}
		else
		{
			title = result[0].treeTitle[res.locals.lang] + ' . Healight';
		}
		res.render("encyclopedia/index" ,
		{
			title: title,
			location: result[2],
			apRate: result[3].toString(),
			resources: result[4],
			max_depth: 4,
			root_id: result[5][0][0],
			nodes: result[5][1],
			target_node_id: target_node_id,
			base_url: result[6] || url,
			branch: result[7],
			treeNodeIdIndex: result[8],
			encData: encData,
			canonicalUrl: canonicalUrl
		});
	});
});

module.exports = router;
