var Twit = require('twit');
var request = require('request');
var fs = require('fs');

var bot = new Twit({
    consumer_key: process.env.LEARNINGBOT_CONSUMER_KEY,
    consumer_secret: process.env.LEARNINGBOT_CONSUMER_SECRET,
    access_token: process.env.LEARNINGBOT_ACCESS_TOKEN,
    access_token_secret: process.env.LEARNINGBOT_ACCESS_TOKEN_SECRET,
    timeout_ms: 10 * 1000
});


function getPhoto(){
    var parameters = {
        url: 'https://api.nasa.gov/planetary/apod',
        qs: {
            api_key: process.env.NASA_KEY
        },
        encoding: 'binary'
    };
    request.get(parameters, function(err, response, body){
        body = JSON.parse(body);
        saveFile(body, 'nasa.jpg');
    });
}


function saveFile(body, fileName){
    var file = fs.createWriteStream(fileName);
    request(body).pipe(file).on('close', function(err){
        if (err){
            console.log(err);
        }else{
            console.log('Media saved.');
            var descriptionText = body.title;
            uploadMedia(descriptionText, fileName);
        }
    })
}


function uploadMedia(descriptionText, fileName){
    var filePath = __dirname + '/' + fileName;
    bot.postMediaChunked({file_path: filePath}, function(err, data, response){
        if (err){
            console.log(err);
        }else{
            console.log(data);
            var params = {
                status: descriptionText,
                media_ids: data.media_id_string
            };
            postStatus(params);
        }
    });
}


function postStatus(params){
    bot.post('statuses/update', params, function(err, data, response){
        if (err){
            console.log(err);
        }else{
            console.log('Status posted.');
        }
    });
}


uploadMedia('Video from NASA', 'nasa_video.mp4');
