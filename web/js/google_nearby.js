/**
 * Created by Namgee on 2016. 5. 11..
 */

var map;

var markers = [];
var markersDic = {};

var nearMarkers = [];
var nearMarkersDic = {};

var nearByCircle;
var allResults = [];
var target = $('#loading');

var logInfoWindow;
var placeInfoWindow;

function getNearbySearchAtPlace() {
    var bounds = new google.maps.LatLngBounds();

    places.forEach(function (place) {
        var myLatLng = new google.maps.LatLng(place.lat, place.lng);

        bounds.extend(myLatLng);
    });
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

    logInfoWindow = new google.maps.InfoWindow();

    places.forEach(function (place) {


        var marker = new google.maps.Marker({
            map: map,
            title: place.label,
            icon: "image/staying.png",
            position: {lat: place.lat, lng: place.lng}
        });
        markers.push(marker);
        markersDic[[place.lat, place.lng].join()] = marker;

        google.maps.event.addListener(marker,'click', (function(place){
            return function() {

                target.loadingOverlay();

                var location = {lat: place.lat, lng: place.lng};
                var radius = 500;
                nearMarkers.forEach(function(marker) {
                    marker.setMap(null);
                });
                nearMarkers = [];

                deleteAllTable();

                var contentString = '<div id="content">'+
                    '<div id="siteNotice">'+
                    '</div>'+
                    '<h2 id="firstHeading" class="firstHeading">'+place.date+'</h2>'+
                    '<div id="bodyContent">'+
                    '<p>Label : <b>'+ place.label +'</b></p>'+
                    '<p>Location : <b>'+ [place.lat, place.lng].join() +'</b></p>'+
                    '</div>'+
                    '</div>';

                logInfoWindow.setContent(contentString);
                logInfoWindow.open(map,marker);

                // requestNearbyPlace(place);

                refreshHeaderLabel(place);

                if(nearByCircle != null)
                {
                    nearByCircle.setMap(null);
                }

                nearByCircle = new google.maps.Circle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    map: map,
                    center: location,
                    radius: radius
                });

                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch({
                    location: location,
                    radius: radius,
                    //name: place.label,
                    types: ['cafe','bank','bakery','restaurant','university','school','pharmacy','department_store'],
                    rankby: google.maps.places.RankBy.DISTANCE
                }, callback);
            };
        })(place));
    });
}

function callback(results, status, pagination) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        allResults = allResults.concat(results);
    }
    if (pagination.hasNextPage) {
        console.log("has next page");
        sleep:2;
        pagination.nextPage();
    }else{
        for (var i = 0; i < allResults.length; i++) {
            createMarker(allResults[i]);
            addPlaceRow(allResults[i]);
        }
        console.log("not has next page");
        allResults = [];
        target.loadingOverlay('remove');
    }
}

function refreshHeaderLabel(place) {
    $('#head_label').empty();
    $('#head_label').append(
        "Label  : " + place.label+
        '<p> Lat, Lng : ' + [place.lat, place.lng].join() + '</p>'
    );
}

function createMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        title: place.name,
        position: place.geometry.location
    });


    var lat = place.geometry.location.lat();
    var lng = place.geometry.location.lng();

    nearMarkers.push(marker);
    nearMarkersDic[[lat, lng].join()] = marker;

    placeInfoWindow = new google.maps.InfoWindow();

    google.maps.event.addListener(marker, 'click', function() {
        placeInfoWindow.setContent(place.name);
        placeInfoWindow.open(map, this);
    });
}

function addPlaceRow(place) {
    $('#placeTable > tbody:last').append(
        '<tr>' +
        '<td class="col-xs-4">' + place.name + '</td>' +
        '<td class="col-xs-5">' +
        '<a id="myLink" href="#" onclick="selectedLink(this.text, nearMarkersDic ,true);return false;">' + [place.geometry.location.lat(), place.geometry.location.lng()].join() + '</a></td>' +
        '<td class="col-xs-4">' + place.types[0] + '</td>' +
        // '<td class="col-xs-3"> ' +
        // '<button type="button" class="btn btn-default" value = ' + placeType + ' onClick="openConceptNet(this)">ConceptNet</button>' +
        '</td>' +
        '</tr>');
}

function deleteAllTable() {
    $('#placeTable > tbody:last').empty();
}
function selectedLink(location, pMarkersDic, isShowInfo){
    var marker = pMarkersDic[location];
    if(isShowInfo){
        placeInfoWindow.setContent(marker.title);
        placeInfoWindow.open(map, marker);
    }
    map.setCenter(marker.getPosition());
    map.setZoom(17);
}
