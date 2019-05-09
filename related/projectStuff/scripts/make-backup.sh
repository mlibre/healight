fname="DBbak-$(date +"%Y-%m-%d-%T")"
fpath="/media/mlibre/9d0190e1-94a3-4f47-9e75-724fee018a00/projects/healight/healight.green/related/projectStuff/backups/db"
wait
mkdir $fpath/$fname
wait
mongodump --host localhost:27017 -d health -u mlibre -p "SpecialPassword" -o $fpath/$fname
