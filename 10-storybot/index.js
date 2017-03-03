var Twit = require('twit');
var tracery = require('tracery-grammar');

var bot = new Twit({
    consumer_key: process.env.LEARNINGBOT_CONSUMER_KEY,
    consumer_secret: process.env.LEARNINGBOT_CONSUMER_SECRET,
    access_token: process.env.LEARNINGBOT_ACCESS_TOKEN,
    access_token_secret: process.env.LEARNINGBOT_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000
});

var grammar = tracery.createGrammar({
    'character': ['Karl', 'Aida', 'Hans'],
    'place': ['office', 'bank', 'court'],
    'object': ['letter', 'paper', 'bribe'],
    'setPronouns': [
        '[they:they][them:them][their:their][theirs:theirs]',
        '[they:she][them:her][their:her][theirs:hers]',
        '[they:he][them:him][their:his][theirs:his]'
    ],
    'setJob': [
        '[job:lawyer][actions:argued in court,filed some paperwork]',
        '[job:inspector][actions:talked with the lawyer,conducted meetings]',
        '[job:officer][actions:arrested people,stood in the courtroom]'
    ],
    'story': ['#protagonist# the #job# went to the #place# every day. Usually #they# #actions#. Then #they# picked up #their# #object#.'],
    'origin': ['#[#setPronouns#][#setJob#][protagonist:#character#]story#']
});

grammar.addModifiers(tracery.baseEngModifiers);

var story = grammar.flatten('#origin#');

bot.post('statuses/update', {status: story}, function(err, data, response){
    if (err){
        console.log(err);
    }else{
        console.log('Bot has tweeted '+story);
    }
});















