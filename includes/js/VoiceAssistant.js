var voiceAssistantExternalVoicesLoaded = false;
var saystop = false;
var voiceReady = false;
var saystop = false;
var messageInput = '';

function VoiceRequestHandler(utterances, action, customRequestMatcher) {
    this.utterances = utterances;
    this.action = action;
    this.customRequestMatcher = customRequestMatcher;
}
responsiveVoice.OnVoiceReady = function() {
    voiceReady = true;
    //CheckLoading();
}
VoiceRequestHandler.prototype.match = function(requestText) {
    var lowerCaseRequestText = requestText.trim().toLowerCase();
    if (this.customRequestMatcher) {
        return this.customRequestMatcher(lowerCaseRequestText)
    } else {
        for (var i = 0; i < this.utterances.length; i++) {
            //console.log("request:" + lowerCaseRequestText + " matcher:" + this.utterances[i]);
            if (this.utterances[i] instanceof RegExp) {
                this.utterances[i].lastIndex = 0;
                var matchGroups = this.utterances[i].exec(lowerCaseRequestText);
                //console.log(matchGroups);  
                if (matchGroups) {
                    return matchGroups;
                }
            } else if (this.utterances[i].toLowerCase() === lowerCaseRequestText) {
                return [lowerCaseRequestText];
            }
        }

        return null;
    }
};

function VoiceAssistant() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        alert("No speech recongntion support available in this browser version");
    } else {
        if (navigator.userAgent.indexOf("Chrome") != -1) {
            this.speechRecognition = new webkitSpeechRecognition();
        } else {
            this.speechRecognition = new SpeechRecognition();
        }

        if (this.speechRecognition) {
            this.speechRecognition.lang = LANG;
            this.speechRecognition.continuous = true;
        }
    }

    if (!('speechSynthesis' in window)) {
        alert('No Speech Synthesis Support');
    } else {
        this._speechSynthesisUtterance = new SpeechSynthesisUtterance();
        this._speechSynthesisUtterance.lang = LANG;
        this._speechSynthesisUtterance.rate = SPEECH_RATE;
        this._speechSynthesisUtterance.pitch = SPEECH_PITCH;
        this._speechSynthesisUtterance.volume = SPEECH_VOLUME;
        speechSynthesis.getVoices(); //This will start loading all voices
        speechSynthesis.onvoiceschanged = function() { // Once the voices are loaded, set the voice for this App.
            voiceAssistantExternalVoicesLoaded = true;
        };
        this.isReady = false;
        this.silentOnUnknownRequest = false;
        this.utterancesToSpeak = 0;
        this.listenAfterSpeechEnds = true;
        this.stoppedListeningToSpeak = false;
    }
}

VoiceAssistant.prototype.configure = function(config) {
    if (config) {
        this.config = config;
    }

    if (this.isReady) {
        this._configure();
    }
};

VoiceAssistant.prototype._ready = function() {
    this.isReady = true;
    if (!this.config) {
        this.config = {
            listenContinuously: true,
            requestHandlers: [
                new VoiceRequestHandler([
                    "hello",
                    "hey",
                    "how are you"
                ], function() {
                    voiceAssistant.say("Hello! Happy to hear from you! how are you?");
                })
            ],
            callBackAfterReady: function() {
                voiceAssistant.say("Hello! Welcome to Sino's Voice Assistant !");
            }
        };
    }

    this._configure();
};

VoiceAssistant.prototype._configure = function() {

    if (this.config.lang) {
        this.speechRecognition.lang = this.config.lang;
        this._speechSynthesisUtterance.lang = this.config.lang;
    }

    if (this.config.speechRate && this.config.speechRate > 0 && this.config.speechRate <= 10) {
        this._speechSynthesisUtterance.rate = this.config.speechRate;
    }

    if (this.config.speechPitch && this.config.speechPitch > 0 && this.config.speechPitch <= 2) {
        this._speechSynthesisUtterance.pitch = this.config.speechPitch;
    }

    if (this.config.listenContinuously) {
        this.speechRecognition.continuous = this.config.listenContinuously;
    } else {
        this.speechRecognition.continuous = false;
    }

    if (this.config.onInterimResult) {
        this.speechRecognition.interimResults = true;
    } else {
        this.speechRecognition.interimResults = false;
    }

    if (this.config.requestHandlers &&
        this.config.requestHandlers instanceof Array &&
        this.config.requestHandlers.every(function(e) {
            return (e instanceof VoiceRequestHandler);
        })) {
        this.hasRequestHandlers = true;
    } else {
        this.hasRequestHandlers = false;
    }

    if (this.config.silentOnUnknownRequest) {
        this.silentOnUnknownRequest = true;
    }

    if (!this.hasRequestHandlers && !config.onFinalResult) {
        throw "There is no listener configured to listen transcripts from Speech Recognition";
    }

    if (this.config.listenContinuously) {
        this.listen();
    }

    if (this.config.callBackAfterReady) {
        this.config.callBackAfterReady();
    }

};

VoiceAssistant.prototype.setVoice = function(voice) {
    if (voice) {
        this._speechSynthesisUtterance.voice = voice;
    }
};

VoiceAssistant.prototype.getVoices = function() {
    var lang = this._speechSynthesisUtterance.lang;
    return speechSynthesis.getVoices()
        .filter(function(voice) {
            return voice.lang === lang;
        });
}

VoiceAssistant.prototype.setVoiceByName = function(voiceName) {
    var voice = speechSynthesis.getVoices()
        .filter(function(voice) {
            return voice.name === voiceName;
        });
    if (voice && voice.length > 0) {
        this.setVoice(voice[0]);
    }
}

VoiceAssistant.prototype.getCurrentVoiceName = function() {
    return this._speechSynthesisUtterance.voice.name;
}

VoiceAssistant.prototype.listen = function() {
    console.log("Listen called...");
    try {
        if (!speechSynthesis.speaking || !speechSynthesis.pending) {
            if (this.config.onListeningStarts) {
                this.config.onListeningStarts();
            }
            this.speechRecognition.start();
        } else {
            console.log("Speech In-Progress, can't start listen");
            //console.error("Speech In-Progress, can't start listen");
        }
    } catch (e) {
        console.log(e.message);
        //console.error(e.message);
    }
};

VoiceAssistant.prototype.stopListening = function() {
    this.speechRecognition.stop();
};

VoiceAssistant.prototype.say = function(text, dontListenAfterSpeechEnds) {
    this.stoppedListeningToSpeak = true;

    if (dontListenAfterSpeechEnds) {
        this.listenAfterSpeechEnds = false;
    } else {
        this.listenAfterSpeechEnds = true;
    }

    this.stopListening();

    if (this.config.onSpeechStart) {
        this.config.onSpeechStart(text);
    }

    var utterances;

    if (text.length > MAX_SPEECH_LENGTH_CHARS) {
        utterances = splitUtterance(text);
    } else {
        utterances = [text];
    }

    this.utterancesToSpeak += utterances.length;

    for (var i = 0; i < utterances.length; i++) {
        console.log(utterances[i]);
        this.stopListening();
        responsiveVoice.speak(this.createSpeechSynthesisUtterance(utterances[i]).text, responsive_voice_params.voice);
        //speechSynthesis.speak(this.fakeSpeechSynthesisUtterance(utterances[i]));
    }
    speechSynthesis.speak(this.fakeSpeechSynthesisUtterance(utterances[i]));
    $('.message_input').val('');
};

VoiceAssistant.prototype.saywithlang = function(text, dontListenAfterSpeechEnds, langtospeak) {
    this.stoppedListeningToSpeak = true;

    if (dontListenAfterSpeechEnds) {
        this.listenAfterSpeechEnds = false;
    } else {
        this.listenAfterSpeechEnds = true;
    }

    this.stopListening();

    if (this.config.onSpeechStart) {
        this.config.onSpeechStart(text);
    }

    var utterances;

    if (text.length > MAX_SPEECH_LENGTH_CHARS) {
        utterances = splitUtterance(text);
    } else {
        utterances = [text];
    }

    this.utterancesToSpeak += utterances.length;

    for (var i = 0; i < utterances.length; i++) {
        console.log(utterances[i]);
        this.stopListening();
        responsiveVoice.speak(this.createSpeechSynthesisUtterance(utterances[i]).text, langtospeak);
        //speechSynthesis.speak(this.fakeSpeechSynthesisUtterance(utterances[i]));
    }
    speechSynthesis.speak(this.fakeSpeechSynthesisUtterance(utterances[i]));
    $('.message_input').val('');
};

VoiceAssistant.prototype.fakeSpeechSynthesisUtterance = function(text) {
    var u = new SpeechSynthesisUtterance();
    u.lang = this._speechSynthesisUtterance.lang;
    u.voice = this._speechSynthesisUtterance.voice;
    u.rate = this._speechSynthesisUtterance.rate;
    u.pitch = this._speechSynthesisUtterance.pitch;
    u.onend = this._speechSynthesisUtterance.onend;
    u.volume = this._speechSynthesisUtterance.volume;
    u.text = '';

    return u;
}
VoiceAssistant.prototype.createSpeechSynthesisUtterance = function(text) {
    var u = new SpeechSynthesisUtterance();
    u.lang = this._speechSynthesisUtterance.lang;
    u.voice = this._speechSynthesisUtterance.voice;
    u.rate = this._speechSynthesisUtterance.rate;
    u.pitch = this._speechSynthesisUtterance.pitch;
    u.onend = this._speechSynthesisUtterance.onend;
    u.text = text;

    return u;
}

VoiceAssistant.prototype.handleVoiceRequest = function(voiceRequest) {

    if (this.hasRequestHandlers) {
        var requestHandler = this.config.requestHandlers.find(function(e) {
            return e.match(voiceRequest);
        });
        if (requestHandler) {
            requestHandler.action(requestHandler.match(voiceRequest));
        } else if (!this.silentOnUnknownRequest) {
            this.onUnknowRequest();
        }
    }
}

VoiceAssistant.prototype.onUnknowRequest = function() {
    if (this.config.sayOnUnknowRequest) {
        voiceAssistant.say(this.config.sayOnUnknowRequest);
    } else {
        //lang define
        voiceAssistant.say(unknownrequest);
    }
}

VoiceAssistant.prototype.onResult = function(event) {
    if (typeof(event.results) == 'undefined') {
        console.log("undefined results from Speech Recognition");
        return;
    }

    if (this.config.onInterimResult || this.config.onFinalResult || this.hasRequestHandlers) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                var transcript = event.results[i][0].transcript;
                console.log("Recognized:" + transcript);
                $('.message_input').val(transcript);
                if (this.config.onFinalResult) {
                    this.config.onFinalResult(transcript);
                }
                this.handleVoiceRequest(transcript);
            } else if (this.config.onInterimResult) {
                this.config.onInterimResult(event.results[i][0].transcript);
            }
        }
    }
};

VoiceAssistant.prototype.onListeningStops = function(event) {
    if (this.config.listenContinuously && !this.stoppedListeningToSpeak) {
        //setTimeout(this.listen(), 2000);
        this.listen();
    } else if (this.config.onListeningStops && !saystop) {
        console.log('Time out. Restarting');
        //setTimeout(this.listen(), 2000);
        this.listen();
    }
};

VoiceAssistant.prototype.onSpeechStops = function(event) {
    this.utterancesToSpeak -= 1;
    if (this.utterancesToSpeak == 0 && (this.listenAfterSpeechEnds || this.config.listenContinuously)) {
        if (this.stoppedListeningToSpeak) {
            this.stoppedListeningToSpeak = false;
        }
        this.listen();
    }
}

voiceAssistant = new VoiceAssistant();

voiceAssistant.speechRecognition.onresult = function(event) {
    voiceAssistant.onResult(event);
};

voiceAssistant.speechRecognition.onstart = function() {
    console.log("Listening started");
};

voiceAssistant.speechRecognition.onend = function(event) {
    voiceAssistant.onListeningStops(event);
};

voiceAssistant._speechSynthesisUtterance.onend = function(event) {
    voiceAssistant.onSpeechStops(event);
};


function checkVoiceLoading() {
    if (navigator.userAgent.indexOf("Chrome") != -1) {
        if (voiceAssistantExternalVoicesLoaded) {
            voiceAssistant.setVoiceByName(DEFAULT_VOICE);
            console.log("Voice Loaded");
            voiceAssistant._ready();
            return;
        } else {
            console.log("Voice NOT Loaded waiting...");
            setTimeout(checkVoiceLoading, 2000);
        }
    } else {
        voiceAssistant._ready();
    }
}

function splitUtterance(utterance) {
    var i = 0;
    var start = 0;
    var utterances = [];
    while (start < utterance.length) {
        var tmp = utterance.substr(start, MAX_SPEECH_LENGTH_CHARS);
        var endIdx = tmp.length;

        if (tmp.length == MAX_SPEECH_LENGTH_CHARS) {
            var idxOfFullStop = tmp.lastIndexOf(".");
            var idxOfSpace = tmp.lastIndexOf(" ");
            endIdx = Math.max(idxOfFullStop, idxOfSpace) + 1;
        }

        utterances[i] = tmp.substring(0, endIdx);

        console.log("[" + (i) + "] (" + start + ", " + (start + endIdx) + ") " + utterances[i]);
        start += endIdx;
        i++;
    }

    return utterances;
}

checkVoiceLoading();

$('.send_message').click(function(e) {
    handleVoiceRequestInput();
});
$('.message_input').keyup(function(e) {
    switch (e.which) {
        case 13:
            handleVoiceRequestInput();
            break;
        case 38:
            if (messageInput != '') {
                $('.message_input').val(messageInput);
            }

    }

});

function handleVoiceRequestInput() {
    messageInput = $('.message_input').val();
    $("#chat").append($("<p class='triangle-right right color-blue'></p>").text(messageInput));
    requestInput = voiceAssistant.config.requestHandlers.find(function(e) {
        return e.match(messageInput.toLowerCase());
    });
    voiceAssistant.stopListening();
    if (requestInput) {
        requestInput.action(requestInput.match(messageInput));
    } else if (!voiceAssistant.silentOnUnknownRequest) {
        voiceAssistant.onUnknowRequest();
    }
    $('.message_input').val('');
}