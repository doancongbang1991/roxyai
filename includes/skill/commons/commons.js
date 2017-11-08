//open url in other tabs
function openInNewTab(url, successmess, failmess) {
    //$('#modalpopup').modal('show');
    var win = window.open(url, '_blank');
    if (win) {
        //Browser has allowed it to be opened
        voiceAssistant.say(successmess);
        win.focus();
    } else {
        //Browser has blocked it
        voiceAssistant.say(failmess);
        alert(failmess);
    }
}

//search first youtube song
function getYoutube(searchTerm, mess) {
    var params = {
        //Youtube API parameters
        part: 'snippet',
        key: youtube_api_key,
        q: searchTerm,
        //r: 'json'
    };
    url = youtube_api_url;

    $.getJSON(url, params, function (data) {
        //showResults(data.items); //<-- There is no `data.Search`
        //console.log(data);
        //play first song
        openInNewTab("https://www.youtube.com/watch?v=" + data.items[0].id.videoId, mess + data.items[0].snippet.title, '');
        //voiceAssistant.say(mess + data.items[0].snippet.title);
    });
}

//get movie info from YFI
function getMovie(searchTerm, infomess, sorrymess) {
    var params = {
        query_term: searchTerm,
        sort_by: 'peers',
    };
    url = movie_api_url;

    $.getJSON(url, params, function (data) {
        if (data.data.movie_count != "0") {
            voiceAssistant.say(infomess + data.data.movies[0].title_long);
            $("#chat").append($("<p class='triangle-right left color-orange'></p>").text("Torrent: " + data.data.movies[0].torrents[0].url));
            $("#chat").append($("<p class='triangle-right left color-orange'>Cover Image: </br><img src='" + data.data.movies[0].medium_cover_image + "'/></p>"));
        } else {
            voiceAssistant.say(sorrymess);
        }

    });
}

function getReadableTime() {
    var d = new Date();
    var hour = d.getHours();
    var isAfterNoon = false;
    if (hour >= 12) {
        isAfterNoon = true;
        if (hour >= 13) {
            hour -= 12;
        }
    }

    hour = hour < 10 ? "0" + hour : hour;
    var minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : "" + d.getMinutes();

    return hour + ":" + minutes + (isAfterNoon ? " PM" : " AM");
}

//get fact answer
function getFactAnswer(searchTerm, foundmess) {
    const url = 'http://api.duckduckgo.com/';
    const params = {
        q: searchTerm,
        format: 'json',
        pretty: '1'
    }
    $.ajax({
        dataType: "jsonp",
        type: "GET",
        url: url,
        data: params,
        async: false,
        success: function (response) {
            console.log(response);
            voiceAssistant.say(foundmess);
            if (response.Abstract != "") {
                $("#chat").append($("<p class='triangle-right left color-orange'></p>").text(response.Abstract));
                $("#chat").append($("<p class='triangle-right left color-orange'><img src='" + response.Image + "'/></p>"));
            } else {
                $("#chat").append($("<p class='triangle-right left color-orange'>" + response.RelatedTopics[0].Result + "</p>"));
                $("#chat").append($("<p class='triangle-right left color-orange'><img src='" + response.RelatedTopics[0].Icon.URL + "'/></p>"));
                //voiceAssistant.say("Sorry. I can't find anything that you said!");
            }
        }
    });
}
function wikisearch(topic) {

    var processed = topic.replace(/ /g, '%20');
    var url = 'https://en.wikipedia.org/w/api.php?action=query&' +
        'prop=extracts&format=json&exintro=&titles=' + processed

    $.ajax({
        type: "GET",
        url: url,
        async: false,
        dataType: "jsonp",
        contentType: "application/json",
        success: function (data) {
            var page = Object.values(data.query.pages)[0];
            if (page.extract.length > 0) {
                modalOpened = true;
                respond('Searching \'' + topic + '\' on Wikipedia...');

                $('#modal-title').html(page.title);
                $('#modal-content').html(page.extract);

                $('html').addClass('is-clipped');
                $('#modal-ter').animateCss('fadeIn');
                $('#modal-ter').addClass('is-active');
            } else {
                respond('I couldn\'t find \'' + topic + '\' on Wikipedia. 😅' +
                    'Searching on Google...');
                window.open('https://www.google.com/#q=' + processed);
            }
        },
        error: function () {
            googleSearch(processed);
        }
    });
}
function googleSearch(topic) {
    if (listening) {
        respond('Searching \'' + topic + '\' on Google...');
        var processed = topic.replace(/ /g, '%20');
        window.open('https://www.google.com/#q=' + processed);
        listening = false;
    }
};
function chatbot(req, res, next) {
    console.log("sending " + req.query.message);
    var options = {
        method: 'POST',
        url: 'https://directline.botframework.com/v3/directline/conversations/' + req.query.conversationId + '/activities',
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: 'Bearer WcFG7BU0RCE.cwA.1uk.8bNNt3eyMp_lhDSy2T1EffLLR7kjv4lRkT5YCOZsTKE'
        },
        body: { type: 'message', from: { id: 'user1' }, text: req.query.message },
        json: true
    };

    request(options, function (error, response, body) {
        if (error) {
            console.log(error);
            res.send("error");
        } else {
            res.send("ok");
        }
    });
}
function getFlight(orginplace, desplace, dateflight, mess) {
    //https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=qNZ1Q2UTdMGfGCbODTFPNkGZzwDvJNju&
    //origin=SGN&destination=HAN&departure_date=2017-08-25&return_date=2017-08-30
    const url = 'https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search';
    const params = {
        apikey: amadeuskey,
        origin: orginplace,
        destination: desplace,
        departure_date: dateflight,
        currency: 'USD',
        travel_class: 'ECONOMY',
        number_of_results: 1,
    }
    console.log(url);
    $.ajax({
        dataType: "json",
        type: "GET",
        url: url,
        data: params,
        async: false,
        success: function (response) {
            console.log(response);
            voiceAssistant.say(mess);
            $("#chat").append($("<p class='triangle-right left color-orange'></p>").text('Total Price: ' + response.results[0].fare.total_price));
            $("#chat").append($("<p class='triangle-right left color-orange'></p>").text('Airline: ' + response.results[0].itineraries[0].outbound.flights[0].operating_airline));
            $("#chat").append($("<p class='triangle-right left color-orange'></p>").text('Flight Number: ' + response.results[0].itineraries[0].outbound.flights[0].flight_number));
            $("#chat").append($("<p class='triangle-right left color-orange'></p>").text('Seat Remaining: ' + response.results[0].itineraries[0].outbound.flights[0].booking_info.seats_remaining));
            $("#chat").append($("<p class='triangle-right left color-orange'></p>").text('Depart Time: ' + response.results[0].itineraries[0].outbound.flights[0].departs_at));
        }
    });
};
function cookrecipe(searchTerm, mess) {
    const url = 'https://api.edamam.com/search';

    const params = {
        app_id: recipe_id,
        app_key: recipe_key,
        q: searchTerm,
        from: 0,
        to: 3
    }
    console.log(url);
    $.ajax({
        dataType: "json",
        type: "GET",
        url: url,
        data: params,
        async: false,
        success: function (response) {
            console.log(response);
            voiceAssistant.say(mess);
            var listrecipe = response.hits;
            console.log(listrecipe);
            for (i = 0; i < listrecipe.length; i++) {

                var resulttext = "";
                // var ingredient = "";

                // for (i = 0; i < listrecipe[i].recipe.ingredientLines.length; i++) {
                //     ingredient += listrecipe[i].recipe.ingredientLines[i] + " ";
                // }
                resulttext += "Name: " + listrecipe[i].recipe.label;
                resulttext += " Url: " + listrecipe[i].recipe.url;
                //resulttext += " IngredientLines: " + ingredient;

                $("#chat").append($("<p class='triangle-right left color-orange'></p>").text(resulttext));
                $("#chat").append($("<p class='triangle-right left color-orange'>Recipe Image: </br><img src='" + listrecipe[i].recipe.image + "'/></p>"));
            }
        }
    });
};
function getFlightQPX(orginplace, desplace, dateflight, mess) {

    var FlightRequest = {
        "request": {
            "slice": [
                {
                    "origin": orginplace,
                    "destination": desplace,
                    "date": dateflight
                }
            ],
            "passengers": {
                "adultCount": 1,
                "infantInLapCount": 0,
                "infantInSeatCount": 0,
                "childCount": 0,
                "seniorCount": 0
            },
            "solutions": 5,
            "refundable": false
        }
    };

    $.ajax({
        type: "POST",
        //Set up your request URL and API Key.
        url: "https://www.googleapis.com/qpxExpress/v1/trips/search?key=" + qpxkey,
        contentType: 'application/json', // Set Content-type: application/json
        dataType: 'json',
        // The query we want from Google QPX, This will be the variable we created in the beginning
        data: JSON.stringify(FlightRequest),
        success: function (data) {
            //Once we get the result you can either send it to console or use it anywhere you like.
            //console.log(data);
            voiceAssistant.say(mess);
            console.log(data.trips.tripOption);
            var listfare = data.trips.tripOption;
            for (i = 0; i < listfare.length; i++) {
                //console.log(listfare[0].pricing);
                var resulttext = "";

                resulttext += "From: " + listfare[0].slice[0].segment[0].leg[0].origin;
                resulttext += " To: " + listfare[0].slice[0].segment[0].leg[0].destination;
                resulttext += " Fare Price:  " + listfare[0].pricing[0].saleFareTotal;
                resulttext += " Total: " + listfare[0].pricing[0].saleTotal;
                resulttext += " Carrier: " + listfare[0].slice[0].segment[0].flight.carrier;
                resulttext += " Flight number: " + listfare[0].slice[0].segment[0].flight.number;
                resulttext += " Depart: " + listfare[0].slice[0].segment[0].leg[0].departureTime;
                resulttext += " Arrival: " + listfare[0].slice[0].segment[0].leg[0].arrivalTime;
                resulttext += " Duration: " + listfare[0].slice[0].segment[0].leg[0].duration;
                $("#chat").append($("<p class='triangle-right left color-orange'></p>").text(resulttext));
            }
            //console.log(JSON.stringify(data));

        },
        error: function () {
            //Error Handling for our request
            console.log("Access to Google QPX Failed.");
        }
    });

};
