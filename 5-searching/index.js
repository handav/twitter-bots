var Twit = require('twit');

var bot = new Twit({
    consumer_key: process.env.LEARNINGBOT_CONSUMER_KEY,
    consumer_secret: process.env.LEARNINGBOT_CONSUMER_SECRET,
    access_token: process.env.LEARNINGBOT_ACCESS_TOKEN,
    access_token_secret: process.env.LEARNINGBOT_ACCESS_TOKEN_SECRET,
    timeout_ms: 60*1000 
});

bot.get('search/tweets', {q: 'dance', lang: 'es', count: 5}, function(err, data, response){
    if (err){
        console.log(err);
    }else{
        data.statuses.forEach(function(s){
            console.log(s.text);
            console.log(s.user.screen_name);
            console.log('\n');
        });
    }
});