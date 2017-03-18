var Twit = require('twit');

var bot = new Twit({
    consumer_key: process.env.SIMPLE_CONSUMER_KEY,
    consumer_secret: process.env.SIMPLE_CONSUMER_SECRET,
    access_token: process.env.SIMPLE_ACCESS_TOKEN,
    access_token_secret: process.env.SIMPLE_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000
});

function littleTweet(){
    bot.post('statuses/update', {status: Date.now()}, function(err, data, response){
        if (err){
            console.log(err);
        }else{
            console.log('Bot posted');
        }
    });
}

setInterval(function(){ 
  littleTweet(); 
}, 60*1000);