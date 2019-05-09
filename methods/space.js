"use strict";

var fs = require('fs');
let rmdir = require('rimraf');

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

exports.CreateFolder = CreateFolder;
exports.copyFile = copyFile;
exports.deleteFolder = deleteFolder;
exports.CheckFolder = CheckFolder;
exports.directoryList = directoryList;
