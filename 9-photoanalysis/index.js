var Twit = require("twit");
var fs = require("fs");
var request = require("request");
var vision = require("@google-cloud/vision")({
  projectId: "twitterbot",
  keyFilename: "./keyfile.json"
});

var bot = new Twit({
  consumer_key: process.env.LEARNINGBOT_CONSUMER_KEY,
  consumer_secret: process.env.LEARNINGBOT_CONSUMER_SECRET,
  access_token: process.env.LEARNINGBOT_ACCESS_TOKEN,
  access_token_secret: process.env.LEARNINGBOT_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
});

function downloadPhoto(url, replyToName, tweetId) {
  var paramaters = {
    url: url,
    encoding: "binary"
  };
  request.get(paramaters, function(err, response, body) {
    var filename = "photo" + Date.now() + ".jpg";
    fs.writeFile(filename, body, "binary", function(err) {
      console.log("Downloaded Photo.");
      analyzePhoto(filename, replyToName, tweetId);
    });
  });
}

function analyzePhoto(filename, replyToName, tweetId) {
  var request = { source: { filename: filename } };
  vision.faceDetection(request, function(err, faces) {
    console.log("faces.faceAnnotations:", faces.faceAnnotations);
    var allEmotions = [];
    faces.faceAnnotations.forEach(function(face) {
      extractFaceEmotions(face).forEach(function(emotion) {
        if (allEmotions.indexOf(emotion) === -1) {
          allEmotions.push(emotion);
        }
      });
    });
    postStatus(allEmotions, replyToName, tweetId);
  });
}

function extractFaceEmotions(face) {
  var emotions = ["joyLikelihood", "sorrowLikelihood", "angerLikelihood", "surpriseLikelihood"];
  return emotions.filter(function(emotion) {
    console.log(face[emotion]);
    return face[emotion] === "LIKELY" || face[emotion] === "VERY_LIKELY";
  });
}

function postStatus(allEmotions, replyToName, tweetId) {
  var status = formatStatus(allEmotions, replyToName);
  bot.post(
    "statuses/update",
    {
      status: status,
      in_reply_to_status_id: tweetId
    },
    function(err, data, response) {
      if (err) {
        console.error(err);
      } else {
        console.log(`Bot has tweeted ${status}`);
      }
    }
  );
}

function formatStatus(allEmotions, replyToName) {
  var reformatEmotions = {
    joyLikelihood: "happy",
    sorrowLikelihood: "sad",
    angerLikelihood: "angry",
    surpriseLikelihood: "surprised"
  };
  var status = `@${replyToName} looking`;
  if (allEmotions.length > 0) {
    allEmotions.forEach(function(emotion, i) {
      if (i === 0) {
        status = `${status} ${reformatEmotions[emotion]}`;
      } else {
        status = `${status} and ${reformatEmotions[emotion]}`;
      }
    });
  } else {
    status = `${status} neutral`;
  }
  status = `${status}!`;
  return status;
}

var stream = bot.stream("statuses/filter", { track: "@bots_with_han" });

stream.on("connecting", function(response) {
  console.log("connecting...");
});

stream.on("connected", function(response) {
  console.log("connected!");
});

stream.on("error", function(err) {
  console.log(err);
});

stream.on("tweet", function(tweet) {
  if (tweet.entities.media) {
    downloadPhoto(tweet.entities.media[0].media_url, tweet.user.screen_name, tweet.id_str);
  }
});
