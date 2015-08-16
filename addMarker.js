var timeline = [];

function getTweets(pos) {
    $.getJSON('/akhil_anumolu/oa.php?url=' + encodeURIComponent('search/tweets.json?geocode=' + pos.lat() + '%2C' + pos.lng() + '%2C2mi&count=100')).done(function(data) {
        timeline.push(data.statuses);
        setMarker(data);
        //console.log(pos);
    });
}

// used when clicking on marker

function bindInfoW(marker, contentString, infowindow) {
    google.maps.event.addListener(marker, 'click', function() {
        var timeline = [];
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
    });
}

function setMarker(data) {
    for (i = 0; i < data.statuses.length; i++) {
        if (data.statuses[i].geo != null) {
            var dat = data.statuses[i];
            var sn = dat.user.screen_name;
            var msg = dat.text;
            var avi = dat.user.profile_image_url;
            var handle = "http://www.twitter.com/" + sn;
            var dt = "<br><br><right><small>" + dat.created_at + "</small></right>";

            var aviLink = "<a href='" + handle + "' target='_blank'><img class='avi' src=" + avi + "></img></a>";
            var wLogo = aviLink + "<a href='" + handle + "' target='_blank'>@" + sn + "</a>: " + dat.text + dt;
            var tweet = "<a href='" + handle + "' target='_blank'>@" + dat.user.screen_name + "</a>:" + dat.text;
            var bq = "<blockquote class=\"twitter-tweet\"><a href=\"https://twitter.com/" + sn + "/status/" + dat.id + "\"></a></blockquote>";

            var pinIcon = new google.maps.MarkerImage(
                avi,
                null, /* size is determined at runtime */
                null, /* origin is 0,0 */
                null, /* anchor is bottom center of the scaled image */
                new google.maps.Size(52, 52)
            );

            var marker = new google.maps.Marker({
                map: map,
                icon: pinIcon,
                title: msg,
                position: new google.maps.LatLng(data.statuses[i].geo.coordinates[0], data.statuses[i].geo.coordinates[1])
            });

            marker.setAnimation(google.maps.Animation.DROP);
            var infowindow = new google.maps.InfoWindow;
            bindInfoW(marker, wLogo, infowindow);

            var template = "<tr class='tweet' data-id='" + data.statuses[i].id + "' ><td>" + aviLink + "</td><td>" + tweet + "</td></tr>";

            $("tbody#jstweets").prepend(template);
        }
    }
}
