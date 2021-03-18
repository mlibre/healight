"use strict";

let database = require(consV.methods.db.main);
let ObjectID = require('mongodb').ObjectID;
let async = require('async');

exports.create_edit_draft_art = function create_edit_draft_art(formVars, userId, cbf)
{
	if( formVars.tags != "" && typeof formVars.tags != "undefined")
	{
		let tags = formVars.tags.match(/[^\,]+/ig);
		for (var i = 0; i < tags.length; i++)
		{
			tags[i] = tags[i].trim();
		}
		formVars.tags = tags;
	}
	if(formVars.tags == "")
	{
		formVars.tags = null;
	}
	if(formVars.treeTitle == "")
	{
		formVars.treeTitle = null;
	}
	let license = {};
	license.type = formVars.formArtResLicType;
	license.text = formVars.formArtResLic;

	database.GetConnAsync(function(db)
	{
		let collection = db.collection(consV.database.draft.CollName);
		let tagsPath = "tags." + formVars.formArtLang;
		let content = "content." + formVars.formArtLang;
		let summary = "summary." + formVars.formArtLang;
		let treeTitle = "treeTitle." + formVars.formArtLang;
		let social_media =
		{
			"medium" :
			{
				 [formVars.formArtLang] :
				 {
					  "date" : new Date(),
					  "url" : "test.com",
					  "locCh": false,
					  "artCh": false
				 }
			}
	  }

		collection.findOneAndUpdate
		({
			"spaceFolderName": formVars.spaceFolderName
		},
		{
			$set:
			{
				"parent": null,
				"spaceFolderName": formVars.spaceFolderName,
				"URLName": null,
				[treeTitle]: formVars.treeTitle,
				[content]: formVars.articleContent,
				[summary]: formVars.summary,
				[tagsPath]: formVars.tags,
				"license": license,
				"resources": {},
				"approved_by_users": [userId],
				"rejected_by_users": {},
				"owners" : [userId],
				"social_media": social_media,
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
	});
}

exports.edit_art_by_spaceFName = function edit_art_by_spaceFName(formVars, userId, cbf)
{
	if( formVars.tags != "" && typeof formVars.tags != "undefined")
	{
		let tags = formVars.tags.match(/[^\,]+/ig);
		for (var i = 0; i < tags.length; i++)
		{
			tags[i] = tags[i].trim();
		}
		formVars.tags = tags;
	}
	if(formVars.tags == "")
	{
		formVars.tags = null;
	}
	if(formVars.treeTitle == "")
	{
		formVars.treeTitle = null;
	}
	let license = {};
	license.type = formVars.formArtResLicType;
	license.text = formVars.formArtResLic;

	database.GetConnAsync(function(db)
	{
		exports.art_coll_by_spaceFName(formVars.spaceFolderName , function(err, coll)
		{
			if(err)
			{
				cbf(err);
			}
			if(coll == null)
			{
				cbf(true, coll);
				return;
			}
			let collection = db.collection(coll);
			let tagsPath = "tags." + formVars.formArtLang;
			let content = "content." + formVars.formArtLang;
			let summary = "summary." + formVars.formArtLang;
			let treeTitle = "treeTitle." + formVars.formArtLang;

			collection.findOneAndUpdate
			({
				"spaceFolderName": formVars.spaceFolderName
			},
			{
				$set:
				{
					"spaceFolderName": formVars.spaceFolderName,
					[treeTitle]: formVars.treeTitle,
					[content]: formVars.articleContent,
					[summary]: formVars.summary,
					[tagsPath]: formVars.tags,
					"license": license,				
					"date" : new Date()
				}
			},
			{
				returnOriginal: false
			},
			function(err , result)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
				}
				cbf(err, result.value);
			});
		});
	});
}

exports.edit_place_art_by_ID = function edit_place_art_by_ID(nodeId, parentNodeId, URLName, cbf)
{
	database.GetConnAsync(function(db)
	{
		database.node_coll_by_Id(nodeId , function(err, coll)
		{
			let collection = db.collection(coll);
			let node_id = new ObjectID (nodeId);
			let parent_node_id;
			if(parentNodeId == null)
			{
				parent_node_id = null;
			}
			else
			{
				parent_node_id = new ObjectID (parentNodeId);
			}

			collection.findOneAndUpdate
			({
				_id: node_id
			},
			{
				$set:
				{
					parent: parent_node_id,
					URLName: URLName
				}
			},
			{
				returnOriginal: false
			},
			function(err , result)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
				}
				else
				{
					console.log("#Mongo. Article Edited.".yellow);
				}
				cbf(err, result.value);
			});
		});
	});
}

exports.check_editPerm_by_spaceFName = function check_editPerm_by_spaceFName(user_id, spaceFolderName, cbf)
{
	exports.article_by_spaceFName(spaceFolderName, function (err, art)
	{
		if(err)
		{
			cbf(err);
		}
		else if(art == null)
		{
			cbf(null, true);
		}
		else if( art.owners.indexOf(user_id) != -1 )
		{
			cbf(null, true);
		}
		else
		{
			cbf(null, false)
		}
	});
}

exports.check_placePerm = function check_placePerm(user_id, art_id, cbf)
{
	database.GetConnAsync(function(db)
	{
		database.nodeInfCObj(art_id, function(err , art)
		{
			if(err)
			{
				cbf(err);
			}
			else if( art.owners.indexOf(user_id) != -1 )
			{
				cbf(null, true);
			}
			else
			{
				cbf(null, false)
			}
		});
	});
}

exports.AArt = function AArt(nodeId, nodeEnc, user_Id, cbf)
{
	database.GetConnAsync(function(db)
	{		
		let collection = db.collection(nodeEnc);
		let node_id = new ObjectID (nodeId);
		let rbuUId = "rejected_by_users." + user_Id;

		collection.findOneAndUpdate
		({
			_id: node_id
		},
		{
			$addToSet:
			{
				"approved_by_users": user_Id
			},
			$unset:
			{
				[rbuUId]: ""
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
				console.log("#Mongo. Article Edited. approve".yellow);
			}
			cbf(err);
		});
	});
}

exports.RArt = function RArt(nodeId, nodeEnc, user_Id, RAText, cbf)
{
	database.GetConnAsync(function(db)
	{		
		let collection = db.collection(nodeEnc);
		let node_id = new ObjectID (nodeId);
		let rbuUId = "rejected_by_users." + user_Id;

		collection.findOneAndUpdate
		({
			_id: node_id
		},
		{
			$pull:
			{
				"approved_by_users": user_Id
			},
			$set:
			{
				[rbuUId]: RAText
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
				console.log("#Mongo. Article Edited. reject article".yellow);
			}
			cbf(err);
		});
	});
}

exports.NOArt = function NOArt(nodeId, nodeEnc, user_Id, cbf)
{
	database.GetConnAsync(function(db)
	{		
		let collection = db.collection(nodeEnc);
		let node_id = new ObjectID (nodeId);
		let rbuUId = "rejected_by_users." + user_Id;

		collection.findOneAndUpdate
		({
			_id: node_id
		},
		{
			$pull:
			{
				"approved_by_users": user_Id,
			},
			$unset:
			{
				[rbuUId]: ""
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
				console.log("#Mongo. Article Edited. reject article".yellow);
			}
			cbf(err);
		});
	});
}

exports.replace_art = function replace_art(Enc, nodeId, parentNodeId, URLName, cbf)
{
	var old_coll = null;
	database.GetConnAsync(function(db)
	{
		async.waterfall
		([
			function (callback)
			{
				database.node_coll_by_Id(nodeId , function(err, coll)
				{
					old_coll = coll;
					callback(null);
				});
			},
			function (callback)
			{
				exports.edit_place_art_by_ID(nodeId, parentNodeId, URLName, function (err , res)
				{
					callback(err , res);
				});
			},
			function(doc, callback)
			{
				let collection = db.collection(old_coll);
				collection.deleteOne(
				{
					"_id": doc._id
				},
				function(err , result)
				{
					callback(err , doc);
				});
			},
			function(doc, callback)
			{
				let collection = db.collection(Enc);
				collection.insertOne(doc,
				function(err , result)
				{
					callback(err , consV.codes.db.success);
				});
			},
			function(doc, callback)
			{
				let nodeIdOBJ = new ObjectID (nodeId);
				database.IsFnode(nodeIdOBJ, old_coll, function (err, nS)
				{
					async.forEachOf(nS , function(el , index , callb)
					{
						exports.replace_art(Enc, el._id.valueOf().toString(), nodeId, el.URLName, function(err, r)
						{
							callb(null);
						});
					},
					function (err)
					{
						if(err)
						{
							console.error( new Error("#check it. message: %s".red, err) );
						}
						callback(err , consV.codes.db.success);
					});
				});
			}
		],
		function (err , result)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			else
			{
				console.log("#Mongo. Article replaced.".yellow);
			}
			cbf(err, result);
		});
	});
}

exports.drafts = function drafts(cbf)
{
	database.GetConnAsync(function(db)
	{
		let collection = db.collection('draft');
		collection.find().toArray(function(err , draftsDoc)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			cbf(err, draftsDoc);
		});
	});
}

exports.article_approves = function article_approves(nodeId, nodeEnc, cbf)
{
	database.GetConnAsync(function(db)
	{
		let collection = db.collection(nodeEnc);
		collection.findOne( { "_id" : nodeId } , function(err , art)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			let users = [];
			async.forEachOf(art.approved_by_users , function(el , index , callback)
			{
				database.nodeInfCObj(el, function(err , user)
				{
					if(err)
					{
						return callback(err);
					}
					else
					{
						let Muser = {};
						Muser.email = user.email;
						Muser.name = user.name;
						Muser.family = user.family;
						users.push(Muser);
					}
					callback(null);
				});
			},
			function (err)
			{
				if(err)
				{
					console.error( new Error(`#article. #article_approves function. message: ${err}`.red) );
				}
				cbf(err, users);
			});
		});
	});
}

exports.article_resources_WUsersAResInfo = function article_resources_WUsersAResInfo(nodeId, nodeEnc, lang, cbf)
{
	database.GetConnAsync(function(db)
	{
		let collection = db.collection(nodeEnc);
		collection.findOne( { "_id" : nodeId } , function(err , art)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			let users = {};
			async.forEachOf(art.resources[lang] , function(value , key , callB)
			{
				async.forEachOf(value.content_user , function(v , k , callback)
				{
					database.nodeInfCObj(k, function(err , user)
					{
						if(err)
						{
							return callback(err);
						}
						else if(user == null)
						{
							console.error( new Error(`#article. #article_resources_WUsersAResInfo function. user not found. message: ${err}`.red) );	
						}
						else
						{
							let Muser = {};
							Muser.email = user.email;
							Muser.name = user.name;
							Muser.family = user.family;
							users[k] = Muser;
						}
						callback(null);
					});
				},
				function (err)
				{
					if(err)
					{
						console.error( new Error(`#article. #article_approves function. message: ${err}`.red) );
					}
					callB(err);
				});
			},
			function (err)
			{
				if(err)
				{
					console.error( new Error(`#article. #article_approves function. message: ${err}`.red) );
				}
				database.resources(function(err, res)
				{
					cbf(err, [art.resources[lang], users, res]);
				});
			});
		});
	});
}

exports.addEditArtResources = function addEditArtResources(nodeId, nodeEnc, userId, resources, lang, cbf)
{
	database.GetConnAsync(function(db)
	{
		let collection = db.collection(nodeEnc);
		let node_id = new ObjectID (nodeId);
		
		async.forEachOf(resources , function(value , key , callB)
		{
			let Res = "resources." + lang + '.' + key + ".content_user." + userId;
			collection.findOneAndUpdate
			({
				_id: node_id
			},
			{
				$set:
				{
					[Res]: value
				}
			},
			function(err , result)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
				}
				callB(err);
			});
		},
		function (err)
		{
			if(err)
			{
				console.error( new Error(`#article. #article_approves function. message: ${err}`.red) );
			}
			cbf(err);
		});
	});
}

exports.delArtResources = function delArtResources(nodeId, nodeEnc, userId, resId, lang, cbf)
{
	database.GetConnAsync(function(db)
	{
		async.series
		([
			function (callback)
			{
				let collection = db.collection(nodeEnc);
				let node_id = new ObjectID (nodeId);
				let Res = "resources." + lang + '.' + resId + ".content_user." + userId;
				collection.findOneAndUpdate
				({
					_id: node_id
				},
				{
					$unset:
					{
						[Res]: ""
					}
				},
				function(err , result)
				{
					callback(err);
				});
			},
			function (callback)
			{
				let collection = db.collection(nodeEnc);
				let node_id = new ObjectID (nodeId);
				let CU = "resources." + lang + '.' + resId + ".content_user";
				collection.findOneAndUpdate
				({
					_id: node_id,
					[CU]: {}
				},
				{
					$unset:
					{
						[CU]: ""
					}
				},
				function(err , result)
				{
					callback(err);
				});
			},
			function (callback)
			{
				let collection = db.collection(nodeEnc);
				let node_id = new ObjectID (nodeId);
				let RE = "resources." + lang + '.' + resId;
				collection.findOneAndUpdate
				({
					_id: node_id,
					[RE]: {}
				},
				{
					$unset:
					{
						[RE]: ""
					}
				},
				function(err , result)
				{
					callback(err);
				});
			}
		],
		function (err, result)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			cbf(err);
		});
		
	});
}

exports.article_by_spaceFName = function article_by_spaceFName(spaceFolderName, cbf)
{
	database.GetConnAsync(function(db)
	{
		exports.art_coll_by_spaceFName(spaceFolderName , function(err, coll)
		{
			if(err)
			{
				cbf(err);
				return;
			}
			if(coll == null)
			{
				cbf(null, coll);
				return;
			}
			let collection = db.collection(coll);
			collection.findOne( { "spaceFolderName" : spaceFolderName } , function(err , art)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
				}
				cbf(err, art);
			});
		});
	});
}

exports.art_coll_by_spaceFName = function art_coll_by_spaceFName(spaceFolderName, cbf)
{
	database.GetConnAsync(function(db)
	{
		var coll = null;
		async.forEachOf(consV.database.enc.allEncsColls , function(el , index , callback)
		{
			let collection = db.collection(el);
			collection.findOne( { "spaceFolderName" : spaceFolderName } , function(err , art)
			{
				if(err)
				{
					return callback(err);
				}
				else if(art)
				{
					coll = consV.database.enc.allEncsColls[index];
				}
				callback(null);
			});
		},
		function (err)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			else if(coll == null)
			{
				// console.log( "#Mongo. Coudnt find article collection" );
			}
			cbf(err, coll);
		});
	});
}