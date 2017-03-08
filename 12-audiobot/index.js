var Twit = require('twit');
var fs = require('fs');
var rita = require('rita');
var midi = require('jsmidgen');
var ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

var bot = new Twit({
    consumer_key: process.env.LEARNINGBOT_CONSUMER_KEY,
    consumer_secret: process.env.LEARNINGBOT_CONSUMER_SECRET,
    access_token: process.env.LEARNINGBOT_ACCESS_TOKEN,
    access_token_secret: process.env.LEARNINGBOT_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000
});

function hasNoStopwords(token){
    var stopwords = ['@', 'RT', 'http'];
    return stopwords.every(function(sw){
        return !token.includes(sw);
    });
}

function cleanText(text){
    return text.split(' ')
        .filter(hasNoStopwords)
        .join(' ')
        .trim();
}

function getPartsOfSpeech(text){
    return rita.RiTa.getPosTags(text);
}

function isNotPunctuation(tag){
    return !rita.RiTa.isPunctuation();
}

function compose(taggedTweet, track){
    var notes = taggedTweet.map(function(tag, i){
        if (tag.includes('nn') || tag.includes('i')){
            return 'e4';
        }
        if (tag.includes('vb')){
            return 'g4';
        }
        if (i === taggedTweet.length -1){
            return 'c3';
        }
        return 'c4';
    });
    notes.forEach(function(note){
        track.addNote(0, note, 128);
    });
    return track;
}

function createMidi(tweet, midiFn){
    var file = new midi.File();
    var track = new midi.Track();
    file.addTrack(track);
    var taggedTweet = getPartsOfSpeech(cleanText(tweet.text));
    taggedTweet = taggedTweet.filter(isNotPunctuation);
    compose(taggedTweet, track);
    fs.writeFileSync(midiFn, file.toBytes(), 'binary');
}

function createVideo(imgFn, midiFn, vidFn, cb){
    ffmpeg()
        .on('end', function(){
            cb(null);
        })
        .on('error', function(err){
            cb(err);
        })
        .input(imgFn)
        .inputFPS(1/6)
        .input(midiFn)
        .output(vidFn)
        .outputFPS(30)
        .run();
}

function createMedia(tweet, imgFn, midiFn, vidFn, cb){
    createMidi(tweet, midiFn);
    createVideo(imgFn, midiFn, vidFn, cb);
}

function postStatus(params){
    bot.post('statuses/update', params, function(err, data, response){
        if (err){
            console.log(err);
        }else{
            console.log('Bot posted!');
        }
    });
}

function uploadMedia(tweet, vidFn){
    var filePath = __dirname + '/' + vidFn;
    bot.postMediaChunked({file_path: filePath}, function(err, data, response){
        if (err){
            console.log(err);
        }else{
            console.log(data);
            tweet.text = tweet.text.split('@bots_with_han').join(' ').trim();
            var params = {
                status: '@'+tweet.user.screen_name+' '+tweet.text,
                in_reply_to_ID: tweet.in_reply_to_ID,
                media_ids: data.media_id_string
            }
            postStatus(params);
        }
    });
}

var imgFn = 'black.jpg';
var midiFn = 'output.mid';
var vidFn = 'output.mp4';

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
    if (tweet.text.length > 0){
        createMedia(tweet, imgFn, midiFn, vidFn, function(err){
            if (err){
                console.log(err);
            }else{
                console.log('Video created!');
                uploadMedia(tweet, vidFn);
            }
        });
    }
});















