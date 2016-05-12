/**
 * Created by Namgee on 2016. 5. 11..
 */

var map;
var markers = [];

function getNearbySearchAtPlace() {
    var bounds = new google.maps.LatLngBounds();

    places.forEach(function (place) {
        var myLatLng = new google.maps.LatLng(place.lat, place.lng);

        bounds.extend(myLatLng);
    });
    console.log(bounds.getCenter());
    if(map == null){
        map = new google.maps.Map(document.getElementById('map-canvas'),{
            zoom: 12
        });
    }

    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);

    markers.forEach(function(marker) {
        marker.setMap(null);
    });
    markers = [];

    places.forEach(function (place) {
        var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h2 id="firstHeading" class="firstHeading">'+place.date+'</h2>'+
            '<div id="bodyContent">'+
            '<p>Label : <b>'+ place.label +'</b></p>'+
            '<p>Location : <b>'+ [place.lat, place.lng].join() +'</b></p>'+
            '</div>'+
            '</div>';
        var infowindow = new google.maps.InfoWindow({
            content:contentString
        });
        var marker = new google.maps.Marker({
            map: map,
            icon: "image/staying.png",
            position: {lat: place.lat, lng: place.lng}
        });
        markers.push(marker);

        google.maps.event.addListener(marker,'click', (function(place){
            return function() {
                deleteAllTable();

                infowindow.open(map,marker);

                // requestNearbyPlace(place);

                refreshHeaderLabel(place);

                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch({
                    location: {lat: place.lat, lng: place.lng},
                    radius: 500,
                    // name: place.label
                    types: ['store','bank'],
                    rankby: google.maps.places.RankBy.DISTANCE
                }, callback);
            };
        })(place));
    });
}

function callback(results, status, pagination) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            addRow(results[i]);
        }
    }
    if (pagination.hasNextPage) {
        sleep:2;
        pagination.nextPage();
    }
}

function refreshHeaderLabel(place) {
    $('#head_label').empty();
    $('#head_label').append(
        "Label  : " + place.label+
        '<p> Lat, Lng : ' + [place.lat, place.lng].join() + '</p>'
    );
}

function addRow(place) {
    var placeType = place.types[0]
    $('#placeTable > tbody:last').append(
        '<tr>' +
        '<td class="col-xs-5">' + place.name + '</td>' +
        '<td class="col-xs-4">' + place.types[0] + '</td>' +
        // '<td class="col-xs-3"> ' +
        // '<button type="button" class="btn btn-default" value = ' + placeType + ' onClick="openConceptNet(this)">ConceptNet</button>' +
        '</td>' +
        '</tr>');
}
function deleteAllTable() {
    $('#placeTable > tbody:last').empty();
}

