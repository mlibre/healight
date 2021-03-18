use health
db.createUser(
{
     user: 'mlibre',
     pwd: 'SpecialPassword',
     roles: [ {role: 'readWrite' , db:'health'} ]
});
