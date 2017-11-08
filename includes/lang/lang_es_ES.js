//languague AI says
var openintab = "Opened in another tab";
var allowpopup = 'Please allow popups for this website';
var unknownrequest = "";
//handle request
var voiceRequestHandlers_es_ES = [
    new VoiceRequestHandler([
        "hello",
        "hi",
        "hey",
        "Hola",
        "¡Hola",
        "Aló",
        "Bueno"
    ], function () {
        voiceAssistant.say("Hola! Feliz de saber de " + username + "! cómo estás?");
    }),
    new VoiceRequestHandler([
        "what is your name",
        "what's your name",
        "your name is"
    ], function () {
        voiceAssistant.say("My name is " + AIName);
    }),
    new VoiceRequestHandler([
        "hey how are you",
        "hey how are you doing today",
        "how are you"
    ], function () {
        voiceAssistant.say("Hello " + username + "! I am good how are you?");
    }),
    new VoiceRequestHandler([
        "i'm good",
        "i'm good too",
        "i'm fine",
        "i'm fine too",
        "great"
    ], function () {
        voiceAssistant.say("Good to know that, How can I help you today?");
    }),
    new VoiceRequestHandler([
        "open google search",
        "open google"
    ], function () {
        openInNewTab("https://www.google.com", openintab, allowpopup);
    }),
    new VoiceRequestHandler([
        "open youtube search",
        "open youtube"
    ], function () {
        openInNewTab("https://www.youtube.com", openintab, allowpopup);
    }),
    new VoiceRequestHandler([
        /^play ((music)|(youtube)|(song)) ( )?([- a-z0-9]+)$/gi
    ], function (matchGroups) {
        getYoutube(matchGroups[6], "Play the song ");
    }),
    new VoiceRequestHandler([
        /^show (movie|film)( )?([- a-z0-9]+)$/gi
    ], function (matchGroups) {
        console.log(matchGroups);
        infomess = "Get the movie ";
        sorrymess = "Sorry. I can't find anything that you said!";
        getMovie(matchGroups[3], infomess, sorrymess);
    }),
    new VoiceRequestHandler([
        /^show (contact|people)( )?([- a-z0-9]+)$/gi
    ], function (matchGroups) {
        console.log(matchGroups);
        voiceAssistant.say("Those are contacts I found");
        //getContact('thien');
        getContact(matchGroups[3]);
    }),
    new VoiceRequestHandler([
        "what is the time",
        "what is the time now",
        "what's the time now",
        "what's the time",
        "time please"
    ], function () {
        voiceAssistant.say("Its " + getReadableTime());
    }),
    new VoiceRequestHandler([
        "what is the date",
        "what's the date",
        "what is the date today"
    ], function () {
        voiceAssistant.say("Its " + new Date().toDateString());
    }),
    new VoiceRequestHandler([
        /^(note|take) down my ((phone number)|(address)) (as )?([- a-z0-9]+)$/gi
    ], function (matchGroups) {
        if (matchGroups[2] === "phone number") {
            notes.phonenumber = matchGroups[6];
            voiceAssistant.say("Noted your phone number : " + notes.phonenumber);
        } else if (matchGroups[2] === "address") {
            notes.address = matchGroups[6];
            voiceAssistant.say("Noted you address : " + notes.address);
        }
    }),
    new VoiceRequestHandler([
        /^google ((photo)|(image)) ( )?([- a-z0-9]+)$/gi
    ], function (matchGroups) {
        openInNewTab("https://www.google.com/search?q=" + matchGroups[5] + '&tbm=isch', openintab, allowpopup);
    }),
    new VoiceRequestHandler([
        /^google ((for))( )?([- a-z0-9]+)$/gi
    ], function (matchGroups) {
        openInNewTab("https://www.google.com/search?q=" + matchGroups[4], openintab, allowpopup);
    }),
    new VoiceRequestHandler([
        /^((wiki)|(wikipedia)) ((for))( )?([- a-z0-9]+)$/gi
    ], function (matchGroups) {
        openInNewTab("http://en.wikipedia.org/w/index.php?search=" + matchGroups[7], openintab, allowpopup);
    }),
    new VoiceRequestHandler([
        /^direction (to)( )?([- a-z0-9]+)$/gi
    ], function (matchGroups) {
        openInNewTab("http://maps.google.com/maps/?q=directions " + "to " + matchGroups[3], openintab, allowpopup);
    }),
    new VoiceRequestHandler([
        /^direction (from)( )?([- a-z0-9]+) (to)( )?([- a-z0-9]+)$/gi
    ], function (matchGroups) {
        openInNewTab("http://maps.google.com/maps/?q=directions from " + matchGroups[3] + " to " + matchGroups[6], openintab, allowpopup);
    }),
    new VoiceRequestHandler([
        /^open facebook ((message)|(profile)|(notification)|(friend)|(photo)|(home))$/gi
    ], function (matchGroups) {
        switch (matchGroups[1]) {
            case "message":
                openInNewTab("https://www.facebook.com/messages", openintab, allowpopup);
                break;
            case "profile":
                openInNewTab("https://www.facebook.com/me", openintab, allowpopup);
                break;
            case "notification":
                openInNewTab("https://www.facebook.com/notifications", openintab, allowpopup);
                break;
            case "friend":
                openInNewTab("https://www.facebook.com/friends", openintab, allowpopup);
                break;
            case "photo":
                openInNewTab("https://www.facebook.com/photos", openintab, allowpopup);
                break;
            case "home":
                openInNewTab("https://www.facebook.com/", openintab, allowpopup);
                break;
        }
    }),
    new VoiceRequestHandler([
        /^(weather|what's weather|what's the weather|what is the weather) (in|on)( )?([- a-z0-9]+)$/gi
    ], function (matchGroups) {
        weatherres = weatherResp(matchGroups[0]);
        voiceAssistant.say(weatherres);
    }),
    new VoiceRequestHandler([
        /^(what does (the|a) )([- a-z0-9]+)( say)$/gi
    ], function (matchGroups) {
        console.log(matchGroups);
        switch (matchGroups[3]) {
            case "fox":
                voiceAssistant.say("Ring-ding-ding-ding-dingeringeding! Gering-ding-ding-ding-dingeringeding!");
                break;
            case "cat":
                voiceAssistant.say("meow meow meow");
                break;
            case "dog":
                voiceAssistant.say("woof woof woof");
                break;
            case "duck":
                voiceAssistant.say("quack quack quack");
                break
        }
    }),
    new VoiceRequestHandler([
        /^((who (is|was))|(where (is|was))|(what (is|was))|(when (is|was))|(how (is|was)))([- a-z0-9]+)$/gi
    ], function (matchGroups) {
        //use fact answer from duckduckgo
        foundmess = "This is what I found";
        getFactAnswer(matchGroups[12], foundmess);
    }),
    new VoiceRequestHandler([
        /^what is my ((phone number)|(address))$/gi
    ], function (matchGroups) {
        if (matchGroups[1] === "phone number") {
            if (notes.phonenumber) {
                voiceAssistant.say("Your phone number is : " + notes.phonenumber);
            } else {
                voiceAssistant.say("I don't have your phone number");
            }
        } else if (matchGroups[1] === "address") {
            if (notes.address) {
                voiceAssistant.say("Your address is : " + notes.address);
            } else {
                voiceAssistant.say("I don't have your address");
            }
        }
    }),
    new VoiceRequestHandler([
        /^(sony|Sony)( )?([- a-z0-9]+)$/gi
    ], function (matchGroups) {
        console.log(matchGroups);
        var sonytv = sendCommand(matchGroups[3]);
        sonytv.then(function () {
            voiceAssistant.say("Did it!");
        }).catch(function () {
            voiceAssistant.say("Invalid Command!");
        })
    }),
    new VoiceRequestHandler([
        /^language (in)( )?([- a-z0-9]+)$/gi
    ], function (matchGroups) {
        console.log(matchGroups);
        LoadLanguageRequestHandler(matchGroups[3]);
        //voiceAssistant.say("Language change to" + matchGroups[3], true);
    }),
    new VoiceRequestHandler([
        "stop"
    ], function () {
        saystop = true;
        voiceAssistant.say("Stopping voice assistant", true);
        $(".mic").show(1000);
    })
];

//Change language of AI
function LoadLanguageRequestHandler(language) {
    voiceAssistant.saywithlang("Language change to " + language, false, 'US English Female');
    switch (language) {
        case "english":
            LANG = "en-US";
            voiceAssistant.speechRecognition.lang = "en-US";
            responsive_voice_params = {
                rate: 1,
                pitch: 1,
                volume: 1,
                voice: 'UK English Female'
            };
            requestHandlers = voiceRequestHandlers_en_US;
            voiceAssistant.config.requestHandlers = voiceRequestHandlers_en_US;
            break;
        case "vietnamese":
            LANG = "vi-VN";
            voiceAssistant.speechRecognition.lang = "vi-VN";
            responsive_voice_params = {
                rate: 1,
                pitch: 1,
                volume: 1,
                voice: 'Vietnamese Male'
            };
            requestHandlers = voiceRequestHandlers_vi_VN;
            voiceAssistant.config.requestHandlers = voiceRequestHandlers_vi_VN;
            break;
        case "thai language":
            LANG = "th-TH";
            voiceAssistant.speechRecognition.lang = "th-TH";
            responsive_voice_params = {
                rate: 1,
                pitch: 1,
                volume: 1,
                voice: 'Thai Female'
            };
            requestHandlers = voiceRequestHandlers_th_TH;
            voiceAssistant.config.requestHandlers = voiceRequestHandlers_th_TH;
            break;
        case "chinese":
            LANG = "cmn-Hans-CN";
            voiceAssistant.speechRecognition.lang = "cmn-Hans-CN";
            responsive_voice_params = {
                rate: 1,
                pitch: 1,
                volume: 1,
                voice: 'Chinese Female'
            };
            requestHandlers = voiceRequestHandlers_cmn_Hans_CN;
            voiceAssistant.config.requestHandlers = voiceRequestHandlers_cmn_Hans_CN;
            break;
        case "spanish":
            LANG = "es-ES";
            voiceAssistant.speechRecognition.lang = "es-ES";
            responsive_voice_params = {
                rate: 1,
                pitch: 1,
                volume: 1,
                voice: 'Spanish Female'
            };
            requestHandlers = voiceRequestHandlers_es_ES;
            voiceAssistant.config.requestHandlers = voiceRequestHandlers_es_ES;
            break;
        case "korean":
            LANG = "ko-KR";
            voiceAssistant.speechRecognition.lang = "ko-KR";
            responsive_voice_params = {
                rate: 1,
                pitch: 1,
                volume: 1,
                voice: 'Korean Female'
            };
            requestHandlers = voiceRequestHandlers_ko_KR;
            voiceAssistant.config.requestHandlers = voiceRequestHandlers_ko_KR;
            break;
    }
    voiceAssistant.say("");
}