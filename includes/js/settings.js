//JS file for settings page
var nickName = "Bang Doan";

var notes = {};

var voiceRequestHandlers = [
    new VoiceRequestHandler([
        /^phone\s?number\s*([- 0-9]+)$/gi
    ], function (matchGroups) {
        var phoneNumber = matchGroups[1];
        updatePhone(phoneNumber);
        if (phoneNumber.replace(/[\s-]*/, "").length < 10) {
            $("#phDiv").addClass("has-error");
            voiceAssistant.say("Hey " + nickName + " phone number should have minimum 10 digits. This is an invalid number");
        } else {
            $("#phDiv").removeClass("has-error");
        }
    }),
    new VoiceRequestHandler([
        /^date\s?of\s?birth\s*(\d{1,2})(th|rd|st)*\s*(jan|January|Feb|February|March|April|June|July|August|September|October|November|December)\s*(\d{4})\s*$/gi,
        /^\s*date of birth\s*(jan|January|Feb|February|March|April|June|July|August|September|October|November|December)\s*(\d{1,2})(th|rd|st)*\s*(\d{4})$/gi
    ], function (matchGroups) {
        var year = matchGroups[4];
        var month = null;
        var date = null;
        if (isNaN(matchGroups[1])) { // if first group is not a number, month first pattern
            month = matchGroups[1];
            date = matchGroups[2];
        } else { // first group is number, date first pattern
            month = matchGroups[3];
            date = matchGroups[1];
        }

        if (isValidDate(year, month, date)) {
            updateDOB(date, month, year);
            $("#dtDiv").removeClass("has-error");
        } else {
            updateDOB(null, month, year);
            $("#dtDiv").addClass("has-error");
            voiceAssistant.say("Hey " + nickName + " are you kidding me?, " + month + ", " + year + " doesn't have " + date + " days");
        }
    }),
    new VoiceRequestHandler([
        /^address(\s+line)?\s+((\d+\s+[a-z\s]+)(\s+(apartment|unit|suite)(\s+(\d+)))?)(\s+([ a-z]+))?((\s+(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|District of Columbia|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|AK|AL|AR|AZ|CA|CO|CT|DC|DE|FL|GA|HI|IA|ID|IL|IN|KS|KY|LA|MA|MD|ME|MI|MN|MO|MS|MT|NC|ND|NE|NH|NJ|NM|NV|NY|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|VT|WA|WI|WV|WY))(\s+(\d{5})))?$/gi,
    ], function (matchGroups) {
        updateAddress(matchGroups[2], matchGroups[7], matchGroups[9], matchGroups[12], matchGroups[14]);
    }),
    new VoiceRequestHandler([
        /^(apartment|unit|suite)(\s+(\d+))$/gi
    ], function (matchGroups) {
        updateAddress(null, matchGroups[3], null, null, null);
    }),
    new VoiceRequestHandler([
        /^city\s+([ a-z]+)$/gi
    ], function (matchGroups) {
        updateAddress(null, null, matchGroups[1], null, null);
    }),
    new VoiceRequestHandler([
        /^state\s+(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|District of Columbia|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|AK|AL|AR|AZ|CA|CO|CT|DC|DE|FL|GA|HI|IA|ID|IL|IN|KS|KY|LA|MA|MD|ME|MI|MN|MO|MS|MT|NC|ND|NE|NH|NJ|NM|NV|NY|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|VT|WA|WI|WV|WY)$/gi
    ], function (matchGroups) {
        updateAddress(null, null, null, matchGroups[1], null);
    }),
    new VoiceRequestHandler([
        /^zip\s?code\s+(\d{5})$/gi
    ], function (matchGroups) {
        updateAddress(null, null, null, null, matchGroups[1]);
    }),
    new VoiceRequestHandler([
        /^Gender\s+(male|female)$/gi
    ], function (matchGroups) {
        updateGender(matchGroups[1]);
    }),
    new VoiceRequestHandler([
        /^I agree\s*$/gi,
        /^I agree to the Terms and Conditions$/gi
    ], function () {
        agreeToTheTermsAndCondition();
    }),
    new VoiceRequestHandler([
        /^I disagree\s*$/gi,
        /^I disagree to the Terms and Conditions$/gi
    ], function () {
        disagreeToTheTermsAndCondition();
    }),
    new VoiceRequestHandler([
        /^(Show( me)?( the)? )?Terms and Conditions$/gi
    ], function () {
        showTermsAndCondition();
        voiceAssistant.say("Showing Terms and Condition");
        voiceAssistant.say("If you want me to read and of the text, select it and say 'read'");
    }),
    new VoiceRequestHandler([
        /^read(\s*the)?(\s*selected)?(\s*text)?$/gi,
        /^read(\s+it(\s+to\s+me)?)?$/gi
    ], function () {
        var selectedText = getSelectionText();
        if (selectedText && selectedText.length > 0) {
            voiceAssistant.say(selectedText);
        } else {
            voiceAssistant.say("you didn't select any text to read");
        }
    }),
    new VoiceRequestHandler([
        "close",
        "close it"
    ], function () {
        closeTnCPopup();
    }),
    new VoiceRequestHandler([
        "submit"
    ], function () {
        submit();
    }),
    new VoiceRequestHandler([
        "reset",
        "clear"
    ], function () {
        reset();
    }),
    new VoiceRequestHandler([
        /^open tab (home|settings|contact)$/gi,
        /^open (home|settings|contact) tab$/gi,
        /^open menu (home|settings|contact)$/gi,
        /^open (home|settings|contact) menu$/gi,
        /^navigate to (home|settings|contact).*$/gi,
        /^navigate to tab (home|settings|contact)$/gi,
    ], function (matchGroups) {
        toggleTab(matchGroups[1]);
    }),
    new VoiceRequestHandler([
        "hey how are you doing today",
        "hello",
        "how are you"
    ], function () {
        voiceAssistant.say("Hello " + nickName + "! I am good how are you?");
    })
];


function welcomeMessage() {
    voiceAssistant.say("Hey " + nickName + "! I am here to assist you filling the form below. Please say field name followed by value to fill it. For example to fill Phone number.  Say phone number 234-456-2456");
}

function updatePhone(phoneNumber) {
    $("#phoneNumber").val(phoneNumber);
}

function updateDOB(date, month, year) {
    $("#date").val(date);
    $("#month").val(month.capitalizeFirstLetter());
    $("#year").val(year);
}

function updateAddress(addressLine, unit, city, state, zip) {
    if (addressLine) {
        $("#postalAddress").val(addressLine.toTitleCase());
    }
    if (unit) {
        $("#unit").val(unit);
    }
    if (city) {
        $("#city").val(city.toTitleCase());
    }
    if (state) {
        $("#state").val(state.capitalizeFirstLetter());
    }
    if (zip) {
        $("#zipCode").val(zip);
    }
}

function updateGender(gender) {
    $('input:radio[name=genderRadios]').val([gender.toLowerCase()]);
}

function agreeToTheTermsAndCondition() {
    $("#tnc").prop('checked', true);
}

function disagreeToTheTermsAndCondition() {
    $("#tnc").prop('checked', false);
}

function showTermsAndCondition() {
    $("#tnclink").click();
}

function submit() {
    $("#phDiv").removeClass("has-error");
    $("#aDiv").removeClass("has-error");
    $("#cDiv").removeClass("has-error");
    $("#sDiv").removeClass("has-error");
    $("#zDiv").removeClass("has-error");

    if (!$("#phoneNumber").val()) {
        $("#phDiv").addClass("has-error");
        voiceAssistant.say("Please  fill-in your phone number to submit");
    } else if (!$("#postalAddress").val()) {
        $("#aDiv").addClass("has-error");
        voiceAssistant.say("Please  fill-in your address to submit");
    } else if (!$("#city").val()) {
        $("#cDiv").addClass("has-error");
        voiceAssistant.say("Please provide proper address to submit");
    } else if (!$("#state").val()) {
        $("#sDiv").addClass("has-error");
        voiceAssistant.say("Please provide state to submit");
    } else if (!$("#zipCode").val()) {
        $("#zDiv").addClass("has-error");
        voiceAssistant.say("Please provide zip code to submit");
    } else if (!$("#tnc").prop("checked")) {
        voiceAssistant.say("Please agree to the terms and conditions to submit");
    } else {
        $("#submit").click();
        voiceAssistant.say("Hey " + nickName + ", your form was successfully submitted");
    }
}

function reset() {
    $("#reset").click();
}

function closeTnCPopup() {
    $("#tncClose").click();
}

function toggleTab(tab) {
    $("#" + tab).click();
}

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function getMonthIndex(monthString) {
    return new Date(monthString + " 1, 2016").getMonth();
}

function isValidDate(year, month, date) {
    var daysInMonth = new Date(year, getMonthIndex(month) + 1, 0).getDate();
    return (date <= daysInMonth);
}

function loadVoices() {
    var selectBox = $('#voices');
    var voices = voiceAssistant.getVoices();
    $(voices).each(function () {
        selectBox.append($("<option>").attr('value', this.name).text(this.name + " - " + (this.localService ? "Local Voice" : "Remote Voice")));
    });

    selectBox.val(voiceAssistant.getCurrentVoiceName());
}

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function (word) {
        return word.capitalizeFirstLetter();
    });
}

function Submit() {
    //detail tab
    localStorage.setItem("nickName", $('#nameForm').val());
    localStorage.setItem("phoneNumber", $('#phoneNumber').val());
    localStorage.setItem("dateBirth", date.value);
    localStorage.setItem("monthBirth", month.value);
    localStorage.setItem("yearBirth", $('#year').val());
    localStorage.setItem("addressLine", $('#postalAddress').val());
    localStorage.setItem("addressCity", $('#city').val());
    localStorage.setItem("addressState", $('#state').val());
    localStorage.setItem("addressZIP", $('#zipCode').val());
    $("#genderm, #genderf").change(function () {
        if ($("#genderm").is(":checked")) {
            localStorage.setItem("gender", 'male');
        }
        else if ($("#genderf").is(":checked")) {
            localStorage.setItem("gender", 'female');
        }
    });
    //voice settings tab
    localStorage.setItem("AIName", $("#AIName").val());
    localStorage.setItem("regconitionLangText", $('#select_language').val());
    localStorage.setItem("regconitionLangIndex", select_language.selectedIndex);
    localStorage.setItem("regconitionLang", select_dialect.value);
    localStorage.setItem("speechLang", $('#languageout').val());
    localStorage.setItem("speechLangSpeed", $('#languageoutspeed').val());
    localStorage.setItem("speechLangPitch", $('#languageoutpitch').val());
    //iot config tab
    localStorage.setItem("SonyIP", $("#sonyip").val());
    localStorage.setItem("SonyPre", $("#sonypre").val());

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

function CheckLoading() {
    if (voiceReady && windowReady) {
        var voicelist = responsiveVoice.getVoices();
        var vselect = $("#languageout");
        vselect.html("");
        $.each(voicelist, function () {
            vselect.append($("<option />").val(this.name).text(this.name));
        });

        $('#languageout').val(responsive_voice_params.voice);
    }
}

function updateCountry() {
    for (var i = select_dialect.options.length - 1; i >= 0; i--) {
        select_dialect.remove(i);
    }
    var
        list = langs[select_language.selectedIndex];
    for (var i = 1; i < list.length; i++) {
        select_dialect.options.add(new Option(list[i][1],
            list[i][0]));
    }
    if (list[1].length == 1) {
        $('#vDiv3').hide();
    } else {
        $('#vDiv3').show();
    }
}
$(document).ready(function () {
    $("#container2").hide();
    $("#name").click(function () {
        nameClick();
    });
    $('#voices').on('change', function () {
        voiceAssistant.setVoiceByName(this.value);
    });

    $('#testVoice').click(function () {
        voiceAssistant.say("The quick brown fox jumps over the lazy dog");
    });

});
var windowReady = false;
var voiceReady = false;
window.onload = function () {
    windowReady = true;

    //set list google voice recognition by chrome
    for (var i = 0; i < langs.length; i++) {
        select_language.options[i] = new Option(langs[i][0], i);
    }
    //Vietnamese index 28
    select_language.selectedIndex = localStorage.getItem("regconitionLangIndex") || 28;
    updateCountry();
    languageoutspeed.selectedIndex = 1;
    languageoutpitch.selectedIndex = 1;
    voiceAssistant.configure({
        listenContinuously: true,
        requestHandlers: voiceRequestHandlers,
        silentOnUnknownRequest: true,
        callBackAfterReady: function () {
            voiceAssistant.say("Hello welcome to Roxy's Voice Assisted Web App!");
            //loadVoices();
            CheckLoading();
            CheckVoiceSupport();
            if (nickName != null) {
                $("#nickName").val(nickName);
                $("#container1").hide();
                $("#container2").show();
                welcomeMessage();
                //detail tab
                $("#nameForm").val(localStorage.getItem("nickName"));
                $("#phoneNumber").val(localStorage.getItem("phoneNumber"));
                $("#date").val(localStorage.getItem("dateBirth"));
                $("#month").val(localStorage.getItem("monthBirth"));
                $("#year").val(localStorage.getItem("yearBirth"));
                $("#postalAddress").val(localStorage.getItem("addressLine"));
                $("#city").val(localStorage.getItem("addressCity"));
                $("#state").val(localStorage.getItem("addressState"));
                $("#zipCode").val(localStorage.getItem("addressZIP"));
                genderchoice = localStorage.getItem("gender");
                if (genderchoice == 'male') {
                    $("#genderm").prop("checked", true);
                } else if (genderchoice == 'female') {
                    $("#genderf").prop("checked", true);
                }
                //voice settings tab
                $("#AIName").val(localStorage.getItem("AIName"));
                $('#select_language').val(localStorage.getItem("regconitionLangText"));
                $('#languageout').val(localStorage.getItem("speechLang"));
                $('#languageoutspeed').val(localStorage.getItem("speechLangSpeed"));
                $('#languageoutpitch').val(localStorage.getItem("speechLangPitch"));
                //iot config tab
                $("#sonyip").val(localStorage.getItem("SonyIP"));
                $("#sonypre").val(localStorage.getItem("SonyPre"));
            }

        },
        onListeningStarts: function () {
            console.log("Listening...");
        },
        onInterimResult: function (text) {
            console.log("Interim Speech:" + text);
        },
        onFinalResult: function (text) {
            console.log("Final Speech:" + text);
        },
        onListeningStops: function () {
            console.log("Listening stopped...");
        },
        onSpeechStart: function (text) {
            console.log("Going to speek:" + text);
        }
    });
    var nickName = localStorage.getItem("nickName");

};
responsiveVoice.OnVoiceReady = function () {
    voiceReady = true;
    CheckLoading();
    CheckVoiceSupport();
}
$(document).keypress(function (e) {
    if (e.which == 13) {
        nameClick();
    }
});
function nameClick() {
    if (!$("#nickName").val()) {
        $("#nnDiv").addClass("has-error");
        $("#nickName").attr("placeholder", "Enter Nick Name to proceed");
        voiceAssistant.say("Enter a nick name to proceed");
    } else {
        nickName = $("#nickName").val();
        localStorage.setItem("nickName", nickName);

        $("#container1").hide();
        $("#container2").show();
        welcomeMessage();
        $("#nameForm").val(nickName);
    }
}
function CheckVoiceSupport() {
    var synthsp = window.speechSynthesis;
    var voicelistsupport = synthsp.getVoices();
    var vspselect = $("#languageoutbr");
    vspselect.html("");
    $.each(voicelistsupport, function () {
        vspselect.append($("<option />").val(this.name).text(this.name));
    });
    $("#google_translate_element").children("div").children("div").children("select").addClass('form-control');
}
