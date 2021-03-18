#!/bin/bash

sudo rm -r database
mkdir database
sudo chown $USER database/
sudo chmod a+rw database/
cd database
rm /tmp/mongodb-*.sock
mongod --dbpath . &> /dev/null &
sleep 5
mongo < ../related/projectStuff/scripts/createDB/init.js
sleep 6
killall mongod
rm /tmp/mongodb-*.sock
sleep 6
mongod --auth --port 27017 --dbpath=. &> /dev/null &
sleep 6
mongo --port 27017 -u "admin" -p "SpecialPassword" --authenticationDatabase "admin" < ../related/projectStuff/scripts/createDB/user.js
sleep 7
killall mongod
