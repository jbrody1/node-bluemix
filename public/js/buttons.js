var audio_context;
var recorder;

function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    console.log('Media stream created.');
    console.log("input sample rate " + input.context.sampleRate);
    console.log('Input connected to audio context destination.');
    recorder = new Recorder(input, {
        numChannels: 1
    });
    console.log('Recorder initialised.');
}

function startRecording(button) {
    recorder && recorder.record();
    button.disabled = true;
    button.nextElementSibling.disabled = false;
    console.log('Recording...');
}

function stopRecording(button) {
    recorder && recorder.stop();
    button.disabled = true;
    button.previousElementSibling.disabled = false;
    console.log('Stopped recording.');
    // create WAV download link using audio data blob
    recorder && recorder.exportWAV(function(blob) {
        var data = new FormData();
        data.append('recording', blob);
        $.ajax({
            type: 'POST',
            url: '/listen',
            data: data,
            processData: false,
            contentType: false
        }).done(function(data) {
            console.log('finished uploading');
            if (data) {
                window.location = '/speak?text="you said: ' + data + '"';
            }
        });
    });
    recorder.clear();
}

window.onload = function init() {
    try {
        // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
        window.URL = window.URL || window.webkitURL;
        audio_context = new AudioContext;
        console.log('Audio context set up.');
        console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
        alert('No web audio support in this browser!');
    }
    navigator.getUserMedia({
        audio: true
    }, startUserMedia, function(e) {
        console.log('No live audio input: ' + e);
    });
};
