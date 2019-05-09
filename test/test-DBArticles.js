"use strict";

let util = require('util');
var appLogFile = require('fs').createWriteStream('/var/log/appLogFile.log');
console.log = console.info = function (c)
{
	if(c && c.indexOf('#') < 0)
	{
		var out = util.format.apply(util, arguments);
		process.stdout.write(out + '\n');
	}
	else
	{
		var out = util.format.apply(util, arguments);
		appLogFile.write(out + '\n');
	}
};
console.error = function (){};

global.consV = require('../constantVars');

let chai =  require('chai');
chai.use(require('chai-shallow-deep-equal'));
let expect = require('chai').expect;

var colors = require('colors'); // Probablly Just For Developing
var database = require(consV.methods.db.main);
var DBArticles = require(consV.methods.db.articles);
var ObjectID = require('mongodb').ObjectID;

/*****************************************************************************/
/************************ Test Codes starts form here ************************/
database.db_connect();

var MT_sample_object =
{
	_id: new ObjectID('58d2714fe03bc23919462ead'),
	spaceFolderName: 'MT',
	URLName: null,
	parent: null,
	treeTitle: { fa: 'MT_tree_title' },
	content: { fa: 'MT_con' },
	tags: { fa: [ 'MT_tag1', 'MT_tag2' ] },
	date: new Date(),
	createdBy: new ObjectID('587e4bc26e4949483846ec50'),
	enc: consV.database.enc.medicine.CollName
};

describe('create_edit_draft_art function', function ()
{
	it('create/update MT article draft' , function (done)
	{
		DBArticles.create_edit_draft_art('MT', 'MT_tree_title', 'MT_con', ['MT_tag1','MT_tag2'], 'fa',
		consV.database.enc.medicine.CollName, '587e4bc26e4949483846ec50', function (err, res)
		{
			MT_sample_object.date = res.date;
			expect(err).to.equal(null);
			expect(res).to.deep.equal(MT_sample_object);
			done();
		});
	});
});

describe('edit_art_by_spaceFName function', function ()
{
	it('edit MT article' , function (done)
	{
		DBArticles.edit_art_by_spaceFName('MT', 'MT_tree_title', 'MT_con', ['MT_tag1','MT_tag2'], 'fa',
		consV.database.enc.medicine.CollName, '587e4bc26e4949483846ec50', function (err, res)
		{
			MT_sample_object.date = res.date;
			expect(err).to.equal(null);
			expect(res).to.deep.equal(MT_sample_object);
			done();
		});
	});
	it('db error. not able to find art. wrong spacefolder name' , function (done)
	{
		DBArticles.edit_art_by_spaceFName('MT_wrong_name', 'MT_tree_title', 'MT_con', ['MT_tag1','MT_tag2'], 'fa',
		consV.database.enc.medicine.CollName, '587e4bc26e4949483846ec50', function (err, res)
		{
			expect(err).to.equal(true);
			done();
		});
	});
});