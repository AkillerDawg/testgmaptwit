var map;
var mapOptions = {
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    minZoom: 10
};
var input = document.getElementById('target');
var searchBox = new google.maps.places.SearchBox(input);
var useragent = navigator.userAgent;
var mapdiv = document.getElementById("map_canvas");
var markers = [];

function detectBrowser() {
    if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1) {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '100%';
    } else {
        mapdiv.style.width = '600px';
        mapdiv.style.height = '800px';
    }
}

function initialize() {
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    var input = /** @type {HTMLInputElement} */ (
        document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */
        (input));

    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();
        for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
        }
        markers = [];

        // fit the map
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            var marker = new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location
            });
            markers.push(marker);

            //remove old tweets
            $('#jstweets').empty();

            var x = place.geometry.location.lat();
            var y = place.geometry.location.lng();

            //add new tweets
            getTweets(place.geometry.location);
            //getTweets(x,y);                        

            bounds.extend(place.geometry.location);
        }
        map.fitBounds(bounds);

        //fix for map zooming in too far
        var listener = google.maps.event.addListener(map, "idle", function() {
            if (map.getZoom() > 16) map.setZoom(14);
            google.maps.event.removeListener(listener);
        });
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(pos);

            var marker = new google.maps.Marker({
                map: map,
                title: "You are here",
                position: pos
            });
            marker.setMap(map);
            getTweets(pos);
        }, function() {
            handleNoGeolocation(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
}
google.maps.event.addDomListener(window, 'load', initialize);
Mixpanel
