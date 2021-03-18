use admin
db.createUser(
{
	user: 'admin',
	pwd: 'SpecialPassword',
	roles: [ {role: 'root' , db:'admin'},
	{role: 'userAdminAnyDatabase' , db:'admin'} ]
});