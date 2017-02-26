var Twit = require('twit');
var fs = require('fs');
var csvparse = require('csv-parse');
var rita = require('rita');
var inputText = '';

var bot = new Twit({
    consumer_key: process.env.LEARNINGBOT_CONSUMER_KEY,
    consumer_secret: process.env.LEARNINGBOT_CONSUMER_SECRET,
    access_token: process.env.LEARNINGBOT_ACCESS_TOKEN,
    access_token_secret: process.env.LEARNINGBOT_ACCESS_TOKEN_SECRET,
    timeout_ms: 10 * 1000
});

var filePath = './twitter_archive/tweets.csv';

var tweetData = fs.createReadStream(filePath)
    .pipe(csvparse({delimiter: ','}))
    .on('data', function(row){
        inputText = inputText + ' ' + cleanText(row[5]);
    })
    .on('end', function(){
        var markov = new rita.RiMarkov(2);
        markov.loadText(inputText);
        var sentence = markov.generateSentences(1);
        bot.post('statuses/update', {status: sentence}, function(err, data, response){
            if (err){
                console.log(err);
            }else{
                console.log('Status tweeted.');
            }
        });
    });

function hasNoStopwords(token){
    var stopwords = ['@', 'http', 'RT'];
    return stopwords.every(function(sw){
        return !token.includes(sw);
    });
}

function cleanText(text){
    return rita.RiTa.tokenize(text, ' ')
        .filter(hasNoStopwords)
        .join(' ')
        .trim();
}