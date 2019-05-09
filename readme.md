# Healight, encyclopedia generator platform
Healight is an powerful encyclopedia generator platform. Healight creates ready-to-use encyclopedia website in a minute!
The project is written in Nodejs & Mongodb.
It is free for non-commercial use.

## Table of content
+ [Requirements](#requirements)
+ [Installation](#installation)
+ [Important Pages](#important-pages)
+ [Todo](#todo)

## Successful examples
+ Offline

## Requirements
+ Linux
+ Nodejs 9 or higher

## Installation
1. `git clone https://github.com/mlibre/healight.git`
2. `cd healight`
3. `npm install`
4. `sudo npm install nodemon stylus colors -g`
5. Rename `UsPs.js.example` to `UsPs.js`. and fill the fields.
6. Create database: Read `Initiate DataBase` section from [database setup](https://github.com/mlibre/healight/blob/master/related/projectStuff/setup/database.md)
7. Run services:
* Start MongoDB Service: `npm run sm`
* Start Redis Service **by systemctl**: `npm run sr` or **manually**: `npm run srm`
* Start Stylus Service: `npm run ss`
8. Start App via **nodemon**: `npm run ds` or just **node**: `node health.js` 

## Important Pages
+ http://localhost:3000/en/panel/home
+ http://localhost:3000/en/signIn

## Todo
+ Complete English Version
