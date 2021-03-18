let space = require( consV.methods.space );
let ejs = require('ejs');

/************************* JS Core Changes *************************/

Array.prototype.diff = function (a)
{
	return this.filter(function (i)
	{
		return a.indexOf(i) < 0;
	});
}

Array.prototype.remove = function (elem)
{
	let index = this.findIndex(el => el === elem);
	while( index != -1)
	{
		this.splice(index , 1);
		index = this.findIndex(el => el === elem);
	}
	return this;
}

/************************* EJS Helper Functions *************************/

exports.ejsToJsFolder = function ejsToJsFolder(srcFolderPath , fileRep1, fileRep2, ext)
{
	let list = space.directoryListRecursive(srcFolderPath);
	list.forEach(function (file)
	{
		if(ext == undefined || (ext != undefined && file.indexOf('.ejs') != -1) )
		{
			ejs.renderFile(file , function (err, str)
			{
				if(err)
				{
					console.error("#ejsToJsFolder. Error." , err);
				}
				else
				{
					space.createFileSync(file.replace(fileRep1 , fileRep2) , str);
				}
			});
		}
	});
}

exports.ejsToJsFile = function ejsToJsFile(srcFilePath , desFilePath, data={})
{
	ejs.renderFile(srcFilePath, data, function (err, str)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			space.createFileSync(desFilePath , str);
		}
	});
}

exports.ejsToHtml = function ejsToHtml(srcFilePath , desFilePath, data={})
{
	ejs.renderFile(srcFilePath, data, function (err, str)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			str = str.replace(/href="\//g, 'href="./');
			str = str.replace(/src="\//g, 'src="./');
			space.createFileSync(desFilePath , str);
		}
	});
}