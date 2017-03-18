var Twit = require('twit');
var rita = require('rita');
var midi = require('jsmidgen');
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var ffmpegPath = require('@ffmpeg-installer/ffmpeg');
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath.path);

var bot = new Twit({
    consumer_key: process.env.LEARNINGBOT_CONSUMER_KEY,
    consumer_secret: process.env.LEARNINGBOT_CONSUMER_SECRET,
    access_token: process.env.LEARNINGBOT_ACCESS_TOKEN,
    access_token_secret: process.env.LEARNINGBOT_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000
});

var bot_username = '@bots_with_han';

var imgFn = path.join(process.cwd(), 'black.jpg');
var midiFn = path.join(process.cwd(), 'output.mid');
var wavFn = path.join(process.cwd(), 'output.wav');
var vidFn = path.join(process.cwd(), 'output.mp4');

function hasNoStopwords(token){
    var stopwords = ['@', 'RT', 'http'];
    return stopwords.every(function(sw){
        return !token.includes(sw);
    });
}

function isNotPunctuation(token){
    return !rita.RiTa.isPunctuation(token);
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

function compose(taggedTweet, track){
    var notes = taggedTweet.map(function(tag){
        if (tag.includes('nn') || tag.includes('i')){
            return 'e4';
        }
        if (tag.includes('vb')){
            return 'g4';
        }
        return 'c4';
    });
    notes.forEach(function(note){
        track.addNote(0, note, 128);
    });
    return track;
}

function createMidi(tweet, midiFn, cb){
    var file = new midi.File();
    var track = new midi.Track();
    file.addTrack(track);
    var cleanedText = rita.RiTa
        .tokenize(cleanText(tweet.text))
        .filter(isNotPunctuation)
        .join(' ');
    var taggedTweet = getPartsOfSpeech(cleanedText);
    compose(taggedTweet, track);
    fs.writeFile(midiFn, file.toBytes(), {encoding: 'binary'}, cb);
}

function convertMidiToWav(midiFn, wavFn, cb){
    var command = 'timidity --output-24bit -A120 '+midiFn + ' -Ow -o ' + wavFn;
    child_process.exec(command, {}, function(err, stdout, stderr){
        if (err){
            cb(err);
        }else{
            cb(null);
        }
    });    
}


function createVideo(imgFn, wavFn, vidFn, cb){
    ffmpeg()
        .on('end', function(){
            cb(null);
        })
        .on('error', function(err, stdout, stderr){
            cb(err);
        })
        .input(imgFn)
        .inputFPS(1/6)
        .input(wavFn)
        .output(vidFn)
        .outputFPS(30)
        .run();
}






function createMedia(tweet, imgFn, midiFn, wavFn, vidFn, cb){
    createMidi(tweet, midiFn, function(err, result){
        if (err){
            console.log(err);
        }else{
            convertMidiToWav(midiFn, wavFn, function(err){
                if (err){
                    console.log(err);
                }else{
                    console.log('Midi converted!');
                    createVideo(imgFn, wavFn, vidFn, cb);
                }
            })
        }
    });
}

function deleteWav(wavFn, cb){
    var command = 'rm '+ wavFn;
    child_process.exec(command, {}, function(err, stdout, stderr){
        if (err){
            cb(err);
        }else{
            cb(null);
        }
    });
}

function postStatus(params){
    bot.post('statuses/update', params, function(err, data, response){
        if (err){
            console.log(err);
        }else{
            console.log('Bot has posted!');
        }
    });
}


function uploadMedia(tweet, vidFn){
    bot.postMediaChunked({file_path: vidFn}, function(err, data, response){
        if (err){
            console.log(err);
        }else{
            var stat = tweet.text.split(bot_username)
                .join(' ')
                .trim();
            var params = {
                status: '@'+tweet.user.screen_name+' '+stat,
                in_reply_to_status_id: tweet.id_str,
                media_ids: data.media_id_string
            }
            postStatus(params);
        }
    });
}


var stream = bot.stream('statuses/filter', {track: bot_username});

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
        createMedia(tweet, imgFn, midiFn, wavFn, vidFn, function(err){
            if (err){
                console.log(err);
            }else{
                console.log('Media created!');
                deleteWav(wavFn, function(err){
                    if (err){
                        console.log(err);
                    }else{
                        uploadMedia(tweet, vidFn);
                    }
                });
            }
        });
    }
});



















