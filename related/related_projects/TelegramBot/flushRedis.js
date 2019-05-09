let redis = require('redis');
let client = redis.createClient();
client.select(3);
client.on('error' , function (err)
{
	console.error(new Error(`#Error. message: ${err}`.red));
});
client.flushall();
client.quit();