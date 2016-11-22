var watson = require('watson-developer-cloud');
var busboy = require('connect-busboy');
var fs = require('fs');
var tmp = require('tmp');
var express = require('express');
var app = express();
app.use(busboy());

var credentials = {
    username: process.env.STT_USERNAME || 'mayVcYoNH5rg',
    password: process.env.STT_PASSWORD || 'fe53fa7c-201d-46c9-a7ef-149e7deba87f'
};

var tts = watson.text_to_speech(credentials.extend({
    version: 'v1',
    url: 'https://stream.watsonplatform.net/text-to-speech/api'
});

var stt = watson.speech_to_text(credentials.extend({
    version: 'v1',
    url: 'https://stream.watsonplatform.net/speech-to-text/api'
}));

app.get('/speak', function (req, res) {
    var transcript = tts.synthesize(req.query);
    transcript.on('response', function(response) {
        if (req.query.download) {
            response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
        }
    });
    transcript.on('error', function(error) {
        next(error);
    });
    transcript.pipe(res);
});

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

var port = process.env.VCAP_APP_PORT || process.env.PORT || 3000;

app.listen(port, function () {
  console.log('listening on port ' + port);
});
