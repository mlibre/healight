<div align="center">
	<img alt="Healgiht Logo" src="related/projectStuff/Logo/Healight_Logo_Horizontal.png">
</div>

# Healight, free Website, Blog, Wiki platform
Healight is a powerful, **opensource** and **free** **CMS** platfrom. Healight creates or generate a full ready-to-use documentation website in a minute!
You can also use it as a CMS and create a Blog, Website, or ...
The project is written in Nodejs & MongoDB. Read [Healight Story](#healight-story) for the whole story and movement.

## Table of content
+ [Demo](#successful-examples)
+ [Features](#features)
+ [Requirements](#requirements)
+ [Installation](#installation)
+ [Links](#links)
+ [License](#license)
+ [Todo](#todo)
+ [Healight Story](#healight-story)
+ [Donate](#donate)

## Successful examples
+ Demo - Static HTML Copy:
	* https://mlibre.github.io/healight/

## Features
* Free & Opensource
* CMS - Content management system
* Blog Generator
* Website Generator
* Built-in Enhanced TinyMCE
* Sitemap Generator
* Multi-language support
* Material-Modern based design
* Responsive
* Fast & Secure
* Be able to make a static version of the site 
* Automatic Built-in Maintaining
* Automatic DB Backup script
* Fully Customizable
* Pre-Desgined Advertisments places


## Requirements
+ Linux
+ Nodejs 12+
+ MongoDB
+ Redis

## Installation
0. `Install MongoDB & Redis in your Linux`
1. `git clone https://github.com/mlibre/healight.git`
2. `cd healight`
3. `npm install`
4. `sudo npm install nodemon stylus colors -g`
5. `mv UsPs.js.example UsPs.js`. Fill the fields.
6. `npm run createDB`. to create the database from scratch.
	* It will delete/remake **database** folder.
	* It Will creates and initiate the database 
	* Read [Database Setup](https://github.com/mlibre/healight/blob/master/related/projectStuff/server%20%26%20site/database.md) for more info. like restoring a backup or ...

## Running - easy way :)
* `npm start`
* It basically **kill** services like **MongoDB** and **Redis** and then, will **run** them again one by one, in the end, it will start the app by **nodemon**.

## Running manually
1. Start MongoDB Service: `npm run sm`
2. Start Redis Service
	* **by systemctl**: `npm run sr`
	* or **manually**: `npm run srm`
3. Start the app: `node health.js`.
	* Or you may also use configured **nodemon**: `nodemon`
	* Or **pm2**: `pm2 start health.js`
3. Start Stylus service: `npm run ss`. # For developments purpose

## Shutting down
3. Shutdown the App and everything else :): `npm run ea`

## Putting in the startup
* `sudo systemctl enable redis-server`. `sudo systemctl restart redis-server`. Will put redis in startup.
* `pm2 startup`. Will put **pm2** in startup.
* Add your user to sudoers file, LAST LINE. like: `mlibre ALL=(ALL) NOPASSWD:ALL`
* `pm2 start --no-autorestart ./related/projectStuff/scripts/start-mongodb-servcie.sh`
* `pm2 start health.js`
* `pm2 save`

## Default's Info
* Website/panel: username: & password is the ones you have set in `UsPs.js`
* MongoDB Admin user: **admin**. Password: **SpecialPassword**
* MongoDB Collection: **health**
* MongoDB project user: **health**. password: **SpecialPassword**
* Change The default language in `constantVars.js`. the line `site.langs.default`.

## Configuration & Customization
* All the platform configurations variables located in `constantVars.js`
* Like collection name (WiKi Titles)
* Languages, Emails, Numbers, Social media and ...
* You should edit this file to create your own customized WiKi

## Static or Html Website Generator
Run the following command to make a copy of your entire site in HTML, then you can put it on any static hosts easily, you won't need node js, MongoDB or... BUT of course, some functions like signing up/in won't work anymore.
* `npm run clone`

## License
* Free for non-commercial use.
* NOT FREE FOR ANY KIND OF COMMERCIAL USAGE OR ANY KIND RELATED EARNING
* The `Persian` font that is used in the project is licensed for free usages. http://fontiran.com.

## Thanks to the kind contributors
* [chimzycash](https://github.com/chimzycash) - Logo Designer

## Donate
My Bitcoin Address:
> 3JfNjydkEgKGjsnrU1SoCCAv1q2yTuCoDY
