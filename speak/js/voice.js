var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

// Speech Recognition
if (!('webkitSpeechRecognition' in window)) {
    message.innerHTML = 'Web Speech API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome">Chrome</a> version 25 or later.';
} else {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = function() {
        recognizing = true;
        message.innerHTML = 'Speak now.';
        talk_button.innerHTML = 'Listen';
    };

    recognition.onresult = function(event) {
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        final_span.innerHTML = final_transcript;
        interim_span.innerHTML = interim_transcript;
    };

    recognition.onend = function() {

        recognizing = false;
        if (ignore_onend) {
            return;
        }
        speechMyText(final_transcript);
        if (!final_transcript) {
            message.innerHTML = 'Click "Talk" and begin speaking.';
            talk_button.innerHTML = 'Talk';
            return;
        }
    };
    recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
            message.innerHTML = 'No speech was detected.';
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            message.innerHTML = 'No microphone was found. Ensure that a microphone is installed.';
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                message.innerHTML = 'Permission to use microphone is blocked. To change, go to chrome://settings/contentExceptions#media-stream';
            } else {
                message.innerHTML = 'Permission to use microphone was denied.';
            }
            ignore_onend = true;
        }
    };

}

function talkWithApp(event) {
    if (recognizing) {
        recognition.stop();
        message.innerHTML = 'Click "Talk" and begin speaking.';
        talk_button.innerHTML = 'Talk';
        return;
    }
    final_transcript = '';
    recognition.lang = select_dialect.value;
    recognition.start();
    ignore_onend = false;
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
    message.innerHTML = 'Click the "Allow" button above to enable your microphone.';
    start_timestamp = event.timeStamp;
}

// Speech Synthesis
function speechMyText(textToSpeech) {
    // var u = new SpeechSynthesisUtterance();
    // u.text = textToSpeech;
    // u.lang = language.value;
    // u.rate = 1.0;
    // u.onend = function(event) {}
    //speechSynthesis.speak(u);
    //use responsiveVoice to speeak
    responsiveVoice.speak(textToSpeech,
        $('#languageout').val(), {
            rate: $('#languageoutspeed').val(),
            pitch: $('#languageoutpitch').val(),
            volume: 1
        });
}
speechSynthesis.onvoiceschanged = function() {
    //get list voice support by browser
    //var voices = this.getVoices();
    //console.log(voices);
    // var synth = window.speechSynthesis;
    // voiceswin = synth.getVoices();
    //console.log(voiceswin);
};

//using Text to Speech with responsiveVoice
// Starts speaking the text in a given voice.
// Parameters
// text: String
// The text to be spoken.
// voice: String
// Defaults to “UK English Female”. Choose from the available ResponsiveVoices.
// parameters: Object
// Used to add optional pitch (range 0 to 2), rate (range 0 to 1.5), volume (range 0 to 1) and callbacks.
// Pitch, rate and volume may not affect audio on some browser combinations, older versions of Chrome on Windows for example.
var defaultparams = {
    rate: 1,
    pitch: 1,
    volume: 1,
    voice: 'Vietnamese Female'
};
var windowReady = false;
var voiceReady = false;
$(window).load(function() {
    windowReady = true;

    //set list google voice recognition by chrome
    for (var i = 0; i < langs.length; i++) {
        select_language.options[i] = new Option(langs[i][0], i);
    }
    //Vietnamese index 28
    select_language.selectedIndex = 28;
    updateCountry();
    languageoutspeed.selectedIndex = 1;
    languageoutpitch.selectedIndex = 1;
});
responsiveVoice.OnVoiceReady = function() {
    voiceReady = true;
    CheckLoading();
}

function CheckLoading() {
    if (voiceReady && windowReady) {
        var voicelist = responsiveVoice.getVoices();
        var vselect = $("#languageout");
        vselect.html("");
        $.each(voicelist, function() {
            vselect.append($("<option />").val(this.name).text(this.name));
        });

        $('#languageout').val(defaultparams.voice);
    }

}
// list language support by google
var langs = [
    ['Afrikaans', ['af-ZA']],
    ['Bahasa Indonesia', ['id-ID']],
    ['Bahasa Melayu', ['ms-MY']],
    ['Català', ['ca-ES']],
    ['Čeština', ['cs-CZ']],
    ['Dansk', ['da-DK']],
    ['Deutsch', ['de-DE']],
    ['English', ['en-AU', 'Australia'],
        ['en-CA', 'Canada'],
        ['en-IN', 'India'],
        ['en-NZ', 'New Zealand'],
        ['en-ZA', 'South Africa'],
        ['en-GB', 'United Kingdom'],
        ['en-US', 'United States']
    ],
    ['Español', ['es-AR', 'Argentina'],
        ['es-BO', 'Bolivia'],
        ['es-CL', 'Chile'],
        ['es-CO', 'Colombia'],
        ['es-CR', 'Costa Rica'],
        ['es-EC', 'Ecuador'],
        ['es-SV', 'El Salvador'],
        ['es-ES', 'España'],
        ['es-US', 'Estados Unidos'],
        ['es-GT', 'Guatemala'],
        ['es-HN', 'Honduras'],
        ['es-MX', 'México'],
        ['es-NI', 'Nicaragua'],
        ['es-PA', 'Panamá'],
        ['es-PY', 'Paraguay'],
        ['es-PE', 'Perú'],
        ['es-PR', 'Puerto Rico'],
        ['es-DO', 'República Dominicana'],
        ['es-UY', 'Uruguay'],
        ['es-VE', 'Venezuela']
    ],
    ['Euskara', ['eu-ES']],
    ['Filipino', ['fil-PH']],
    ['Français', ['fr-FR']],
    ['Galego', ['gl-ES']],
    ['Hrvatski', ['hr_HR']],
    ['IsiZulu', ['zu-ZA']],
    ['Íslenska', ['is-IS']],
    ['Italiano', ['it-IT', 'Italia'],
        ['it-CH', 'Svizzera']
    ],
    ['Lietuvių', ['lt-LT']],
    ['Magyar', ['hu-HU']],
    ['Nederlands', ['nl-NL']],
    ['Norsk bokmål', ['nb-NO']],
    ['Polski', ['pl-PL']],
    ['Português', ['pt-BR', 'Brasil'],
        ['pt-PT', 'Portugal']
    ],
    ['Română', ['ro-RO']],
    ['Slovenščina', ['sl-SI']],
    ['Slovenčina', ['sk-SK']],
    ['Suomi', ['fi-FI']],
    ['Svenska', ['sv-SE']],
    ['Tiếng Việt', ['vi-VN']],
    ['Türkçe', ['tr-TR']],
    ['Ελληνικά', ['el-GR']],
    ['български', ['bg-BG']],
    ['Pусский', ['ru-RU']],
    ['Српски', ['sr-RS']],
    ['Українська', ['uk-UA']],
    ['한국어', ['ko-KR']],
    ['中文', ['cmn-Hans-CN', '普通话 (中国大陆)'],
        ['cmn-Hans-HK', '普通话 (香港)'],
        ['cmn-Hant-TW', '中文 (台灣)'],
        ['yue-Hant-HK', '粵語 (香港)']
    ],
    ['日本語', ['ja-JP']],
    ['हिन्दी', ['hi-IN']],
    ['ภาษาไทย', ['th-TH']]
];

function updateCountry() {
    for (var i = select_dialect.options.length - 1; i >= 0; i--) {
        select_dialect.remove(i);
    }
    var list = langs[select_language.selectedIndex];
    for (var i = 1; i < list.length; i++) {
        select_dialect.options.add(new Option(list[i][1], list[i][0]));
    }
    select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}
//using google translate
// var audio = new Audio();
//     audio.src = 'http://translate.google.com/translate_tts?ie=utf-8&tl=en&q=Hello%20World.';
//     audio.play();