var watson = require('watson-developer-cloud');
var busboy = require('connect-busboy');
var fs = require('fs');
var tmp = require('tmp');
var extend = require('extend');
var express = require('express');
var app = express();
app.use(busboy());

var credentials = {
    username: process.env.STT_USERNAME || 'mayVcYoNH5rg',
    password: process.env.STT_PASSWORD || 'fe53fa7c-201d-46c9-a7ef-149e7deba87f'
};

var tts = watson.text_to_speech(extend(credentials, {
    version: 'v1',
    url: 'https://stream.watsonplatform.net/text-to-speech/api'
}));

app.get('/speak', function (req, res) {
    var text = req.query.text;
    var transcript = tts.synthesize({
        text: text,
        voice: 'en-US_AllisonVoice', // Optional voice
        accept: 'audio/wav' // default is audio/ogg; codec=opus
    });
    transcript.pipe(res);
});

/*
var stt = watson.speech_to_text(extend(credentials, {
    version: 'v1',
    url: 'https://stream.watsonplatform.net/speech-to-text/api'
}));

app.post('/write', function (req, res) {
    req.pipe(req.busboy);

    req.busboy.on('file', function (fieldname, file, filename) {
        console.log('processing file ' + filename); 
        tmp.file(function(err, path, fd, cleanupCallback) {
            var fstream = fs.createWriteStream(path);
            file.pipe(fstream);
            console.log('wrote to temp file ' + path); 
        });
    });
    res.status(200);
    res.send('done');
});
*/

var port = process.env.VCAP_APP_PORT || process.env.PORT || 3000;

app.listen(port, function () {
  console.log('listening on port ' + port);
});
