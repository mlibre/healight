`sudo systemctl stop redis`;
wait
`sudo systemctl stop redis-server.service`;
wait
`sudo killall mongod`;
wait
`sudo killall stylus`;
wait
`sudo killall redis-server`;
`sudo killall redis`;
wait
`pm2 del all`;
wait
`sudo killall node`;
wait
echo "All services and node/app processes ended"
wait
`sudo killall npm`;