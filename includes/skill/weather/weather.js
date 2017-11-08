function getCountry() {
    countryurl = 'http://ipinfo.io';
    loc_string = '';
    $.ajax({
        dataType: "json",
        url: countryurl,
        async: false,
        success: function (data) {
            loc_string = data.city + ',' + data.country;
        }
    });
    return loc_string;
}

function get_new_day_index(forcasted_day) {
    if (forcasted_day.toUpperCase().trim() == 'MONDAY') {
        return 1
    } else if (forcasted_day.toUpperCase().trim() == 'TUESDAY') {
        return 2
    } else if (forcasted_day.toUpperCase().trim() == 'WEDNESDAY') {
        return 3
    } else if (forcasted_day.toUpperCase().trim() == 'THURSDAY') {
        return 4
    } else if (forcasted_day.toUpperCase().trim() == 'FRIDAY') {
        return 5
    } else if (forcasted_day.toUpperCase().trim() == 'SATURDAY') {
        return 6
    }
    return 7
}

//weatherResp("weather in Ho Chi Minh");

function getWeather(url, key, query) {
    resweather = '';
    $.ajax({
        dataType: "json",
        url: url,
        data: {
            appid: key,
            q: query,
            units: "metric"
        },
        async: false,
        success: function (response) {
            resweather = response;
        }
    });
    return resweather;
}

function get_index_from_day() {
    const d = new Date();
    return d.getDay()
}

function weatherResp(query) {
    const api_opnw = 'http://api.openweathermap.org/data/2.5/weather'
    const api_opnw_in = 'http://api.openweathermap.org/data/2.5/weather'
    const api_opnw_on = 'http://api.openweathermap.org/data/2.5/forecast'
    var resweather = "";
    var country = "";
    index = "";

    forcast = false;
    current_loc = getCountry();
    if (!current_loc || current_loc == '') {
        current_loc = 'ho chi minh city,vn'
    }
    //open weather api key
    key = open_weather_key;

    if (query.indexOf(' in ') != -1) {
        country = query.split(' in ')[1]
        if (country && country != '') {
            resweather = getWeather(api_opnw_in, key, country);
        } else {
            resweather = getWeather(api_opnw, key, current_loc);
        }
    } else if (query.indexOf(' for ') != -1 || query.indexOf(' on ') != -1) {
        country = query.split(' on ')[1]

        forcast = true

        if (!country) {
            country = query.split(' for ')[1]
        }

        if (country.indexOf(' tomorrow') != -1) {
            index = get_index_from_day() + 1
        } else {
            index = get_index_from_day(country)
        }
        resweather = getWeather(api_opnw_on, key, current_loc);
        forcast = true
    } else if (query.indexOf(' tomorrow') != -1) {
        index = get_index_from_day() + 1
        forcast = true
        resweather = getWeather(api_opnw_on, key, current_loc);
    } else {
        resweather = getWeather(api_opnw, key, current_loc);
    }
    result = resweather;
    weather_cond = "";
    temp = "";
    condition = "";
    message = "";

    if (forcast) {
        weather_cond = result.list[index];
        temp = Math.floor(result.list[index].main.temp).toString() + '°C';
        condition = weather_cond.weather[0].main;
    } else {
        weather_cond = result.weather[0];
        temp = Math.floor(result.main.temp).toString() + '°C';
        condition = weather_cond.main;
    }

    if (condition == 'Clear') {
        message = 'It is currently <temp> and <condition>'
    } else {
        message = 'It is currently <temp> with <condition>'
    }

    if (forcast) {
        message = message.replace('It is currently', 'It will be')
    }

    let weather = message.replace('<temp>', temp)
    weather = weather.replace('<condition>', condition)

    if (country && country != '' && !forcast) {
        weather = weather + ' in ' + country
    } else if (country && country != '' && forcast) {
        if (country.trim() != 'tomorrow') {
            weather = weather + ' on ' + country
        }
    }

    if (query.indexOf('tomorrow') != -1 && weather.indexOf('tomorrow') == -1) {
        weather += ' tomorrow'
    }

    if (query.indexOf('temperature') != -1 && weather.indexOf('and') != -1) {
        var con_string = ' and ' + condition
        weather = weather.replace(con_string, '')
    } else if (query.indexOf('temperature') != -1) {
        var con_string = ' with ' + condition
        weather = weather.replace(con_string, '')
    }
    return weather;
}