# Build Your Own Twitter Bots!

In this course we’ll learn how to create Twitter bots. We’ll first learn how to interface with the Twitter API using Twit.js, which allows us to post statuses, search tweets, and interact with followers. We’ll create several example bots that show the diversity of possibilities, using powerful tools such as RiTa.js, Google’s Cloud Vision API, Tracery, Natural.js, and the New York Times API. We’ll learn how to set up our bot to interface with Google Spreadsheets. We’ll also learn how to host our bot logic on Heroku and on Amazon. 

## To Do Before Watching:

1. For lesson 7: register for an API key with NASA at https://api.nasa.gov/index.html#apply-for-an-api-key. If you don't want to use your own api key, NASA also offers DEMO_KEY as an option for playing around with the API.
2. For lesson 8: If you want to use your Twitter data, download your Twitter archive at the bottom of the page at https://twitter.com/settings/account. You can also use any other body of text instead.
3. For lesson 9: Sign up for a Google Cloud Vision account at https://cloud.google.com/vision/. Save your project ID and download your key (will download as a json file). The API is free for up to 1000 requests/month.
4. For lesson 12: install Timidity on the command line with 'brew install timidity'.
5. For lesson 14: install Docker (https://docs.docker.com/engine/getstarted/step_one/).

## Lessons

1. Basic Twitter Bot Setup with Twit.js - We’ll go over the basic Twitter bot setup, including how to start a project from scratch, install necessary packages, and store our private keys in environment variables. 

2. Post Statuses with Twit.js - We’ll tweet hello to the Twitter world!

3. Interacting with Users with Twit.js - We’ll learn how your bot can get your list of followers, follow people, and get your list of friendships.

4. Interacting with Tweets with Twit.js - We’ll learn the basics of interacting with tweets, including retweeting, deleting, and favoriting tweets.

5. Search Tweets with Twit.js - We’ll learn how to search tweets with the Twitter Search API.

6. Work with Tweet Streams with Twit.js - We’ll get a real-time stream of tweets, and learn how to filter a stream by keyword, location, and user. 

7. Tweeting Media Files with Twit.js - In this lesson, we’ll learn how to download photos from an API and tweet photos and video, using media from NASA’s space archives.

8. Make A Bot That Sounds Like You with RiTa.js - In this lesson, we’ll give our bot a large input of past text that we’ve written (essays, other tweets, etc.) and, using markov chains, have it create tweets that sound like ourselves! 

9. Make a Bot That Analyzes Human Emotions in Photos with Google Cloud Vision API - With this bot, we’ll find the number of faces in a photo that is tweeted at us, and respond back with what emotions the faces are expressing, using the Google Cloud Vision API.

10. Make A Story Generation Bot with Tracery - Tracery is a brilliant tool to more easily create text grammars and structure. In this lesson, we’ll create a bot that tweets out tiny stories.

11. Make a Bot That Retrieves Tweets from Google Spreadsheets with Tabletop.js - In this lesson, we’ll learn how to retrieve and tweet data from Google Spreadsheets.

12. Make a Twitter Audio Bot That Composes a Song Based on a Tweet - In the final bot lesson, we'll compose a ditty based on a tweet, save it as an audio file, and post it to Twitter. Because Twitter only supports uploading audio in video form, we'll learn how to create a video from the MIDI file and post it to Twitter. 

13. Host A Simple Bot using Heroku - We’ll learn how to host a simple bot using Heroku.

14. Host a Complex Bot using Heroku and Docker - We’ll learn how to host a complex bot (a bot that requires external tools that need to be installed on the system) with Heroku and Docker. 

## Additional Resources:

Twitter's List of Automation Rules: 
https://support.twitter.com/articles/76915

Basic Twitter Bot Etiquette:
http://tinysubversions.com/2013/03/basic-twitter-bot-etiquette/

Rate Limit Chart: 
https://dev.twitter.com/rest/public/rate-limits

Get rate limit status: 
https://dev.twitter.com/rest/reference/get/application/rate_limit_status

Relevant: 
https://xkcd.com/1646/
