//config default parameter for skill
var notes = {};
//Google contact api
var gcontact_config = {
    'client_id': '401040484769-6uis0j4pr590jiq9jfi856qs4okuhb4k.apps.googleusercontent.com',
    'scope': 'https://www.google.com/m8/feeds'
};
//Youtube developer api
var youtube_api_key = 'AIzaSyBCaDivrcL_ivWRsuA_rw-UWH0Xr9K0iLQ';
var youtube_api_url = 'https://www.googleapis.com/youtube/v3/search';
//YIFY api
var movie_api_url = 'https://yts.ag/api/v2/list_movies.json';
//Amadeus API
var amadeuskey = 'qNZ1Q2UTdMGfGCbODTFPNkGZzwDvJNju';
//Google QPX API
var qpxkey = 'AIzaSyAUFDopNeumqqvtjNxg9X9qAD4KYSh1R5g';
//Google map javascript api
var googlemap_api_key = 'AIzaSyB18p9DlZxJ9tdyNR0Cgjva0guWg_AcglM';
//Open weather API
var open_weather_key = '6cd3a751a5db90ed116de7fb325f5535';
//https://api.edamam.com/
var recipe_id = 'aa153e8d';
var recipe_key = '934eb5e3ae05329ba20a3e59e66ddcfd';
//regconition value
//var LANG = localStorage.getItem("regconitionLang") || "en-US";
var LANG = "en-US";
var MAX_SPEECH_LENGTH_CHARS = 150;
var SPEECH_RATE = 1; //0.90 This should be a float value between 0 and 10, the default being 1.
var SPEECH_PITCH = 1; // 1 This should be a float value between 0 and 2, with a value of 1 being the default. 
var DEFAULT_VOICE = "Google UK English Female";
var SPEECH_VOLUME = 0;

//responsive parameter
var responsive_voice_params = {
    rate: 1,
    pitch: 1,
    volume: 1,
    //voice: localStorage.getItem("speechLang") || 'US English Female'
    voice: 'US English Female'
};

//load value from cache
var username = localStorage.getItem("nickName") || 'Bang Doan';
//var username = localStorage.getItem("nickName") || 'Bang Doan';
var AIName = localStorage.getItem("AIName") || 'roxy';
//browser cache for client usage
//localStorage.setItem("lastname", "Smith");
//document.getElementById("result").innerHTML = localStorage.getItem("lastname");

//var speechLangText = localStorage.getItem("regconitionLangText") || 'English'
//speechLangText = localStorage.getItem("regconitionLangText") || 'English'