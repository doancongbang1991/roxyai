! function (e) {
    function o() {
        var e = window.devicePixelRatio || 1,
            o = 12 * e,
            t = document.createElement("canvas");
        if (!t.getContext || !t.getContext("2d") || "function" != typeof t.getContext("2d").fillText)
            return !1;
        var n = t.getContext("2d");
        return n.fillStyle = "#f00",
            n.textBaseline = "top",
            n.font = "32px Arial",
            n.fillText("🐨", 0, 0),
            0 !== n.getImageData(o, o, 1, 1).data[0]
    }

    function t(o, t) {
        e(".message__text").text(o),
            s === !0 && e(".message__icon").text(t)
    }
    var n = n || function () {},
        a = e("body");
    n.prototype.toggleContent = function () {
        e(".js .content-toggle").on("click", function () {
            var o = e(this),
                t = "is-active",
                n = e("#" + o.attr("href").substring(1));
            return o.toggleClass(t),
                n.toggleClass(t), !1
        })
    };
    var s = o();
    ! function (e) {
        var o = e.fn.addClass;
        e.fn.addClass = function () {
            for (var e in arguments) {
                var t = arguments[e];
                t && t.constructor && t.call && t.apply && (setTimeout(t.bind(this)),
                    delete arguments[e])
            }
            return o.apply(this, arguments)
        }
    }(jQuery);
    var r = e("body").attr("id"),
        l = e("body").attr("data-env");
    n.prototype.wtfsig = function () {
            function o() {
                Modernizr.geolocation ? (t("getting your fucking location...", "📍"),
                    x.addClass("is-disabled"),
                    navigator.geolocation.getCurrentPosition(s, n, {
                        timeout: 1e4
                    })) : x.removeClass("is-disabled")
            }

            function n(e) {
                x.removeClass("is-disabled"),
                    0 == e.code && t("I have no fucking clue what, but something went wrong", "🖕"),
                    1 == e.code && t("I have no fucking clue what, but something went wrong", "🖕"),
                    2 == e.code && t("You have a shitty signal", "🖕"),
                    3 == e.code ? t("Getting your location took too fucking long", "🖕") : t("Can't find your fucking location", "🖕")
            }

            function s(e) {
                x.addClass("is-disabled");
                var o = e.coords.latitude,
                    t = e.coords.longitude;
                w = new google.maps.LatLng(o, t),
                    l(w)
            }

            function l(e) {
                b = 0,
                    t("Finding places where you can " + r + "...", "🔍"),
                    y = e,
                    console.log(type1),
                    homeMarker = new google.maps.Marker({
                        map: D,
                        position: e,
                        icon: homeIcon
                    });
                var o = {
                    location: e,
                    radius: _,
                    type: [type1]
                };
                K.nearbySearch(o, c)
            }

            function c(e, o) {
                if ("OK" === o) {
                    h = e;
                    var n = {
                        location: w,
                        radius: _,
                        type: [type2]
                    };
                    K.nearbySearch(n, d)
                } else
                    t("Couldn't find shit, try somewhere else.", "🖕"),
                    x.removeClass("is-disabled")
            }

            function d(e, o) {
                "OK" === o ? (T = h.concat(e),
                    console.log(T),
                    v = f(T, "id"),
                    v = v.sort(function () {
                        return Math.random() - .5
                    }),
                    p(v)) : (t("Couldn't find shit, try somewhere else.", "🖕"),
                    x.removeClass("is-disabled"))
            }

            function p(e) {
                placeRef = {
                        reference: e[b].reference
                    },
                    K.getDetails(placeRef, g);
                for (i in k)
                    k[i].setMap(null);
                for (i in C)
                    C[i].setMap(null)
            }

            function g(o, t) {
                window.scroll(0, 0),
                    D.panTo(w),
                    D.setZoom(16),
                    t == google.maps.places.PlacesServiceStatus.OK && (google.maps.event.addListenerOnce(D, "idle", function () {
                            F.setPosition(o.geometry.location),
                                window.setTimeout(function () {
                                    F.setMap(D),
                                        F.setAnimation(google.maps.Animation.DROP)
                                }, 250);
                            var e = new google.maps.LatLngBounds,
                                t = S.height(),
                                n = M.height(),
                                a = homeMarker.getPosition().lat(),
                                i = F.getPosition().lat();
                            i > a && (offsetTopPoint = m(F.getPosition(), 0, t * -1),
                                    offsetBottomPoint = m(homeMarker.getPosition(), 0, n)),
                                i < a && (offsetTopPoint = m(homeMarker.getPosition(), 0, t * -1),
                                    offsetBottomPoint = m(F.getPosition(), 0, n)),
                                offsetTopMarker = new google.maps.Marker({
                                    map: D,
                                    position: offsetTopPoint,
                                    visible: !1
                                }),
                                offsetBottomMarker = new google.maps.Marker({
                                    map: D,
                                    position: offsetBottomPoint,
                                    visible: !1
                                }),
                                e.extend(offsetTopMarker.position),
                                e.extend(offsetBottomMarker.position),
                                D.fitBounds(e),
                                D.panToBounds(e),
                                C.push(offsetTopMarker),
                                C.push(offsetBottomMarker),
                                C.push(F);
                            var s = {
                                origin: y,
                                destination: o.geometry.location,
                                travelMode: google.maps.TravelMode.WALKING
                            };
                            z.route(s, function (e, o) {
                                if (o == google.maps.DirectionsStatus.OK) {
                                    var t, n;
                                    for (n = new google.maps.Polyline({
                                            path: [],
                                            geodesic: !0,
                                            editable: !1,
                                            map: D,
                                            strokeColor: swatch,
                                            strokeWeight: 5,
                                            strokeOpacity: .8
                                        }),
                                        routeLength = e.routes[0].overview_path.length,
                                        timing = 250 / routeLength,
                                        t = 0; t < e.routes[0].overview_path.length; t++)
                                        setTimeout(function (e) {
                                            n.getPath().push(e)
                                        }, timing * t, e.routes[0].overview_path[t]);
                                    k.push(n)
                                }
                            })
                        }),
                        P.addClass("is-changing", function () {
                            o.website ? placeSite = o.website : placeSite = o.url,
                                e("#destination-link-text").text(o.name),
                                e("#destination-link").attr("href", placeSite),
                                e(".map__address").html(o.formatted_address),
                                setTimeout(function () {
                                    e(".ad").toggleClass("ad--alt"),
                                        P.removeClass("is-changing"),
                                        I.removeClass("is-active"),
                                        P.addClass("is-active"),
                                        window.scroll(0, 0),
                                        e(".actions__shit").removeClass("is-disabled")
                                }, 500)
                        }))
            }

            function m(e, o, t) {
                var n = D.getProjection(),
                    a = n.fromLatLngToPoint(e).x + o / Math.pow(2, D.getZoom()),
                    i = n.fromLatLngToPoint(e).y + t / Math.pow(2, D.getZoom()),
                    s = new google.maps.Point(a, i);
                return n.fromPointToLatLng(s)
            }

            function u() {
                x.addClass("is-disabled"),
                    t("Looking for your location", "📍");
                var e = document.getElementById("locationsearch").value;
                R.geocode({
                    address: e
                }, function (e, o) {
                    o == google.maps.GeocoderStatus.OK ? (w = e[0].geometry.location,
                        l(w)) : (t("can't find your fucking location", "🖕"),
                        x.removeClass("is-disabled"))
                })
            }

            function f(e, o) {
                var t = [],
                    n = {};
                for (var a in e)
                    n[e[a][o]] = e[a];
                for (a in n)
                    t.push(n[a]);
                return t
            }
            "eat" === r && (placeIcon = "img/eat/place.png",
                    homeIcon = "img/eat/home.png",
                    type1 = "restaurant",
                    type2 = "cafe",
                    swatch = "#00aba6",
                    statement = "A MEAL FOR WTFSIGTE",
                    noun = "meal",
                    a.addClass("wtfsigte")),
                "drink" === r && (placeIcon = "img/drink/place.png",
                    homeIcon = "img/drink/home.png",
                    type1 = "bar",
                    type2 = "night_club",
                    swatch = "#FF8400",
                    statement = "A DRINK FOR WTFSIGFD",
                    noun = "drink",
                    a.addClass("wtfsigfd"));
            var v, h, y, w, C = [],
                k = [],
                b = 0,
                _ = 1e3,
                T = [],
                P = e("#recommendation"),
                S = e(".recommendation__destination"),
                M = e(".recommendation__actions"),
                x = e(".locator .form__fieldset"),
                I = e("#location"),
                A = e("#donate"),
                L = e("#app"),
                O = [{
                    featureType: "all",
                    stylers: [{
                        saturation: -100
                    }]
                }],
                B = {
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    styles: O,
                    mapTypeControl: !1,
                    zoomControl: !0,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.RIGHT_CENTER
                    },
                    scaleControl: !1,
                    streetViewControl: !1,
                    overviewMapControl: !1,
                    clickableIcons: !1
                },
                E = {
                    suppressMarkers: !0,
                    polylineOptions: {
                        strokeColor: swatch,
                        strokeWeight: 5,
                        strokeOpacity: .8
                    }
                },
                F = new google.maps.Marker({
                    animation: google.maps.Animation.DROP,
                    optimized: !1,
                    icon: {
                        url: placeIcon,
                        size: new google.maps.Size(61, 61),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(30, 61)
                    }
                }),
                D = new google.maps.Map(document.getElementById("map"), B),
                R = new google.maps.Geocoder,
                K = new google.maps.places.PlacesService(D),
                z = (new google.maps.DirectionsRenderer(E),
                    new google.maps.DirectionsService);
            e(document).ready(function () {
                    e("#locationsearch").focus(function () {
                            t("Where the fuck are you?", "📍")
                        }),
                        o()
                }),
                e(".locator").on("submit", function (e) {
                    u(),
                        e.preventDefault()
                }),
                e(".actions__shit").on("click", function () {
                    return e(this).addClass("is-disabled"),
                        b < v.length - 1 ? b++ : b = 0,
                        p(v),
                        window.scroll(0, 0), !1
                });
            var G = {
                    types: ["geocode"]
                },
                W = document.getElementById("locationsearch");
            autocomplete = new google.maps.places.Autocomplete(W, G),
                e("#donate-btn").on("click", function () {
                    A.addClass("is-active"),
                        window.scroll(0, 1)
                }),
                e("#donate-cancel").on("click", function () {
                    A.removeClass("is-active"),
                        window.scroll(0, 1)
                }),
                e("#app-btn").on("click", function () {
                    L.addClass("is-active"),
                        window.scroll(0, 1)
                }),
                e("#app-cancel").on("click", function () {
                    L.removeClass("is-active"),
                        window.scroll(0, 1)
                }),
                e("#hide-donation-response").on("click", function () {
                    A.removeClass("show-response"),
                        A.removeClass("is-active")
                    window.scroll(0, 1)
                }),
                e(".actions__wrong").on("click", function () {
                    P.removeClass("is-active"),
                        I.addClass("is-active"),
                        t("Where the fuck are you? ", "📍"),
                        x.removeClass("is-disabled"),
                        homeMarker.setMap(null),
                        e("#locationsearch").val(""),
                        window.scroll(0, 1)
                })
        },
        n.prototype.donate = function () {
            function o(o, a) {
                if (a.error)
                    e("#stripe-form").addClass("is-active"),
                    n.find(".form__errors").text(a.error.message),
                    n.find(".submit").prop("disabled", !1)
                else {
                    e("#donate").addClass("is-loading"),
                        e("#stripe-form").removeClass("is-active"),
                        t("Wait the fuck up", "💸");
                    var i = a.id,
                        s = n.find(".input:checked + .label .desc").text();
                    n.append(e('<input type="hidden" name="stripeToken">').val(i)),
                        n.append(e('<input type="hidden" name="description">').val(s)),
                        n.append(e('<input type="hidden" name="statement">').val(statement)),
                        e.ajax({
                            type: "post",
                            url: "charge.php",
                            data: n.serialize(),
                            success: function (o) {
                                n.trigger("reset"),
                                    e(".donation-response__message").html(o),
                                    e("#donate").addClass("show-response"),
                                    e("#donate").removeClass("is-loading"),
                                    n.find(".form__errors").text(""),
                                    n.find(".submit").prop("disabled", !1),
                                    e("#stripe-form").removeClass("is-active"),
                                    window.scroll(0, 1)
                            },
                            error: function (o, t, a) {
                                n.find(".form__errors").text("Something fucked up. Try again"),
                                    e("#donate").removeClass("is-loading")
                            }
                        })
                }
            }
            "development" === l ? Stripe.setPublishableKey("pk_test_ZqOHtPOG6NFafkzNeSvFGb6W") : "production" === l && Stripe.setPublishableKey("pk_live_FDC2BzNWmIL9F5YzTKII5Jwy"),
                Stripe.applePay.checkAvailability(function (o) {
                    function t() {

                        var o = {
                                countryCode: "US",
                                currencyCode: "USD",
                                total: {
                                    label: "FOR " + statement,
                                    amount: paymentValue + ".00"
                                }
                            },
                            t = Stripe.applePay.buildSession(o, function (o, t) {
                                e.post("/charge.php", {
                                    stripeToken: o.token.id
                                }).done(function () {
                                    t(ApplePaySession.STATUS_SUCCESS),
                                        n.trigger("reset"),
                                        e(".donation-response__message").html("<p class='icon'>👍</p><p class='large'>You're a fucking legend <br> Thanks for the fucking " + noun + "!"),
                                        e("#donate").addClass("show-response"),
                                        e("#donate").removeClass("is-loading"),
                                        n.find(".form__errors").text(""),
                                        n.find(".submit").prop("disabled", !1),
                                        e("#stripe-form").removeClass("is-active"),
                                        window.scroll(0, 1)
                                }).fail(function () {
                                    t(ApplePaySession.STATUS_FAILURE),
                                        n.find(".form__errors").text("Something fucked up. Try again")
                                })
                            }, function (e) {
                                n.find(".form__errors").text("Something fucked up. Try again")
                            });
                        t.begin()
                    }
                    o && (console.log("apple pay available"),
                        document.getElementById("apple-pay-form").style.display = "block",
                        document.getElementById("apple-pay-button").addEventListener("click", t))
                });
            var n = e("#payment-form");
            e(".cc-number").payment("formatCardNumber"),
                e(".cc-exp").payment("formatCardExpiry"),
                e(".cc-cvc").payment("formatCardCVC"),
                n.find(".input--radio").on("click", function () {
                    e("#stripe-form").addClass("is-active"),
                        e("#payment-confirm").val("SHUT UP AND TAKE MY FUCKING $" + e(this).find(" + .label .value").text()),
                        paymentValue = e(this).find(" + .label .value").text()
                }),
                n.submit(function (e) {
                    return n.find(".submit").prop("disabled", !0),
                        window.scroll(0, 1),

                        Stripe.card.createToken(n, o), !1
                })
        },
        n.prototype.toggleContent(),
        n.prototype.wtfsig(),
        n.prototype.donate()
}(jQuery);