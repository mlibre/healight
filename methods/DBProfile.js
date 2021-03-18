"use strict";

let database = require(consV.methods.db.main);
let ObjectID = require('mongodb').ObjectID;
let async = require('async');

exports.signUp = function signUp(email , password , Lang , cbf)
{
	database.GetConnAsync(function(db)
	{
		let collection = db.collection('users');
		collection.insertOne
		({
			"username" : null,
			"password" : password,
			"email" : email,
			"name" : null,
			"family" : null,
			"Lang": Lang,
			"date" : new Date(),
			"permissions" :
			{
				"panel" : false,
				"create_art" : false,
				"place_art": false,
				"update_art": false,
				"delete_art": false,
				"approve_art": false,
				"add_res_art": false,
				"enc_tree": false,
				"pages_stuff": false,
				"admin_stuff": false,
				"helpers": false,
				"space": false
			}
		},
		function(err , result)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
				cbf(err, consV.codes.db.Error);
			}
			else
			{
				cbf(null, result.ops[0]);
			}
		});
	});
}

exports.editUserInfo = function editUserInfo(userId, formVars, cbf)
{
	const avai_data = Object.assign(formVars);
	userId = new ObjectID (userId);
	database.GetConnAsync(function(db)
	{
		let collection = db.collection('users');
		collection.findOneAndUpdate
		({
			_id: userId
		},
		{
			$set: avai_data
		},
		function (err, result)
		{
			cbf(err, result);
		});
	});
}

exports.usersList = function usersList(cbf)
{
	database.GetConnAsync(function(db)
	{
		let collection = db.collection('users');
		collection.find().toArray(function(err , users)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			else if(users == null)
			{
				console.log("#Mongo. Can not find user document.");
			}
			cbf(err, users);
		});
	});
}

exports.userInfoByEmOrUN = function userInfoByEmOrUN(emUs, password, cbf)
{
	database.GetConnAsync(function(db)
	{
		let collection = db.collection('users');
		collection.findOne(
		{
			$or: [
				{
					"email" : emUs,
					"password": password
				},
				{
					"username": emUs,
					"password": password
				}
			]
		},
		function (err , user)
		{
			cbf(err, user);
		});
	});
}

exports.userInfoById = async function userInfoById(userId)
{
	userId = new ObjectID (userId);
	let db = database.GetConnSync();
	let collection = await db.collection('users');
	let err, result = collection.findOne(
	{
		_id: userId
	});
	return err , result;
}

exports.deleteUser = function deleteUser(nodeId , cbf)
{
	database.GetConnAsync(function(db)
	{
		let collection = db.collection('users');
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
				console.log("#Mongo. user Deleted.".yellow);
			}
			cbf(err, res.value);
		});
	});
}

exports.setUserPerm = function setUserPerm(nodeId, perms, cbf)
{
	database.GetConnAsync(function(db)
	{
		delete perms.nodeId;
		nodeId = new ObjectID (nodeId);
		let collection = db.collection('users');
		collection.findOneAndUpdate
		({
			'_id' : nodeId
		},
		{
			$set:
			{
				'permissions': perms
			}
		},
		function(err , user)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			else if(user == null)
			{
				console.log("#Mongo. Can not find user document.");
			}
			cbf(err, user);
		});
	});
}

exports.emailInf = function emailInf(email , cbf)
{
	database.GetConnAsync(function(db)
		{
		let collection = db.collection('users');
		collection.findOne( { "email" : email } , function(err , user)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			else if(user == null)
			{
				console.log("#Mongo. Can not find email");
			}
			cbf(err, user);
		});
	});
}
