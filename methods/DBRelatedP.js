"use strict";

let database = require(consV.methods.db.main);
let ObjectID = require('mongodb').ObjectID;
let async = require('async');

function telNonArts(cbf)
{
	database.GetConnAsync(function(db)
	{
		let collection = db.collection(consV.database.social_media.CollName);

		collection.findOne
		({
			"_id": "non_arts"
		},
		function(err , result)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			cbf(err, result);
		});
	});
}

function telNonArtDel(nodeId, cbf)
{
	database.GetConnAsync(function(db)
	{
		let collection = db.collection(consV.database.social_media.CollName);
		collection.findOneAndUpdate
		({
			"_id": "non_arts"
		},
		{
			$pull:
			{
				"list": nodeId
			}
		},
		function(err , result)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			cbf(err, result);
		});
	});
}

function SMNonArtAdd(nodeId, cbf)
{
	if(nodeId == "" || nodeId == null || typeof nodeId == "undefined")
	{
		return cbf(true);
	}	
	database.GetConnAsync(function(db)
	{
		let collection = db.collection(consV.database.social_media.CollName);
		collection.findOneAndUpdate
		({
			"_id": "non_arts"
		},
		{
			$addToSet:
			{
				"list": nodeId
			}
		},
		function(err , result)
		{
			if(err)
			{
				console.error( new Error(`#Mongo #FIXME. #Error. message: ${err}`.red) );
			}
			cbf(err, result);
		});
	});
}

exports.telNonArts = telNonArts;
exports.telNonArtDel = telNonArtDel;
exports.SMNonArtAdd = SMNonArtAdd;
