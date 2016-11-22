var extend = require('extend');
var watson = require('watson-developer-cloud');
var express = require('express');
var multer = require('multer');
var streamifier = require('streamifier');
var upload = multer();
var app = express();
app.use(express.static('public'));

var tts = watson.text_to_speech({
    url: 'https://stream.watsonplatform.net/text-to-speech/api',
    version: 'v1',
    username: process.env.TTS_USERNAME || 'fe53fa7c-201d-46c9-a7ef-149e7deba87f',
    password: process.env.TTS_PASSWORD || 'mayVcYoNH5rg'
});

app.get('/speak', function (req, res, next) {
    var params = {
        voice: 'en-US_AllisonVoice',
        accept: 'audio/wav'
    };
    var transcript = tts.synthesize(extend(params, req.query));
    transcript.on('error', function(error) { next(error); });
    transcript.pipe(res);
});

var stt = watson.speech_to_text({
    url: 'https://stream.watsonplatform.net/speech-to-text/api',
    version: 'v1',
    username: process.env.STT_USERNAME || '1514b5fa-6d86-4d7a-b6b2-d546fdd9a751',
    password: process.env.STT_PASSWORD || 'Av0bjH46apYL'
});

app.get('/listen', function(req, res, next) { res.redirect('/listen.html'); });

app.post('/listen', upload.single('recording'), function (req, res, next) {
    var transcript = stt.createRecognizeStream({ content_type: 'audio/wav' });
    transcript.setEncoding('utf8');
    transcript.on('error', function(error) { next(error); });
    streamifier.createReadStream(req.file.buffer).pipe(transcript);
    transcript.pipe(res);
});

var port = process.env.VCAP_APP_PORT || process.env.PORT || 3000;
app.listen(port, function () { console.log('listening on port ' + port); });
