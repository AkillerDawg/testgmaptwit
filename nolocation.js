function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed. Enter your Address in the search bar.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation. Try Chrome or Firefox';
    }
    var options = {
        map: map,
        position: new google.maps.LatLng(41.4994, 81.6956),
        content: content
    };
    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}
Mixpanel
