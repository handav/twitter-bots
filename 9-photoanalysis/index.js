var Twit = require('twit');
var fs = require('fs');
var request = require('request');
var vision = require('@google-cloud/vision')({
    projectId: 'twitterbot',
    keyFilename: './keyfile.json'
});

var bot = new Twit({
    consumer_key: process.env.LEARNINGBOT_CONSUMER_KEY,
    consumer_secret: process.env.LEARNINGBOT_CONSUMER_SECRET,
    access_token: process.env.LEARNINGBOT_ACCESS_TOKEN,
    access_token_secret: process.env.LEARNINGBOT_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000
});

function downloadPhoto(url, replyToName, tweetId){
    var parameters = {
        url: url,
        encoding: 'binary'
    };
    request.get(parameters, function(err, response, body){
        var filename = 'photo'+Date.now()+'.jpg';
        fs.writeFile(filename, body, 'binary', function(err){
            console.log('Downloaded photo.');
            analyzePhoto(filename, replyToName, tweetId);
        });
    });
}

function analyzePhoto(filename, replyToName, tweetId){
    vision.detectFaces(filename, function(err, faces){
        var allEmotions = [];
        faces.forEach(function(face){
            extractFaceEmotions(face).forEach(function(emotion){
                if (allEmotions.indexOf(emotion) === -1){
                    allEmotions.push(emotion);
                }
            });
        });
        postStatus(allEmotions, replyToName, tweetId);
    });
}

function extractFaceEmotions(face){
    var emotions = ['joy', 'anger', 'sorrow', 'surprise'];
    return emotions.filter(function(emotion){
        return face[emotion];
    });
}

function postStatus(allEmotions, replyToName, tweetId){
    var status = formatStatus(allEmotions, replyToName);
    bot.post('statuses/update', {status: status, in_reply_to_status_id: tweetId}, function(err, data, response){
        if (err){
            console.log(err);
        }else{
            console.log('Bot has tweeted ' + status);
        }
    });
}

function formatStatus(allEmotions, replyToName){
    var reformatEmotions = {
        joy: 'happy',
        anger: 'angry',
        surprise: 'surprised',
        sorrow: 'sad'
    };
    var status = '@'+replyToName+' Looking ';
    if (allEmotions.length>0){
        allEmotions.forEach(function(emotion, i){
            if (i === 0){
                status = status + reformatEmotions[emotion];
            }else{
                status = status + ' and ' + reformatEmotions[emotion];
            }
        });
        status = status + '!';
    }else{
        status = status + 'neutral!';
    }
    return status;
}

var stream = bot.stream('statuses/filter', {track: '@bots_with_han'});

stream.on('connecting', function(response){
    console.log('connecting...');
});

stream.on('connected', function(response){
    console.log('connected!');
});

stream.on('error', function(err){
    console.log(err);
});

stream.on('tweet', function(tweet){
    if (tweet.entities.media){
        downloadPhoto(tweet.entities.media[0].media_url, tweet.user.screen_name, tweet.id_str);
    }
});




























