#!/bin/bash
killall mongod &> /dev/null
rm /tmp/mongodb-*.sock &> /dev/null
mkdir database
cd database
mongod --auth --port 27017 --dbpath=. &> /dev/null &
exit 0
