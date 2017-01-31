var Twit = require('twit');
var fs = require('fs');
var natural = require('natural');
var request = require('request');

//BOT VARIABLES
var bot = new Twit({
  consumer_key:         process.env.MOVIEBOT_CONSUMER_KEY,
  consumer_secret:      process.env.MOVIEBOT_CONSUMER_SECRET,
  access_token:         process.env.MOVIEBOT_ACCESS_TOKEN,
  access_token_secret:  process.env.MOVIEBOT_ACCESS_TOKEN_SECRET,
  timeout_ms:           60*1000,  // HTTP request timeout, optional 
});

//PARTS OF SPEECH TAGGER
var tokenizer = new natural.WordTokenizer();
var Tagger = natural.BrillPOSTagger;
var baseFolder = "./node_modules/natural/lib/natural/brill_pos_tagger";
var rules = baseFolder + "/data/English/tr_from_posjs.txt";
var lexicon = baseFolder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';

//POST STATUS
function postTweet(tweetString){
  bot.post('statuses/update', { status: tweetString }, function(err, data, response) {
      if (err){
        console.log(err);
      } else {
        console.log(data.text + " has been tweeted.");
      }
  });
}

//GET HOME TIMELINE
function getBotTimeline(){
    bot.get('statuses/home_timeline', {count: 5},  function (err, data, response) {
            if (err){
                console.log(err);
            } else {
                data.forEach(function(d){
                    console.log(d.text);
                    console.log(d.id_str);
                });
            }
        });
}

//RETWEET
function retweet(idString){
    bot.post('statuses/retweet/:id', { id: idString }, function (err, data, response) {
          if (err){
              console.log(err);
          } else {
              data.forEach(function(d){
                  console.log(d.text + " has been retweeted.");
              });
          }
      });
}

//UNRETWEET
function unretweet(idString){
    bot.post('statuses/unretweet/:id', { id: idString }, function (err, data, response) {
          if (err){
              console.log(err);
          } else {
              data.forEach(function(d){
                  console.log(d.text + " has been unretweeted.");
              });
          }
      });
}

//DELETE TWEET
function deleteTweet(idString){
    bot.post('statuses/destroy/:id', { id: idString }, function (err, data, response) {
      if (err){
        console.log(err);
      } else {
        console.log(data.text + " has been deleted.");
      }
    });
}

//LIKE TWEET
function likeTweet(idString){
  bot.post('favorites/create', { id: idString }, function (err, data, response){
    if (err){
      console.log(err);
    } else {
      console.log(data.text + " has been liked.");
    }
  });
}

//UNLIKE TWEET
function unlikeTweet(idString){
  bot.post('favorites/destroy', { id: idString }, function (err, data, response){
    if (err){
      console.log(err);
    } else {
      console.log(data.text + " has been unliked.");
    }
  });
}

//GET RANDOM REVIEW
function getRandomReview(){
  request.get({
    url: "https://api.nytimes.com/svc/movies/v2/reviews/search.json",
    qs: {
      'api-key': process.env.NYTIMES_KEY
    },
  }, function(err, response, body) {
    results = JSON.parse(body).results;
    console.log(results.length + " results total.");
    var randomReview = Math.floor((Math.random() * results.length) + 1);
    var review = results[randomReview];
    summarizeAndTweet(review.summary_short, review.link.url);
  });
}

//SUMMARIZE AND TWEET REVIEW
function summarizeAndTweet(text, url){
  text = tokenizer.tokenize(text);
  var tagger = new Tagger(lexicon, rules, defaultCategory, function(err){
    if (err){
        console.log(err);
    } else {
        var taggedWords = tagger.tag(text);
        var summary = [];
        taggedWords.forEach(function(tag){
          if (tag[1].includes("NN")){
            if (tag[0].length > 1){
              summary.push(tag[0]);
            }
          }
        });
        summary = summary.join(" ");
        summary = summary + ": " + url;
        postTweet(summary);
    }
  });
}

//TWEET EVERY TWO HOURS
setInterval(function(){ 
  getRandomReview(); 
}, 2*60*60*1000);

