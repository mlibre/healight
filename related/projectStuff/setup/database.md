Initiate Database
=========================

```bash
mkdir database
cd database
mongod --dbpath . &> /dev/null &
mongo

use admin
db.createUser(
{
	user: 'admin',
	pwd: 'SpecialPassword',
	roles: [ {role: 'root' , db:'admin'},
			 {role: 'userAdminAnyDatabase' , db:'admin'} ]
});
```
### Exit the shell and kill the proccess:
```bash
# perss: Ctrl + D;
fg # enter fg
# press: Ctrl + C;
```
### Now lets create a user
```bash
mongod --auth --port 27017 --dbpath=. &> /dev/null &
mongo --port 27017 -u "admin" -p "SpecialPassword" --authenticationDatabase "admin"

use health
db.createUser(
{
	user: 'mlibre',
	pwd: 'SpecialPassword',
	roles: [ {role: 'readWrite' , db:'health'} ]
});
```

### Exit the shell, kill the proccess and back to the main directory:
```bash
# perss: Ctrl + D;
fg # enter fg
# press: Ctrl + C;
cd ..
```
Done!

indexing Database
==========================
indexing:
```bash
db.encyclopedia_medicine.createIndex( {parent: 1} )
db.users.createIndex( {username: 1} )
db.users.createIndex( {email: 1} )
```

Running Database
=========================
```bash
mongod --auth --port 27017 --dbpath=. &> /dev/null &
mongo --port 27017 -u "mlibre" -p "SpecialPassword" --authenticationDatabase "health"
```


Backup
==========================
```bash
mongodump --host localhost:27017 -d health -u mlibre -o projectStuff/db_dump/
mongodump --host localhost:27017 -d health -u mlibre -p password -o projectStuff/db_dump/
```

Restore
==========================
1. Delete collections
2. Run These Comands
```bash
mongorestore -v -h localhost:27017 -d health -u mlibre -p "SpecialPassword" related/projectStuff/backups/db/DBbak-2018-09-02-01:00:01/health
```

Delete collections
==========================
```bash
mongo --port 27017 -u "mlibre" -p "SpecialPassword" --authenticationDatabase "health"
use health
show collections
db.encyclopedia_medicine.drop()
db.encyclopedia_fruits.drop()
db.encyclopedia_plants.drop()
db.encyclopedia_drinks.drop();
db.encyclopedia_edibles.drop()
db.encyclopedia_sickness.drop()
db.encyclopedia_lifestyle.drop()
db.encyclopedia_genetic.drop()
db.encyclopedia_other.drop()
db.users.drop()
db.site.drop()
db.draft.drop()
db.social_media.drop()
```


Restore, Upload To Mlab
==========================
```bash
mongorestore -v -h localhost:27017 -d health -u mlibre -p "SpecialPassword" health/projectStuff/db_backups/DBbak-17-08-25-06\:23\:54/health/
mongorestore -v -h ds157298.mlab.com:57298 -d health -u mlibre -p password projectStuff/db_dump/health/
```