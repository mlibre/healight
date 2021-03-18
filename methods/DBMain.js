"use strict";

let mongodb = require('mongodb');
let ObjectID = require('mongodb').ObjectID;
let async = require('async');
let Tree = require('node-tree-data');
let ups = require('../UsPs');
let Chance = require('chance');
const delay = require('delay');

let mongoClient = mongodb.MongoClient;

let db = null;
let cbfs = [];


exports.db_connect = async function db_connect(cbf)
{
	let mongo_server_address = 'localhost:27017/' + ups.DBName;
	let url = 'mongodb://'+ ups.mongo_username + ':' + ups.mongo_password + '@' + mongo_server_address;

	// var mlab_server_address = 'ds157298.mlab.com:57298/' + dbName;
	// var url = 'mongodb://'+ ups.mlab_username + ':' + ups.mlab_password + '@' + mlab_server_address;
	let connecting = false;
	while (db == null)
	{
		if(connecting == false)
		{
			connecting = true;
			await mongoClient.connect(url , function(err , DbConn)
			{
				connecting = false;
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. Cannot connect to the MongoDB service. Message: ${err}`.red) );
					console.log( `#To Solve The Issue, run: npm run sm`.green );
				}
				else
				{
					db = DbConn.db(ups.DBName);
					process.nextTick(function ()
					{
						for (var i = 0; i < cbfs.length; i++)
						{				
							cbfs[i](DbConn);			
						}
						cbfs = null;
					});
					console.log("#Mongo. Successfully connected to mongodb".green);
					cbf();
					// DbConn.close();
				}
			});
		}
		console.warn('#Mongo. Unable Connecting to MongoDB, Trying after 6 second'.yellow);
		await delay(6000);
	}
}

exports.GetConnAsync = function GetConnAsync(cb)
{
	if(db)
	{
		process.nextTick(function()
		{
			cb(db);
		});
	}
	else
	{
		cbfs.push(cb);
	}
}

exports.GetConnSync = function GetConnSync()
{
	return db;
}

exports.findOneAUOnInsert = async function findOneAUOnInsert(coll, doc, search, cbf)
{
	let collection = db.collection(coll);
	collection.findOneAndUpdate
	(
		search,
	{
		$setOnInsert: doc
	},
	{
		returnOriginal: false,
		upsert: true
	},
	function (err, result)
	{
		if(cbf)
		{
			cbf(err, result);
		}
	});
}

exports.slideshowInf = function slideshowInf(page, Lang, cbf)
{
	async.waterfall
	([
		function (callback)
		{
			let collection = db.collection('site');

			collection.findOne( { "_id" : "slideshows" } , function(err , doc)
			{
				if(doc == null)
				{
					err = true;
				}
				callback(err , doc);
			});
		},
		function (doc , callback)
		{
			if(typeof doc[page] == 'undefined' || typeof doc[page][Lang] == 'undefined')
			{
				callback('No slideshow');
			}
			else
			{
				async.forEachOf(doc[page][Lang] , function(el , index , callb)
				{
					if(el.art_id == null)
					{
						callb(null);
					}
					else
					{
						exports.url_by_NodeId_NoObj_NoColl(el.art_id.valueOf().toString() , function (err, url)
						{
							if(err)
							{
								return callb(err);
							}
							else
							{
								doc[page][Lang][index].url = url;
							}
							callb(null);
						});
					}
				},
				function (err)
				{
					callback(err , doc[page][Lang]);
				});
			}
		}
	],
	function (err , doc)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		cbf( err, doc );
	});
}

exports.slideshowInfSpecifySN = function slideshowInfSpecifySN(page, Lang, SN, cbf)
{
	let collection = db.collection('site');	
	collection.findOne( { "_id" : "slideshows" } , function(err , doc)
	{
		if(err || (doc == null))
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		if(typeof doc[page] != 'undefined')
		{
			cbf(err, doc[page][Lang][SN]);
		}
		else
		{
			cbf(err, null);
		}
	});
}

exports.setSlideshowInf = function setSlideshowInf(Page, Lang, SlideNumber, Alts, Title, NodeId, Image_add, cbf)
{
	exports.slideshowInf(Page, Lang, function(err, result)
	{
		if(SlideNumber > result.length)
		{
			SlideNumber = result.length.toString();
		}
		let collection = db.collection('site');
		let title = Page + '.' + Lang + '.' + SlideNumber + '.title';
		let image_add = Page + '.' + Lang + '.' + SlideNumber + '.image_add';
		let image_alt = Page + '.' + Lang + '.' + SlideNumber + '.image_alt';
		let art_id = Page + '.' + Lang + '.' + SlideNumber + '.art_id';
		NodeId = new ObjectID (NodeId);	
		collection.findOneAndUpdate
		({
			_id: 'slideshows'
		},
		{
			$set:
			{
				[title]: Title,
				[image_add]: Image_add,
				[image_alt]: Alts,
				[art_id]: NodeId
			}
		},
		function(err , result)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			cbf(err);
		});
	});
}

exports.setLegInf = function setLegInf(Title, Content, Tags, Lang, cbf)
{
	let collection = db.collection(consV.database.site.CollName);
	let tags = "tags." + Lang;
	let content = "content." + Lang;
	let title = "title." + Lang;

	collection.findOneAndUpdate
	({
		"_id": "leg"
	},
	{
		$set:
		{
			[title]: Title,
			[content]: Content,
			[tags]: Tags,
			"date" : new Date()
		}
	},
	{
		returnOriginal: false,
		upsert: true
	},
	function(err , result)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		cbf(err, result.value);
	});
}

exports.last_article = function last_article(collections, lang, cbf)
{
	let lastArticles = [];
	if( collections == null)
	{
		collections = consV.database.enc.EncsColls;
	}
	else
	{
		collections = [collections];
	}	
	async.forEachOf(collections , function(el , index , callback)
	{
		let collection = db.collection(el);
		let contentQ = "content." + lang;
		let treeTitleQ = "treeTitle." + lang;
		collection.find
		({
			[contentQ]:
			{
				$exists: true,
				$nin: [null,'']
			},
			[treeTitleQ]:
			{
				$exists: true,
				$nin: [null,'']
			}
		})
		.sort({"date" : -1}).limit(1).toArray(function(err , LA)
		{
			if(err)
			{
				return callback(err);
			}
			else if(LA.length != 0)
			{
				lastArticles.push([LA[0] , el]);
			}
			callback(null);
		});
	},
	function (err)
	{
		if(err)
		{
			console.error( new Error(`#Error. message: ${err}`.red) );
			cbf(err);
		}
		else if(lastArticles.length != 0)
		{
			lastArticles.sort(function (a , b)
			{
				return b[0].date.getTime() - a[0].date.getTime();
			});
			exports.url_by_NodeId(lastArticles[0][0]._id, lastArticles[0][1], function (err, url)
			{
				lastArticles[0][0].url = url;
				cbf(err, lastArticles[0][0]);
			});
		}
		else
		{
			console.warn(`#Warning. The ${collections} is empty of article: ${err}`.red );			
			cbf(err);
		}
	});
}

exports.today_article = function today_article(pageLang, cbf)
{
	let collection = db.collection('site');
	async.waterfall
	([
		function (callback)
		{
			collection.findOne( {"_id":"today_article"} , function(err , Today_article_info)
			{
				if( Today_article_info == null || typeof Today_article_info[pageLang] == 'undefined')
				{
					callback('no article');
				}
				else
				{
					callback(err ,Today_article_info[pageLang].collection , Today_article_info[pageLang].node_id);
				}
			});
		},
		function (coll, node_id, callback)
		{
			if(coll == null)
			{
				callback(true);
			}
			else
			{
				exports.url_by_NodeId(node_id , coll , function (err, url)
				{
					callback(err, coll, node_id, url);
				});
			}
		},
		function (coll , node_id , url, callback)
		{
			collection = db.collection(coll);
			collection.findOne( {"_id" : node_id} , function(err , TA)
			{
				if( TA == null )
				{
					err = true;
				}
				TA.url = url;
				callback(err ,TA);
			});
		}
	],
	function (err , result)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		cbf(err, result);
	});
}

exports.set_today_article = function set_today_article(nodeId, Enc, Lang, cbf)
{
	let collection = db.collection('site');
	let langNID = Lang + '.node_id';
	let langNColl = Lang + '.collection';
	collection.findOneAndUpdate
	({
		_id: 'today_article'
	},
	{
		$set:
		{
			[langNID]: nodeId,
			[langNColl]: Enc
		}
	},
	function(err , result)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		cbf(err);
	});
}

exports.build_tree = function build_tree(coll, node_id, depth, cbf)
{
	let collection = db.collection(coll);

	let tree = new Tree('The_Tree');
	let root = tree.createNode(node_id.valueOf().toString());

	async.parallel
	([
		function (callback)
		{
			collection.findOne({"_id" : node_id } , function(err , doc)
			{
				if(err || doc == null)
				{
					callback(consV.codes.db.Error);
				}
				else if(doc)
				{
					tree.setNodeData(doc , root.id);
					callback(null);
				}
			});
		},
		function (callback)
		{
			let callbackCalled = false;
			let FC_counter = 1;
			let max_dep = 0;
			function rec(node , root , dep)
			{
				max_dep = Math.max(max_dep , dep);
				collection.find({"parent":node}).toArray(function(err , nodes)
				{
					if(depth != -1 && dep >= depth)
					{
						// nothing
					}
					else if(err)
					{
						if(callbackCalled == false)
						{
							callbackCalled = true;
							callback(err);
						}
					}
					else if(nodes.length == 0)
					{
						// console.log("#Mongo. #build_tree function. Can not find node document");
					}
					else if(nodes)
					{
						FC_counter += nodes.length;
						for(var i = 0 ; i < nodes.length ; i++)
						{
							var child = tree.createNode(nodes[i]._id.valueOf().toString() , root.id);
							tree.setNodeData(nodes[i] , child.id);

							rec(nodes[i]._id , child , dep + 1);
						}
					}
					FC_counter--;
					if(FC_counter == 0 && callbackCalled == false)
					{
						callbackCalled = true;
						callback(null , max_dep);
					}
				});
			}
			rec(node_id , root , 0);
		}
	],
	function (err , results)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		cbf( err, tree , results[1] );
	});
}

exports.build_tree_with_owner_label = function build_tree_with_owner_label(coll, node_id, depth, user_id, cbf)
{
	let collection = db.collection(coll);

	let tree = new Tree('The_Tree');
	let root = tree.createNode(node_id.valueOf().toString());

	async.parallel
	([
		function (callback)
		{
			collection.findOne({"_id" : node_id } , function(err , doc)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
					callback(true , consV.codes.db.Error);
				}
				else if(doc == null)
				{
					console.error( new Error(`#Mongo #FIXME. Can not find ${node_id} document.`.red ) );
					callback(true , consV.codes.db.docNotFound);
				}
				else if(doc)
				{
					// add an i onwer info to node data
					if( doc.owners.indexOf(user_id) != -1 )
					{
						doc.DI_i_am_owner = true;
					}
					else
					{
						doc.DI_i_am_owner = false;
					}
					// End Of add an i onwer info to node data
					tree.setNodeData(doc , root.id);
					callback(null);
				}
			});
		},
		function (callback)
		{
			let callbackCalled = false;
			let FC_counter = 1;
			let max_dep = 0;
			function rec(node , root , dep)
			{
				max_dep = Math.max(max_dep , dep);
				collection.find({"parent":node}).toArray(function(err , nodes)
				{
					if(depth != -1 && dep >= depth)
					{
						// nothing
					}
					else if(err)
					{
						console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
						if(callbackCalled == false)
						{
							callbackCalled = true;
							callback(true , consV.codes.db.Error);
						}
					}
					else if(nodes.length == 0)
					{
						// console.log("#Mongo. #build_tree function. Can not find node document");
					}
					else if(nodes)
					{
						FC_counter += nodes.length;
						for(var i = 0 ; i < nodes.length ; i++)
						{
							var child = tree.createNode(nodes[i]._id.valueOf().toString() , root.id);
							// add an i onwer info to node data
							if( nodes[i].owners.indexOf(user_id) != -1 )
							{
								nodes[i].DI_i_am_owner = true;
							}
							else
							{
								nodes[i].DI_i_am_owner = false;
							}
							// End Of add an i onwer info to node data
							tree.setNodeData(nodes[i] , child.id);
							rec(nodes[i]._id , child , dep + 1);
						}
					}
					FC_counter--;
					if(FC_counter == 0 && callbackCalled == false)
					{
						callbackCalled = true;
						callback(null , max_dep);
					}
				});
			}
			rec(node_id , root , 0);
		}
	],
	function (err , results)
	{
		cbf( err, tree , results[1] );
	});
}

exports.resources = function resources(cbf)
{
	let collection = db.collection('site');
	collection.findOne( { "_id" : 'resources' } , function(err , resources)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		else if(resources == null)
		{
			cbf(err , resources)
		}
		else
		{
			delete resources._id;
			cbf(err, resources);
		}
	});
}

exports.resInf = function resInf(resId, cbf)
{
	let collection = db.collection("site");
	collection.findOne({"_id": "resources"} , function (err, resDoc)
	{
		cbf(err , resDoc[resId]);
	});
}

exports.create_edit_resources = function create_edit_resources(vars, cbf)
{
	let collection = db.collection("site");
	async.waterfall
	([
		function (callback)
		{
			if(vars.formResId == null || vars.formResId == "")
			{
				let chance = new Chance();
				callback( null , chance.hash() );	
			}
			else
			{
				callback( null , vars.formResId );
			}
		},
		function (resId, callback)
		{
			let imageAlt = [vars.resFormImageAlt1 , vars.resFormImageAlt2, vars.resFormImageAlt3].join(' ');
			let DType = resId + ".type";
			let DName = resId + ".name." + vars.formResLang;
			let DFamily = resId + ".family." + vars.formResLang;
			let DWriter = resId + ".writer";
			let DURL = resId + ".url";
			let DLicense = resId + ".license";
			let DLicenseC = resId + ".license_custom";
			let DContent = resId + ".content." + vars.formResLang;
			let DImageAdd = resId + ".image_add";
			let DImageAlt = resId + ".image_alt";
			let DImageLicenseLink = resId + ".image_license_link";

			collection.findOneAndUpdate
			({
				"_id": "resources"
			},
			{
				$set:
				{
					[DType]: vars.formResType,
					[DName]: vars.formResName,
					[DFamily]: vars.formResFamily,
					[DWriter]: vars.formResWriter,
					[DURL]: vars.formResURL,
					[DLicense]: vars.formResLic,
					[DLicenseC]: vars.formResLicO,
					[DContent]: vars.formResEx,
					[DImageAdd]: vars.imageAdd,
					[DImageAlt]: imageAlt,
					[DImageLicenseLink]: vars.formResImageLicenseLink
				}
			},
			{
				returnOriginal: false
			},
			function(err , result)
			{
				callback(err, result.value[resId] , resId);
			});
		}
	],
	function (err, result, resId )
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}		
		cbf(err, [result, resId]);
	});
	
}

exports.delete_resources = function delete_resources(resId, cbf)
{
	let collection = db.collection("site");
	collection.findOneAndUpdate
	({
		"_id": "resources"
	},
	{
		$unset:
		{
			[resId]: '',
		}
	},
	{
		returnOriginal: false
	},
	function(err , result)
	{
		cbf(err, result);
	});
		
}

exports.deleteNode = function deleteNode(nodeId, cbf)
{
	let nodeColl = null;
	let nodeParent = null;
	async.series
	([
		function (callback)
		{
			exports.node_coll_by_Id(nodeId, function(err, coll)
			{
				nodeColl = coll;
				callback(null);
			});
		},
		function (callback)
		{
			exports.parentId_by_nodeId(nodeColl, nodeId, function (err, res)
			{
				nodeParent = res;
				callback(null);
			});
		},
		function (callback)
		{
			let collection = db.collection(nodeColl);
			let node_id = new ObjectID (nodeId);
			
			collection.find({"parent":node_id}).toArray(function(err , nodes)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
					callback(true , consV.codes.db.Error);
				}
				else if(nodes)
				{
					async.forEachOf(nodes , function(el , index , callb)
					{
						exports.edit_parent_by_id(nodeColl, el._id, nodeParent, function (err)
						{
							if(err)
							{
								return callb(err);
							}
							callb(null);
						});
					},
					function (err)
					{
						if(err)
						{
							console.error( new Error(`#check it. message: ${err}`.red) );
							callback(true, err);
						}
						else
						{
							callback(null);
						}
					});
				}
				else
				{
					callback(null);
				}
			});
		},
		function (callback)
		{
			let collection = db.collection(nodeColl);
			let node_id = new ObjectID (nodeId);

			collection.findOneAndDelete
			({
				_id: node_id
			},
			function(err, res)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
				}
				else
				{
					console.log("#Mongo. Article Deleted.".yellow);
				}
				callback(null, res.value);
			});
		}
	],
	function (err , result)
	{
		cbf(err, result[3]);
	});
}

exports.checkChildDup = function checkChildDup(nodeId, parentNodeId, URLName, cbf)
{
	exports.node_coll_by_Id(parentNodeId , function(err, coll)
	{
		let collection = db.collection(coll);
		let parentObjectId = new ObjectID (parentNodeId);
		collection.findOne( { parent: parentObjectId, URLName: URLName } , function(err , child)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			cbf(err, child);
		});
	});
}

exports.IsFnode = function IsFnode(nodeId, nodeCol, cbf)
{
	let collection = db.collection(nodeCol);
	collection.find( { parent: nodeId }).toArray(function(err , reSs)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		cbf(err, reSs);
	});
}

exports.nodeInfCObj = function nodeInfCObj(nodeId, cbf)
{
	exports.node_coll_by_Id(nodeId , function(err, coll)
	{
		if(err)
		{
			return cbf(err);			
		}
		else if(coll == null)
		{
			cbf(null, null);
			return;
		}
		let collection = db.collection(coll);
		let node_id = new ObjectID (nodeId);

		collection.findOne( { "_id" : node_id } , function(err , nod)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			else if(nod == null)
			{
				console.log("#Mongo. Can not find node document".yellow);
			}
			cbf(err, nod);
		});
	});
}

exports.nodeInfNoObjWColl = function nodeInfNoObjWColl(node_id, coll, cbf)
{
	let collection = db.collection(coll);

	collection.findOne( { "_id" : node_id } , function(err , node)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		else if(node == null)
		{
			console.log("#Mongo. Can not find node document".yellow);
		}
		cbf(err, node);
	});
}

exports.parentId_by_nodeId = function parentId_by_nodeId(coll, nodeId, cbf)
{
	let collection = db.collection(coll);
	let node_id = new ObjectID (nodeId);

	collection.findOne( { "_id" : node_id } , function(err , art)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		else if(art == null)
		{
			console.error( new Error("#Mongo #FIXME. could not fine node parent. message: %s".red, err) );
		}
		cbf(err, art.parent);
	});
}

exports.edit_parent_by_id = function edit_parent_by_id(coll, nodeId, parentNodeId, cbf)
{
	let collection = db.collection(coll);

	collection.findOneAndUpdate
	({
		_id: nodeId
	},
	{
		$set:
		{
			parent: parentNodeId
		}
	},
	function(err , result)
	{
		if(err)
		{
			console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
		}
		else
		{
			console.log("#Mongo. #Article Edit. Parent edited.".yellow);
		}
		cbf(err);
	});
}

exports.node_coll_by_Id = function node_coll_by_Id(nodeId, cbf)
{
	let node_id = null;
	try
	{
		node_id = new ObjectID (nodeId);
	}
	catch (error)
	{
		console.error( new Error(`wrong nodeId=${nodeId}. message: ${error}`.red) );
		return cbf(error);		
	}
	let coll = null;
	async.forEachOf(consV.database.allColls , function(el , index , callback)
	{
		let collection = db.collection(el);
		collection.findOne( { "_id" : node_id } , function(err , art)
		{
			if(err)
			{
				return callback(err);
			}
			else if(art)
			{
				coll = consV.database.allColls[index];
			}
			callback(null);
		});
	},
	function (err)
	{
		if(err)
		{
			console.error( new Error("#Error: ".red + err) );
		}
		else if(coll == null)
		{
			console.error( new Error(`#could not found art collection: ${err}`.red ) );
		}
		cbf(err, coll);
	});
}

exports.nodeId_byPath = function nodeId_byPath(address , coll , cbf)
{
	let collection = db.collection(coll);

	let cbfCalled = false;
	let node_id;
	let i = 0;
	let FC_counter = 1;
	function rec(node_name , parent)
	{
		collection.findOne( {"URLName" : node_name , "parent" : parent} , function(err , node)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
				if(cbfCalled == false)
				{
					cbfCalled = true;
					cbf(err, consV.codes.db.Error);
				}
			}
			else if(node == null)
			{
				console.error( new Error("#Mongo #FIXME. Can not find node document.".red ) );
				if(cbfCalled == false)
				{
					cbfCalled = true;
					cbf(true, consV.codes.db.docNotFound);
				}
			}
			else if(node)
			{
				if( i != address.length )
				{
					FC_counter ++;
					rec(address[i++] , node._id);
				}
				else
				{
					node_id = node._id;
				}
			}
			FC_counter--;
			if(FC_counter == 0 && cbfCalled == false)
			{
				cbfCalled = true;
				cbf(null, node_id);
			}
		});
	}
	rec(address[i++], null);
}

exports.node_byPath = function node_byPath(address , coll , cbf)
{
	let collection = db.collection(coll);

	let cbfCalled = false;
	let NodeInfo;
	let i = 0;
	let FC_counter = 1;
	function rec(node_name , parent)
	{
		collection.findOne( {"URLName" : node_name , "parent" : parent} , function(err , node)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
				if(cbfCalled == false)
				{
					cbfCalled = true;
					cbf(err, consV.codes.db.Error);
				}
			}
			else if(node == null)
			{
				console.warn( `#Warning. #Mongo. Can not find node document by this address: ${address}`.yellow );
				if(cbfCalled == false)
				{
					cbfCalled = true;
					cbf(true, consV.codes.db.docNotFound);
				}
			}
			else if(node)
			{
				if( i != address.length )
				{
					FC_counter ++;
					rec(address[i++] , node._id);
				}
				else
				{
					NodeInfo = node;
				}
			}
			FC_counter--;
			if(FC_counter == 0 && cbfCalled == false)
			{
				cbfCalled = true;
				cbf(null, NodeInfo);
			}
		});
	}
	rec(address[i++], null);
}

exports.loc_byPath = function loc_byPath(address , coll , lang, cbf)
{
	let collection = db.collection(coll);

	let cbfCalled = false;
	let loc_path = [];
	let i = 0;
	let FC_counter = 1;
	function rec(node_name , parent)
	{
		collection.findOne( {"URLName" : node_name , "parent" : parent} , function(err , node)
		{
			if(err)
			{
				console.error( new Error("#Mongo #FIXME. an error happened. message: %s".red, err) );
				if(cbfCalled == false)
				{
					cbfCalled = true;
					cbf(err, consV.codes.db.Error);
				}
			}
			else if(node == null)
			{
				console.error( new Error( "#Mongo #Wrong_Url. can not find path's node.".red ) );
				if(cbfCalled == false)
				{
					cbfCalled = true;	
					cbf(true, consV.codes.db.docNotFound);
				}
			}
			else if(node)
			{
				loc_path.push(node.treeTitle[lang])
				if( i != address.length )
				{
					FC_counter ++;
					rec(address[i++] , node._id);
				}
			}
			FC_counter--;
			if(FC_counter == 0 && cbfCalled == false)
			{
				cbfCalled = true;
				cbf(err, loc_path);
			}
		});
	}
	rec(address[i++], null);
}

exports.branch_by_NodeId = function branch_by_NodeId(node_id , coll, lang, cbf)
{
	let collection = db.collection(coll);

	let cbfCalled = false;
	let branch = [];
	let i = 0;
	let FC_counter = 1;
	function rec(nodeId)
	{
		collection.findOne( {"_id" : nodeId} , function(err , node)
		{
			if(err)
			{
				console.error( new Error("#Mongo #FIXME. an error happened. message: %s".red, err) );
				if(cbfCalled == false)
				{
					cbfCalled = true;
					cbf(err, consV.codes.db.Error);
				}
			}
			else if(node == null)
			{
				console.error( new Error( "#Mongo #Wrong_Url. can not find path's node.".red ) );
				if(cbfCalled == false)
				{
					cbfCalled = true;	
					cbf(true, consV.codes.db.docNotFound);
				}
			}
			else if(node)
			{
				branch.push(node);
				if( node.parent != null )
				{
					FC_counter ++;
					rec(node.parent);
				}
			}
			FC_counter--;
			if(FC_counter == 0 && cbfCalled == false)
			{
				cbfCalled = true;
				async.forEachOf(branch, function(el, index, callback)
				{
					exports.url_by_NodeId(el._id, coll, function(err , url)
					{
						url.push('/' + lang + '/encyclopedia');
						url.reverse();
						url = url.join('/');
						branch[index].url = url;
						callback(null);
					});
				},
				function (err)
				{
					if(err)
					{
						console.error( new Error(`#Mongo. #branch_by_NodeId. error: ${err}`.red) );
					}
					cbf(err, branch);
				});
			}
		});
	}
	rec(node_id);
}

exports.url_by_NodeId = function url_by_NodeId(node_id , collection , cbf)
{
	let coll = db.collection(collection);
	let callbackCalled = false;
	let url = [];

	let i = 0;
	let FC_counter = 1;
	
	function rec(node_id)
	{
		coll.findOne( {"_id" : node_id} , function(err , node)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
				if(callbackCalled == false)
				{
					callbackCalled = true;
					cbf(err, null);
				}
			}
			else if(node == null)
			{
				err = true;
				console.log( new Error( `#Mongo. #url_by_NodeId function. Can not find node document. nodeId=${node_id} in collection=${collection}`) );
				if(callbackCalled == false)
				{
					callbackCalled = true;
					cbf(err, null);
				}
			}
			else if(node)
			{
				url.push(node.URLName);
				
				if(node._id.valueOf().toString() != exports.root_id_by_coll_name(collection))
				{
					FC_counter++;
					rec(node.parent);
				}
			}
			FC_counter--;
			if(FC_counter == 0 && callbackCalled == false)
			{
				callbackCalled = true;
				cbf(null, url);
			}
		});
	}
	rec(node_id);
}

exports.url_by_NodeId_NoObj_NoColl = function url_by_NodeId_NoObj_NoColl(nodeId , cbf)
{
	exports.node_coll_by_Id(nodeId , function(err, coll)
	{
		if(err)
		{
			return cbf(err);			
		}
		else if(coll == null)
		{
			return cbf(null, null);
		}
		let collection = db.collection(coll);
		let node_id = new ObjectID (nodeId);
		let callbackCalled = false;
		let url = [];
	
		let i = 0;
		let FC_counter = 1;
		
		function rec(node_id)
		{
			collection.findOne( {"_id" : node_id} , function(err , node)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
					if(callbackCalled == false)
					{
						callbackCalled = true;
						cbf(err, null);
					}
				}
				else if(node == null)
				{
					console.log( new Error( "#Mongo. #url_by_NodeId_NoObj_NoColl function. Can not find node document") );
				}
				else if(node)
				{
					url.push(node.URLName);
					
					if(node._id.valueOf().toString() != exports.root_id_by_coll_name(coll))
					{
						FC_counter++;
						rec(node.parent);
					}
				}
				FC_counter--;
				if(FC_counter == 0 && callbackCalled == false)
				{
					callbackCalled = true;
					cbf(null, url);
				}
			});
		}
		rec(node_id);
	});
}

exports.root_id_by_coll_name = function root_id_by_coll_name(coll_name)
{
	let res = null;
	Object.keys(consV.database.enc).forEach(element => {
		if(typeof consV.database.enc[element].CollName != 'undefined' && consV.database.enc[element].CollName == coll_name)
		{
			res = consV.database.enc[element].rootObjId.valueOf().toString();
		}
	});
	return res;
}