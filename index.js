var Twit = require('twit');

var bot = new Twit({
  consumer_key:         process.env.MOVIEBOT_CONSUMER_KEY,
  consumer_secret:      process.env.MOVIEBOT_CONSUMER_SECRET,
  access_token:         process.env.MOVIEBOT_ACCESS_TOKEN,
  access_token_secret:  process.env.MOVIEBOT_ACCESS_TOKEN_SECRET,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests. 
});


//POST STATUS
// bot.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
//   console.log(data);
// });


// function getFollowers(){
//     bot.get('followers/ids', { screen_name: 'moviereview_bot' },  function (err, data, response) {
//     console.log(data);
//     });
// }

function getBotTimeline(bot){
    bot.get('statuses/home_timeline', {count: 5},  function (err, data, response) {
            if (err){
                console.log(err);
            } else {
                data.forEach(function(d){
                    console.log(d);
                    console.log('\n\n');
                });
            }
        });
}

// stream.on('tweet', function (tweet) {
//   console.log(tweet)
// })
// //}

// function favorite(arg1, arg2){

// }

//getBotTimeline(bot);

// bot.post('statuses/update', {in_reply_to_status_id: ['ahandvanish'], status: 'hello Hannah!' + number + ' ' + name}, function (err, data, response) {
//         console.log(reply + number);
//         socket.emit('reply', data.text);
//       });