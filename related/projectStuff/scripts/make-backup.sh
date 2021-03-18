fname="DBbak-$(date +"%Y-%m-%d-%T")"
fpath="./related/projectStuff/backups/db"
mkdir $fpath/$fname
mongodump --host localhost:27017 -d health -u mlibre -p "SpecialPassword" -o $fpath/$fname