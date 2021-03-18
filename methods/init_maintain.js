"use strict";

let DBMain = require( consV.methods.db.main );
let DBRelatedP = require( consV.methods.db.relatedP );
let DBArticles = require( consV.methods.db.articles );
let DBProfile = require( consV.methods.db.profile );
let space = require( consV.methods.space );
let async = require('async');
let request = require('request');
let hashes = require('jshashes');

/**************************** DB Schema ****************************/
// Article Schema
let rootArticle =
{
	// _id: el.rootObjId,
	"parent": null,
	// "spaceFolderName": el.rootObjId.valueOf().toString(),
	// "URLName": el.name,
	"treeTitle" : {},
	"content" : {},
	"resources": {},
	"license" : {},
	"tags" : {},
	"approved_by_users": [],
	"rejected_by_users": {},
	"owners" : [],
	"social_media": {}
	// "date" : new Date()
}
rootArticle['license']['type'] = "default";
rootArticle['license']['text'] = null;
rootArticle['social_media']['medium'] = {};
consV.site.langs.inArray.forEach( (langEl , index) =>
{
	rootArticle['tags'][langEl] = null;
	rootArticle['content'][langEl] = "Sample TExt, I am the Root :)";
	rootArticle['social_media']["medium"][langEl] = {};
	rootArticle['social_media']["medium"][langEl]["date"] = new Date();
	rootArticle['social_media']["medium"][langEl]["url"] = "";
	rootArticle['social_media']["medium"][langEl]["locCh"] = false;
	rootArticle['social_media']["medium"][langEl]["artCh"] = false;
});

// SlideShow Schema
let slideshowSample =
{
	art_id: null,
	image_add: null,
	image_alt: null,
	title: null
}
let SSSData = {};
SSSData['_id'] = 'slideshows';
// Portal
// consV.site.langs.inArray.forEach( (el , index) =>
// {
// 	SSSData["home." + el] = [sample];
// });
// Object.keys(consV.database.enc).forEach(element => {
// 	if(typeof consV.database.enc[element].CollName != 'undefined')
// 	{
// 		SSSData["portals_" + consV.database.enc[element].name + '.fa'] = [sample];
// 	}
// });

//Resources Schema
let resourcesSample =
{
	"_id": 'resources' ,
	'0.type': null,
	'0.name.fa': 'testName',
	'0.family.fa': 'testFamilyName',
	'0.content.fa': 'testContent'
}

// Telegram non-art
let nonArtTel =
{
	"_id": 'non_arts',
	"list": ['397e41c11ed051383873ec50']
}

// Medium Sample
let mediumSample =
{
	'_id': 'medium',
	"published_art.fa" :
	{
		"397e41c11ed051383873ec50" : {},
		"397e41c11ed051383873ec51" : {}
	  }
}

// Telegram Published
let telPublished =
{
	'_id': 'telegram',
	"published_art.fa" :
	{
		"397e41c11ed051383873ec50" : {},
		"397e41c11ed051383873ec51" : {}
	  }
}

/**************************** Initiating DB Schema ****************************/

exports.createColls = async function createColls()
{
	DBMain.GetConnAsync(async function(db)
	{
		let collList = await db.listCollections().toArray();
		let collNames = [];
		collList.forEach(element =>
		{
			collNames = collNames.concat(element.name);
		});
		consV.database.allColls.forEach(async element =>
		{
			if(collNames.indexOf(element) == -1)
			{
				console.warn(`#Fix||Maintain. collection: ${element} just created`.yellow);
				await db.createCollection(element);
			}
		});
	});
}

exports.createRoots = function createRoots()
{
	DBMain.GetConnAsync(function(db)
	{
		async.forEachOf(consV.database.enc , function(el , index , callB)
		{
			if(typeof el.CollName != 'undefined')
			{
				rootArticle['_id'] = el.rootObjId;
				rootArticle['spaceFolderName'] = el.rootObjId.valueOf().toString();
				rootArticle['URLName'] = el.name;
				rootArticle['date'] = new Date();
				consV.site.langs.inArray.forEach( (langEl , index) =>
				{
					rootArticle['treeTitle'][langEl] = el.name;
				});
				DBMain.findOneAUOnInsert(el.CollName, rootArticle, {"parent": null},
				function (err, result)
				{
					if(err)
					{
						return callB(err);
					}
					callB(null);
				});
			}
			else
			{
				callB(null);
			}
		},
		function (err)
		{
			if(err)
			{
				console.error(`check it. message: ${err}`);
			}
			else
			{
				console.warn('#Fix||Maintain. Root Arts added. u can comment this function now'.yellow);
			}
		});
	});
}

exports.createBasicDocuments = function createBasicDocuments()
{
	DBMain.GetConnAsync(function(db)
	{
		// slideshow
		consV.site.langs.inArray.forEach( (el , index) =>
		{
			SSSData["home." + el] = [slideshowSample];
			Object.keys(consV.database.enc).forEach(element =>
			{
				if(typeof consV.database.enc[element].CollName != 'undefined')
				{
					SSSData["portals_" + consV.database.enc[element].name + '.' + el] = [slideshowSample];
				}
			});
		});
		DBMain.findOneAUOnInsert('site', SSSData, {_id: 'slideshows'});
		//today article
		let sampleRoot;
		let sampleColl;
		Object.keys(consV.database.enc).forEach(element =>
		{
			if(typeof consV.database.enc[element].CollName != 'undefined')
			{
				sampleRoot = consV.database.enc[element].rootObjId;
				sampleColl = consV.database.enc[element].CollName;
			}
		});
		let TodayArticle =
		{
			_id: 'today_article',
		}
		consV.site.langs.inArray.forEach( (el , index) =>
		{
			TodayArticle[el] =
			{
				node_id: sampleRoot,
				collection: sampleColl
			};
		});
		DBMain.findOneAUOnInsert('site', TodayArticle, {_id: 'today_article'});

		//resources
		DBMain.findOneAUOnInsert('site', resourcesSample, {_id: 'resources'});

		// *** social media ***//
		// Non art Telegram
		DBMain.findOneAUOnInsert('social_media', nonArtTel, {_id: 'non_arts'});

		// Medium
		DBMain.findOneAUOnInsert('social_media', mediumSample, {_id: 'medium'});

		// Telegram, published
		DBMain.findOneAUOnInsert('social_media', telPublished, {_id: 'telegram'});
	});
}

exports.signUpAdmin = function signUpAdmin(username, email, password, Lang)
{
	let adminInfo =
	{
		"username" : username,
		"password" : new hashes.SHA256().hex(password),
		"email" : email,
		"name" : null,
		"family" : null,
		"Lang": Lang,
		"date" : new Date(),
		"aboutme": "",
		"permissions" :
		{
			"root": true,
			"panel" : true,
			"create_art" : true,
			"place_art": true,
			"update_art": true,
			"delete_art": true,
			"approve_art": true,
			"add_res_art": true,
			"enc_tree": true,
			"pages_stuff": true,
			"admin_stuff": true,
			"helpers": true,
			"space": true
		}
	}
	DBMain.GetConnAsync(function(db)
	{
		DBMain.findOneAUOnInsert('users', adminInfo, {username: username});
	});
}

exports.addAdminAsOwnerToAllArts = function addAdminAsOwnerToAllArts()
{
	DBMain.GetConnAsync(function(db)
	{
		async.forEachOf(consV.database.enc.allEncsColls , function(el , index , callB)
		{
			let collection = db.collection(el);
			collection.updateMany
			({},
			{
				$addToSet:
				{
					"owners":
					{
						$each: ["5aaab7d495ef904787a60c2b"]
					}

				}
			},
			function (err, result)
			{
				if(err)
				{
					return callB(err);
				}
				callB(null)
			});
		},
		function (err)
		{
			if(err)
			{
				console.error(`check it. message: ${err}`);
			}
			else
			{
				console.warn('#Fix||Maintain. User Admin added as owner to the all arts'.yellow);
			}
		});
	});
}

/**************************** maintaining Schema ****************************/

exports.isEveryArticleHaveItsFolder = function isEveryArticleHaveItsFolder()
{
	exports.artilcesFolders(function (list)
	{
		async.forEachOf(list, function(el, index, cb)
		{
			let res = space.CheckFolder(consV.space.articlesFolderName, el);
			if( res == false )
			{
				console.error( new Error(`#Fix||Maintain. #Error. message: ${consV.space.articlesFolderName}${el} is ${res}`.red) );
				space.CreateFolder(consV.space.articlesFolderName, el, function (err, res)
				{
					if(err)
					{
						console.error( new Error("#Fix||Maintain. Cant craete folder. message: %s".red, err) );
					}
					else
					{
						console.log('#Fix||Maintain. Folder %s %s Created'.green, consV.space.articlesFolderName, el);
					}
					cb(null);
				});
			}
			else
			{
				cb(null);
			}
		},
		function (err)
		{
			if(err)
			{
				console.error( new Error("#error. message: %s ".red, err) );
			}
		});
	});
}

exports.deleteOrphanFolders = function deleteOrphanFolders()
{
	let ADList = space.directoryList(consV.space.articlesFolderName);
	exports.artilcesFolders(function (AList)
	{
		ADList.diff(AList).forEach(function(el)
		{
			console.error( new Error(`#Fix||Maintain. Oraphan Folder: ${consV.space.articlesFolderName + el}`.red) );
			space.deleteFolder(consV.space.articlesFolderName, el, function ()
			{
				console.log(consV.space.articlesFolderName.green + el.green, 'deleted'.green);
			});
		}, this);
	});

	let RDList = space.directoryList(consV.space.resourcesFolderName);
	exports.allResources(function (err, keys)
	{
		if(keys != null)
		{
			RDList.diff(keys).forEach(function(el)
			{
				console.error( new Error(`#Fix||Maintain. Oraphan Folder: ${consV.space.articlesFolderName + el}`.red) );
				space.deleteFolder(consV.space.resourcesFolderName, el, function ()
				{
					console.log('folder %s%s deleted'.green, consV.space.articlesFolderName, el);
				});
			}, this);
		}
	});
}

exports.deleteDeletedResources = function deleteDeletedResources()
{
	DBMain.GetConnAsync(function(db)
	{
		let allPossibleResources = [...Array(200).keys()];
		async.waterfall
		([
			function (callback)
			{
				exports.allResources(function (err, reses)
				{
					if(reses != null)
					{
						callback(err, reses);
					}
					else
					{
						callback("There are no resources :!", null);
					}
				});
			},
			function (reses, callback)
			{
				console.log(reses);
				// async.forEachOf(consV.database.enc.EncsColls , function(el , index , callB)
				// {
				// 	let collection = db.collection(el);
				// 	collection.updateMany
				// 	({},
				// 	{
				// 		$unset: sbdO
				// 	},
				// 	function (err, result)
				// 	{
				// 		if(err)
				// 		{
				// 			return callB(err);
				// 		}
				// 		console.log("#Resources" , sbdO , "Deleted");
				// 		callB(null)
				// 	});
				// },
				// function (err)
				// {
				// 	callback(err);
				// });
			}
		],
		function (err, result)
		{
			if(err)
			{
				if(result == null)
				{
					console.warn( `#Fix||Maintain. ${err}`.yellow );
				}
				else
				{
					console.error( new Error(`#error. message: ${err}`.red) );
				}
			}
		});
	});
}

exports.deleteDeletedUsers = function deleteDeletedUsers()
{
	DBMain.GetConnAsync(function(db)
	{
		async.waterfall
		([
			function (callback)
			{
				DBProfile.usersList(function(err , users)
				{
					let usersId = [];
					users.forEach(element => {
						usersId.push(element._id.valueOf().toString());
					});
					callback(err, usersId);
				});
			},
			function (usersId, callback)
			{
				async.forEachOf(consV.database.enc.EncsColls , function(el , index , callB)
				{
					let collection = db.collection(el);
					collection.updateMany
					({},
					{
						$pull:
						{
							owners:
							{
								$nin: usersId
							},
							approved_by_users:
							{
								$nin: usersId
							}
						}
					},
					function (err, result)
					{
						if(err)
						{
							return callB(err);
						}
						callB(null)
					});
				},
				function (err)
				{
					callback(err, usersId);
				});
			},
			function (usersId, callback)
			{
				exports.deleteDeletedUsersFromRejected_by_usersField(usersId, function(err)
				{
					callback(err);
				});
			}
		],
		function (err, result)
		{
			if(err)
			{
				console.error( new Error(`#error. message: ${err}`.red) );
			}
		});
	});
}

exports.deleteDeletedUsersFromRejected_by_usersField = function deleteDeletedUsersFromRejected_by_usersField(usersId, cbf)
{
	DBMain.GetConnAsync(function(db)
	{
		async.forEachOf(consV.database.enc.EncsColls , function(el , index , callback)
		{
			let collection = db.collection(el);
			collection.find().toArray(function(err , arts)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
					callback(null);
				}
				else if(arts.length == 0)
				{
					console.log(`#Fix||Maintain. ${el} is empty`.yellow);
					callback(null);
				}
				else
				{
					async.forEachOf(arts, function(el_2, index_2, cb)
					{
						let shbd = Object.keys(el_2.rejected_by_users).diff(usersId);
						let sbdO = {"TEMP" :"TEMP"};
						shbd.forEach(function (item, index)
						{
							sbdO['rejected_by_users.' + item] = "";
						});
						collection.findOneAndUpdate
						({
							_id: el_2._id
						},
						{
							$unset: sbdO
						},
						function(err , result)
						{
							if(err)
							{
								console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
							}
							cb(err);
						});
					},
					function (err)
					{
						if(err)
						{
							console.error( new Error(`#error. message: ${err}`.red) );
						}
						callback(null);
					});
				}
			});
		},
		function (err)
		{
			if(err)
			{
				console.error( new Error("#error. message: %s".red, err) );
			}
			cbf(err);
		});
	});
}



exports.allResources = function allResources(cbf)
{
	DBMain.GetConnAsync(function(db)
	{
		let collection = db.collection("site");
		collection.findOne({"_id": "resources"} , function (err, resDoc)
		{
			if(resDoc != null)
			{
				let keys = Object.keys(resDoc);
				keys.splice( keys.indexOf("_id"), 1);
				cbf(err, keys);
			}
			else
			{
				cbf(err, null);
			}
		});
	});
}

exports.artilcesFolders = function artilcesFolders(cbf)
{
	let spaceFolderNameList = [];
	DBMain.GetConnAsync(function(db)
	{
		async.forEachOf(consV.database.enc.allEncsColls , function(el , index , callback)
		{
			let collection = db.collection(el);
			collection.find().toArray(function(err , arts)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
					callback(null);
				}
				else if(arts.length == 0)
				{
					console.log('#Fix||Maintain. %s is empty'.yellow, el);
					callback(null);
				}
				else
				{
					async.forEachOf(arts, function(el_2, index_2, cb)
					{
						spaceFolderNameList.push(el_2.spaceFolderName);
						cb(null);
					},
					function (err)
					{
						if(err)
						{
							console.error( new Error("#error. message: %s".red, err) );
						}
						callback(null);
					});
				}
			});
		},
		function (err)
		{
			if(err)
			{
				console.error( new Error("#error. message: %s".red, err) );
			}
			cbf(spaceFolderNameList);
		});
	});
}

exports.deltedDeltedNonArtTelArts = function deltedDeltedNonArtTelArts()
{
	async.waterfall
	([
		function (callback)
		{
			DBRelatedP.telNonArts(function(err , result)
			{
				if(result == null)
				{
					callback(true, null);
				}
				else
				{
					callback(null, result);
				}
			});
		},
		function (result, callback)
		{
			async.forEachOf(result.list, function(el, index, asFEcb)
			{
				DBMain.nodeInfCObj(el, function(err , art)
				{
					if( art == null )
					{
						DBRelatedP.telNonArtDel(el, function(err , result)
						{
							asFEcb(null);
						});
					}
					else
					{
						asFEcb(null);
					}
				});
			},
			function (err)
			{
				if(err)
				{
					console.error( new Error(`#error: " + ${err}`.red) );
				}
				callback(null, result);
			});
		}
	],
	function (err, result)
	{
		if(err)
		{
			if(result == null)
			{
				console.log('#Fix||Maintain. nothing To do for deltedDeltedNonArtTelArts:))'.yellow);
			}
			else
			{
				console.log(err);
			}
		}
	});
}

exports.lostArticles = function lostArticles()
{
	DBMain.GetConnAsync(function(db)
	{
		async.forEachOf(consV.database.enc.EncsColls , function(el , index , callback)
		{
			let collection = db.collection(el);
			collection.find().toArray(function(err , arts)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
					callback(null);
				}
				else if(arts.length == 0)
				{
					console.log(`#Fix||Maintain. ${el} is empty`.yellow);
					callback(null);
				}
				else
				{
					async.forEachOf(arts, function(el_2, index_2, cb)
					{
						DBMain.url_by_NodeId(el_2._id, el, function (err, url)
						{
							if(err)
							{
								console.log('Find Article With Wrong Parent. Moving To drafts.');
								DBArticles.replace_art(consV.database.draft.CollName, el_2._id, null, null, function(err, result)
								{
									cb(null);
								});
							}
						});
					},
					function (err)
					{
						if(err)
						{
							console.error( new Error(`#error. message: ${err}`.red) );
						}
						callback(null);
					});
				}
			});
		},
		function (err)
		{
			if(err)
			{
				console.error( new Error("#error. message: %s".red, err) );
			}
		});
	});
}

exports.checkAllLinksInArts = function checkAllLinksInArts()
{
	DBMain.GetConnAsync(function(db)
	{
		async.forEachOf(consV.database.enc.EncsColls , function(el , index , callback)
		{
			let collection = db.collection(el);
			collection.find().toArray(function(err , arts)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
					callback(null);
				}
				else if(arts.length == 0)
				{
					console.log(`#Fix||Maintain. ${el} is empty`.yellow);
					callback(null);
				}
				else
				{
					async.forEachOf(arts, function(el_2, index_2, cb)
					{
						async.forEachOf(el_2.content, function(el_3, index_3, asFEcb)
						{
							if(el_3 == null)
							{
								asFEcb(null);
							}
							else
							{
								let REgFindRes = {};
								REgFindRes = el_3.match(/src="(.*?)"/g);
								if(REgFindRes == null){REgFindRes = {}}
								for( var i = 0 ; i < REgFindRes.length; i++)
								{
									let REgFindResEl = REgFindRes[i];
									REgFindResEl = REgFindResEl.replace(/src="\//g , '');
									REgFindResEl = REgFindResEl.replace(/"/g , '');
									let url = 'https://' + consV.host.domain + '/' + REgFindResEl
									request.get(url , function (error, response, body)
									{
										if(error || response.statusCode == 404)
										{
											console.warn(`Url: ${url} IN ${el_2.treeTitle[index_3]} dose not exist. please check it`);
										}
									});
								}
								asFEcb(null);
							}
						},
						function (err)
						{
							cb(null);
						});
					},
					function (err)
					{
						if(err)
						{
							console.error( new Error(`#error. message: ${err}`.red) );
						}
						callback(null);
					});
				}
			});
		},
		function (err)
		{
			if(err)
			{
				console.error( new Error("#error. message: %s".red, err) );
			}
		});
	});
}

exports.checkForExternalLinks = function checkForExternalLinks()
{
	DBMain.GetConnAsync(function(db)
	{
		async.forEachOf(consV.database.enc.EncsColls , function(el , index , callback)
		{
			let collection = db.collection(el);
			collection.find().toArray(function(err , arts)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
					callback(null);
				}
				else if(arts.length == 0)
				{
					console.log(`#Fix||Maintain. ${el} is empty`.yellow);
					callback(null);
				}
				else
				{
					async.forEachOf(arts, function(el_2, index_2, cb)
					{
						async.forEachOf(el_2.content, function(el_3, index_3, asFEcb)
						{
							if(el_3 == null)
							{
								asFEcb(null);
							}
							else
							{
								let REgFindRes = {};
								REgFindRes = el_3.match(/src="(.*?)"/g);
								if(REgFindRes == null){REgFindRes = {}}
								for( var i = 0 ; i < REgFindRes.length; i++)
								{
									let REgFindResEl = REgFindRes[i];
									REgFindResEl = REgFindResEl.replace(/src="\//g , '');
									REgFindResEl = REgFindResEl.replace(/"/g , '');
									if(REgFindResEl.indexOf('http') != -1)
									{
										DBMain.url_by_NodeId(el_2._id, el, function (err, url)
										{
											url.push('/' + index_3 + '/encyclopedia');
											url.reverse();
											url = url.join('/');
											console.log(`Article ${url} has external link ${REgFindResEl}`);
											// console.warn(`Url:  IN ${el_2.treeTitle[index_3]} is external`);
										});
									}
								}
								asFEcb(null);
							}
						},
						function (err)
						{
							cb(null);
						});
					},
					function (err)
					{
						if(err)
						{
							console.error( new Error(`#error. message: ${err}`.red) );
						}
						callback(null);
					});
				}
			});
		},
		function (err)
		{
			if(err)
			{
				console.error( new Error("#error. message: %s".red, err) );
			}
		});
	});
}

exports.reviewAlltheArtiles = function reviewAlltheArtiles()
{
	DBMain.GetConnAsync(function(db)
	{
		async.forEachOf(consV.database.enc.EncsColls , function(el , index , callback)
		{
			let collection = db.collection(el);
			collection.find().toArray(function(err , arts)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
					callback(null);
				}
				else if(arts.length == 0)
				{
					console.log(`#Fix||Maintain. ${el} is empty`.yellow);
					callback(null);
				}
				else
				{
					async.forEachOf(arts, function(el_2, index_2, cb)
					{
						async.forEachOf(el_2.content, function(el_3, index_3, asFEcb)
						{
							if(el_3 == null)
							{
								asFEcb(null);
							}
							else if(el_3.length < 100)
							{
								DBMain.url_by_NodeId(el_2._id, el, function (err, url)
								{
									url.push('/' + index_3 + '/encyclopedia');
									url.reverse();
									url = url.join('/');
									console.log(`#Maintain. Artile ${url} is short`);
									asFEcb(null);
								});
							}
							else
							{
								asFEcb(null);
							}
						},
						function (err)
						{
							cb(null);
						});
					},
					function (err)
					{
						if(err)
						{
							console.error( new Error(`#error. message: ${err}`.red) );
						}
						callback(null);
					});
				}
			});
		},
		function (err)
		{
			if(err)
			{
				console.error( new Error("#error. message: %s".red, err) );
			}
		});
	});
}

exports.createLegInfoNode = function createLegInfoNode(Lang)
{
	DBMain.GetConnAsync(function(db)
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
			$setOnInsert:
			{
				[title]: "",
				[content]: "",
				[tags]: [],
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
		});
	});
}

exports.customUpdateMany = function customUpdateMany()
{
	DBMain.GetConnAsync(function(db)
	{
		async.forEachOf(consV.database.enc.allEncsColls , function(el , index , callB)
		{
			let collection = db.collection(el);
			let summary = "summary.fa";
			collection.updateMany
			({},
			{
				$set:
				{
					[summary]: ""
				}
			},
			function (err, result)
			{
				if(err)
				{
					return callB(err);
				}
				callB(null)
			});
		},
		function (err)
		{
			if(err)
			{
				console.error(`check it. message: ${err}`);
			}
			else
			{
				console.warn('#Fix||Maintain. mlibre added to the all arts'.yellow);
			}
		});
	});
}
exports.customUpdateOnEachArt = function customUpdateOnEachArt()
{
	DBMain.GetConnAsync(function(db)
	{
		async.forEachOf(consV.database.enc.EncsColls , function(el , index , callback)
		{
			let collection = db.collection(el);
			collection.find().toArray(function(err , arts)
			{
				if(err)
				{
					console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
					callback(null);
				}
				else
				{
					async.forEachOf(arts, function(art, index_2, cb)
					{
						async.forEachOf(art.resources, function(data, index_3, asFEcb)
						{
							if(data == null)
							{
								asFEcb(null);
							}
							else
							{
								// console.log(art._id, el, Object.keys(data.content_user)[0], art.resources);
								// console.log(art._id, el, Object.keys(data.content_user)[0], index_3);
								DBArticles.addEditArtResources(art._id, el, Object.keys(data.content_user)[0], art.resources, 'fa', function(err)
								{
									if(err)
									{
										console.error(err);
									}
								});
								olddelArtResources(art._id, el, Object.keys(data.content_user)[0], index_3, function(err)
								{
									if(err)
									{
										console.error(err);
									}
								});
								console.log(art.resources);
							}
						},
						function (err)
						{
							cb(null);
						});
					},
					function (err)
					{
						if(err)
						{
							console.error( new Error(`#error. message: ${err}`.red) );
						}
						callback(null);
					});
				}
			});
		},
		function (err)
		{
			if(err)
			{
				console.error( new Error("#error. message: %s".red, err) );
			}
		});
	});
}