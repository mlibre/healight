#!/bin/bash
node health.js 3001 true 1>/dev/null &
sleep 8;
rm -r docs;
wget -mkEpnp "localhost:3001" 2>/dev/null;
# echo "10 sec sleep"
# sleep 10;
echo "clonnig is finished";
mv localhost:3001 docs;
alias cp='cp';
/bin/cp -rf space/stuff/* docs/;
/bin/cp -r space/stuff/. docs/;
echo "*********** pushing new changes ***********"
git add --all;
git commit -m "auto commit";
git push origin master -f
sleep 5;
# git push -d origin gh-pages;
# git branch -D gh-pages;
echo "checking out gh-pages"
git checkout gh-pages;
rm -r *;
git merge -X theirs master
# git checkout gh-pages;
sleep 20;
cp -rf docs/ .;
cp -rf docs/. .;
cp -rf docs/* .;
rm -rf docs;
rm -rf methods;
rm -rf public;
rm -rf routes;
rm -rf constantVars.js;
rm -rf health.js;
rm -rf related;
rm -rf space;
rm -rf package.json;
rm -rf UsPs.js.example;
git add --all;
git commit -m "gh-pages auto commit";
git push origin gh-pages -f
sleep 2
kill %1
echo "The site is located in docs folder, also gh-pages updated"
echo "But u need to set github pages to master and again to gh-pages!"
echo "Checking master out"
# sleep 10;
# git checkout master;