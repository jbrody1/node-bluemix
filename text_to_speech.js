var textToSpeech= require('watson-developer-cloud/text-to-speech/v1');
var fs = require('fs');
var express = require('express');
var app = express();

var tts = new textToSpeech({
  "url": "https://stream.watsonplatform.net/text-to-speech/api",
  "password": "mayVcYoNH5rg",
  "username": "fe53fa7c-201d-46c9-a7ef-149e7deba87f"
});

app.get('/speak', function (req, res) {
    var text = req.query.text;
    tts.synthesize({
        text: text,
        voice: 'en-US_AllisonVoice', // Optional voice
        accept: 'audio/wav' // default is audio/ogg; codec=opus
    }).pipe(res);
});

app.listen(process.env.PORT, function () {
  console.log('listening on port ' + process.env.PORT);
});
