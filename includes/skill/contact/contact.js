function getContact(searchstr) {
    gapi.auth.authorize(gcontact_config, function () {
        fetch(gapi.auth.getToken(), searchstr);
    });
}

function fetch(token, searchstr) {
    contacts = '';
    //rescontacts = [];
    $.ajax({
        url: "https://www.google.com/m8/feeds/contacts/default/full",
        data: {
            access_token: token.access_token,
            'max-results': '1000',
            q: searchstr,
            alt: 'json'
        },
        async: false,
        dataType: "jsonp",
        success: function (data) {
            //console.log(JSON.stringify(data));
            console.log(data);
            contacts = data.feed.entry;
            contacts.forEach(function (contact) {
                if ((new RegExp(searchstr)).test(contact.title.$t.toLowerCase())) {
                    console.log(contact);
                    //$("#chat").append($("<p class='triangle-right left color-orange'></p>").text('Name: ' + contact.title.$t));
                    phonenumbers = '';
                    contactnumbers = contact.gd$phoneNumber;
                    console.log(contactnumbers);
                    if (contactnumbers !== undefined) {
                        $("#chat").append($("<p class='triangle-right left color-orange'></p>").text('Found ' + contactnumbers.length + ' contacts'));
                        contactnumbers.forEach(function (phonenumber) {
                            phonenumbers += phonenumber.$t + ', ';
                        });
                        $("#chat").append($("<p class='triangle-right left color-orange'></p>").text('Name: ' + contact.title.$t + '. Phone Number: ' + phonenumbers));
                    } else {
                        $("#chat").append($("<p class='triangle-right left color-orange'></p>").text('Name: ' + contact.title.$t + '. No Number'));
                    }
                }
            });
        }
    });
}