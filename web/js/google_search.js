/**
 * Created by NK on 2016. 5. 3..
 */
// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

var infowindow;
var map;
var markers = [];

function initAutocomplete() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.496375, lng: 126.9546903},
        zoom: 15,
    });


    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    // [START region_getplaces]
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];
        deleteAllTable();

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        var place = places[0];
        refreshHeaderLabel(place);
        service.nearbySearch({
            location: place.geometry.location,
            radius: 500
            //types: ['store']
        }, callback);
        map.setCenter(place.geometry.location)
    });
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
            addRow(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    markers.push(marker);

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function createTable(place) {
    var table = document.getElementById('placeTable');
    var rowlen = table.rows.length;
    var row = table.insertRow(rowlen - 1);
    row.insertCell(0).innerHTML = place.name;

}
function addRow(place) {
    var placeType = place.types[0]
    $('#placeTable > tbody:last').append(
        '<tr>' +
        '<td class="col-xs-5">' + place.name + '</td>' +
        '<td class="col-xs-4">' + place.types[0] + '</td>' +
        '<td class="col-xs-3"> ' +
        '<button type="button" class="btn btn-default" value = ' + placeType + ' onClick="openConceptNet(this)">ConceptNet</button>' +
        '</td>' +
        '</tr>');
}

function deleteAllTable() {
    $('#placeTable > tbody:last').empty();

}

function openConceptNet(btnValue) {
    var url = 'http://conceptnet5.media.mit.edu/web/c/en/' + btnValue.value;
    window.open(url);
}

function openNell(btnValue) {
    var url = 'http://rtw.ml.cmu.edu/rtw/kbbrowser/special:asknell?q=' +btnValue.value;
    window.open(url);
}

function refreshHeaderLabel(place){
    var inputText = document.getElementById("pac-input").value;
    $('#head_label').empty();
    $('#head_label').append(
        '<h2>'+"Search Text : "+ inputText + '</h2>' +
        '<p> Lat, Lng : ' + place.geometry.location +'</p>'
    );
}