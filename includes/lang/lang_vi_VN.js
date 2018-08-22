//languague AI says
//var openintab = "Đã mở ở tab khác";
var openintab = '';
var allowpopup = 'Vui lòng mở pop cho website';
var unknownrequest = "";
//handle request
var voiceRequestHandlers_vi_VN = [
    new VoiceRequestHandler([
        "hello",
        "hi",
        "hey",
        "chào",
        "hê",
        "xin chào"
    ], function () {
        voiceAssistant.say("Xin chào! Rất vui được gặp " + username + "! Bạn khỏe không?");
    }),
    new VoiceRequestHandler([
        "bạn tên gì",
        "em tên gì",
        "tên của em là gì"
    ], function () {
        voiceAssistant.say("Tôi là " + AIName);
    }),
    new VoiceRequestHandler([
        "hey bạn khỏe không",
        "bạn khỏe không"
    ], function () {
        voiceAssistant.say("Xin chào " + username + "! Tôi rất khỏe, Còn bạn?");
    }),
    new VoiceRequestHandler([
        "tôi khỏe",
        "tôi cũng khỏe",
        "khỏe"
    ], function () {
        voiceAssistant.say("Thật vui, Tôi có thể giúp gì cho bạn?");
    }),
    new VoiceRequestHandler([
        "mở tìm kiếm google",
        "mở google"
    ], function () {
        openInNewTab("https://www.google.com", openintab, allowpopup);
    }),
    new VoiceRequestHandler([
        "mở youtube search",
        "mở youtube"
    ], function () {
        openInNewTab("https://www.youtube.com", openintab, allowpopup);
    }),
    new VoiceRequestHandler([
        /^mở ((nhạc)|(youtube)|(bài hát)) ( )?([- a-z0-9 \u0080-\u9fff]+)$/gi
    ], function (matchGroups) {
        getYoutube(matchGroups[6], "Mở bài hát ");
    }),
    new VoiceRequestHandler([
        /^tìm (phim|movie)( )?([- a-z0-9 \u0080-\u9fff]+)$/gi
    ], function (matchGroups) {
        console.log(matchGroups);
        infomess = "Lấy thông tin film ";
        sorrymess = "Xin lỗi. Không thể tìm thấy film!";
        getMovie(matchGroups[3], infomess, sorrymess);
    }),
    new VoiceRequestHandler([
        /^tìm (danh bạ|người)( )?([- a-z0-9 \u0080-\u9fff]+)$/gi
    ], function (matchGroups) {
        console.log(matchGroups);
        voiceAssistant.say("Đây là danh bạ tôi tìm thấy");
        //getContact('thien');
        getContact(matchGroups[3]);
    }),
    new VoiceRequestHandler([
        "thời gian",
        "mấy giờ rồi",
        "nói thời gian"
    ], function () {
        voiceAssistant.say("Bây giờ là " + getReadableTime());
    }),
    new VoiceRequestHandler([
        "hôm nay là ngày mấy",
        "nói ngày"
    ], function () {
        voiceAssistant.say("Hôm nay là " + new Date().toDateString());
    }),
    new VoiceRequestHandler([
        /^(note|take) down my ((phone number)|(address)) (as )?([- a-z0-9 \u0080-\u9fff]+)$/gi
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
        /^google ((hình ảnh)|(hình)) ( )?([- a-z0-9 \u0080-\u9fff]+)$/gi
    ], function (matchGroups) {
        openInNewTab("https://www.google.com/search?q=" + matchGroups[5] + '&tbm=isch', openintab, allowpopup);
    }),
    new VoiceRequestHandler([
        /^google ((về))( )?([- a-z0-9 \u0080-\u9fff]+)$/gi
    ], function (matchGroups) {
        openInNewTab("https://www.google.com/search?q=" + matchGroups[4], openintab, allowpopup);
    }),
    new VoiceRequestHandler([
        "tìm nhà hàng"
    ], function () {
        let url = window.location.href.replace('?',"");
        openInNewTab(url + "/includes/skill/eat/", openintab, allowpopup);
    }),
    new VoiceRequestHandler([
        "tìm quán cà phê"
    ], function () {
        let url = window.location.href.replace('?',"");
        openInNewTab(url + "/includes/skill/drink/", openintab, allowpopup);
    }),
    new VoiceRequestHandler([
        /^((wiki)|(wikipedia)) ((for))( )?([- a-z0-9 \u0080-\u9fff]+)$/gi
    ], function (matchGroups) {
        openInNewTab("http://en.wikipedia.org/w/index.php?search=" + matchGroups[7], openintab, allowpopup);
    }),
    new VoiceRequestHandler([
        /^tìm đường (đến)( )?([- a-z0-9 \u0080-\u9fff]+)$/gi
    ], function (matchGroups) {
        console.log(matchGroups);
        openInNewTab("http://maps.google.com/maps/?q=directions " + "to " + matchGroups[3], openintab, allowpopup);
    }),
    new VoiceRequestHandler([
        /^tìm đường (từ)( )?([- a-z0-9 \u0080-\u9fff]+) (đến|tới)( )?([- a-z0-9 \u0080-\u9fff]+)$/gi
    ], function (matchGroups) {
        console.log(matchGroups);
        openInNewTab("http://maps.google.com/maps/?q=directions from " + matchGroups[3] + " to " + matchGroups[6], openintab, allowpopup);
    }),
    new VoiceRequestHandler([
        /^mở facebook ((tin nhắn)|(cá nhân)|(thông báo)|(bạn)|(hình)|(trang chủ))$/gi
    ], function (matchGroups) {
        switch (matchGroups[1]) {
            case "tin nhắn":
                openInNewTab("https://www.facebook.com/messages", openintab, allowpopup);
                break;
            case "cá nhân":
                openInNewTab("https://www.facebook.com/me", openintab, allowpopup);
                break;
            case "thông báo":
                openInNewTab("https://www.facebook.com/notifications", openintab, allowpopup);
                break;
            case "bạn":
                openInNewTab("https://www.facebook.com/friends", openintab, allowpopup);
                break;
            case "hình":
                openInNewTab("https://www.facebook.com/photos", openintab, allowpopup);
                break;
            case "trang chủ":
                openInNewTab("https://www.facebook.com/", openintab, allowpopup);
                break;
        }
    }),
    new VoiceRequestHandler([
        /^(weather|what's weather|what's the weather|thời tiết) (ở|vào)( )?([- a-z0-9 \u0080-\u9fff]+)$/gi
    ], function (matchGroups) {
        let query = matchGroups[0].replace('ở', 'in');
        weatherres = weatherResp(query,'Thời tiết hiện tại <temp> và <condition>');
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
        /^((who (is|was))|(where (is|was))|(what (is|was))|(when (is|was))|(how (is|was)))([- a-z0-9 \u0080-\u9fff]+)$/gi
    ], function (matchGroups) {
        //use fact answer from duckduckgo
        foundmess = "Thông tin tìm thấy";
        getFactAnswer(matchGroups[12], foundmess);
    }),
    new VoiceRequestHandler([
        /^([- a-z0-9 \u0080-\u9fff]+)((là ai)|(ở đâu)|(là gì))$/gi
    ], function (matchGroups) {
        //use fact answer from duckduckgo
        console.log(matchGroups);
        getFactAnswer(matchGroups[1]);
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
        /^(cách nấu)( )?([- a-z0-9]+)$/gi
    ], function (matchGroups) {
        console.log(matchGroups);
        cookrecipe(matchGroups[3], "Danh sách công thức nấu");
        //voiceAssistant.say("Language change to" + matchGroups[3], true);
    }),
    new VoiceRequestHandler([
        /^(sony|Sony)( )?([- a-z0-9 \u0080-\u9fff]+)$/gi
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
        voiceAssistant.say("Đã dừng trợ lý giọng nói", true);
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
        case "vietnam":
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