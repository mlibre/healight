"use strict";

var fs = require('fs');
let rmdir = require('rimraf');
let mkdirp = require('mkdirp');
let copy = require('recursive-copy');

function CreateFolder(address , name , cbf)
{
    if(address[address.length-1] != '/')
    {
        address = address + '/';            
    }

	fs.mkdir(consV.space.relPath + address + name , function(err)
	{
		if(err)
		{
			console.error( `#Space. Can not create folder. message: ${err}`.yellow );
		}
		else
		{
			console.log('#Space. Folder: %s%s%s Created.'.green, consV.space.relPath, address, name);
		}
		cbf(err, consV.codes.space.success);
	});
}

function copyFile(FolderAddress, name , data , cbf)
{
	fs.writeFile(consV.space.relPath + FolderAddress + name , data, function (err)
	{
		if(err)
		{
			console.error( new Error(`#Space. Can not save file. message: ${err}`.red) );
		}
		else
		{
			console.log("#Space. file saved.".yellow );
		}
		cbf(err, consV.codes.space.success);
	});
}

function deleteFolder(FolderAddress, name, cbf)
{
	rmdir(consV.space.relPath + FolderAddress + name, function ()
	{
		cbf();
	});
}

function CheckFolder(FolderAddress , FolderName)
{
	if(FolderAddress[FolderAddress.length-1] != '/')
    {
        FolderAddress = FolderAddress + '/';            
    }
	if( fs.existsSync(consV.space.relPath + FolderAddress + FolderName) )
	{
		return true;
	}
	else
	{
		return false;
	}
}

function directoryList(FolderAddress)
{
	if(FolderAddress[FolderAddress.length-1] != '/')
	{
		FolderAddress += '/';
	}
	return fs.readdirSync(consV.space.relPath + FolderAddress);
}

exports.createFileSync = function createFileSync(fullFileAddress, data)
{
	try
	{
		fs.writeFileSync(fullFileAddress , data);
		// console.log("#createFileSync. %s created.".yellow, fullFileAddress);
	}
	catch (error)
	{
		console.log(error);
		if(err.code == 'ENOENT')
		{
			console.error( new Error(`#createFileSync. Can not save file: ${err}`.red) );
		}
		let sliced_address = fullFileAddress.slice(0, fullFileAddress.lastIndexOf('/'));
		mkdirp.sync(sliced_address);
		createFile(fullFileAddress, data);
	}
}

exports.createFile = function createFile(fullFileAddress, data)
{
	fs.writeFile(fullFileAddress , data, function (err)
	{
		if(err)
		{
			if(err.code == 'ENOENT')
			{
				console.error( new Error(`#createFile. Can not save file. message: ${err}`.red) );
			}
			let sliced_address = fullFileAddress.slice(0, fullFileAddress.lastIndexOf('/'));
			mkdirp(sliced_address, (err) =>
			{
				createFile(fullFileAddress, data)
			});
		}
		else
		{
			console.log("#createFile. %s created.".yellow, fullFileAddress);
		}
	});
}

exports.directoryListRecursive = function DLR(dir, fileList)
{
	if(dir[dir.length-1] != '/')
	{
		dir += '/';
	}
	var files = fs.readdirSync(dir);
	fileList = fileList || [];
	files.forEach(function (file)
	{
		if(fs.statSync(dir + file).isDirectory())
		{
			fileList = DLR(dir + file + '/', fileList);
		}
		else
		{
			fileList.push(dir+file);
		}
	});
	return fileList;
}

exports.CreateFolder = CreateFolder;
exports.copyFile = copyFile;
exports.deleteFolder = deleteFolder;
exports.CheckFolder = CheckFolder;
exports.directoryList = directoryList;
