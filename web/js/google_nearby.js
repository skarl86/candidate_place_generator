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
var allResultsDic = {};

var target = $('#loading');

var selectedLogPlaceGeometry;

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

    resetLogMarker();

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
                searchNearByPlace(place, marker);
            };
        })(place));
    });
}

function resetLogMarker(){
    markers.forEach(function(marker) {
        marker.setMap(null);
    });
    markers = [];
    markersDic = {};
}
function resetNearMarker(){
    nearMarkers.forEach(function(marker) {
        marker.setMap(null);
    });
    nearMarkers = [];
    nearMarkersDic = {};
}

function resetNearByResults(){
    allResults = [];
    allResultsDic = {};
}

function resetMap(){
    resetLogMarker();
    resetNearMarker();

    if(logInfoWindow != null){
        logInfoWindow.close();
    }

    if(placeInfoWindow != null){
        placeInfoWindow.close();
    }

    if(nearByCircle != null) {
        nearByCircle.setMap(null);
    }
    selectedLogPlaceGeometry = null;
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
        allResults.sort(function (p1, p2) {
            var a = parseInt(getDistance(p1.geometry.location, selectedLogPlaceGeometry));
            var b = parseInt(getDistance(p2.geometry.location, selectedLogPlaceGeometry));
            return a-b;
        });

        for (var i = 0; i < allResults.length; i++) {
            var place = allResults[i];
            allResultsDic[place.id] = parseInt(getDistance(place.geometry.location, selectedLogPlaceGeometry));

            createMarker(allResults[i]);
            addPlaceRow(allResults[i]);
        }
        console.log("not has next page");

        sortingByValue(allResultsDic);
        resetNearByResults();

        target.loadingOverlay('remove');
    }
}

function searchNearByPlace(place, marker){
    target.loadingOverlay();

    var location = {lat: place.lat, lng: place.lng};
    var radius = parseInt($("#sel1").find("option:selected").val());

    nearMarkers.forEach(function(marker) {
        marker.setMap(null);
    });
    nearMarkers = [];

    deletePlaceTable();

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
        types: ['food'],
        rankby: google.maps.places.RankBy.DISTANCE
    }, callback);
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
    nearMarkersDic[[roundXL(lat,4), roundXL(lng,4)].join()] = marker;

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
        '<a id="myLink" href="#" onclick="selectedLink(this.text, nearMarkersDic ,true);return false;">' +
        [roundXL(place.geometry.location.lat(),4), roundXL(place.geometry.location.lng(),4)].join() + '</a></td>' +
        '<td class="col-xs-4">' + place.types[0] + '</td>' +
        '<td class="col-xs-3">' + allResultsDic[place.id] + '</td>' +
        // '<td class="col-xs-3"> ' +
        // '<button type="button" class="btn btn-default" value = ' + placeType + ' onClick="openConceptNet(this)">ConceptNet</button>' +
        '</td>' +
        '</tr>');
}

function deletePlaceTable() {
    $('#placeTable > tbody:last').empty();
}
function selectedLink(location, pMarkersDic, isShowInfo){
    var marker = pMarkersDic[location];
    if(isShowInfo){
        placeInfoWindow.setContent(marker.title);
        placeInfoWindow.open(map, marker);
    }else{
        var place = placeDic[location];
        selectedLogPlaceGeometry = new google.maps.LatLng(place.lat, place.lng);
        searchNearByPlace(place, marker);
    }
    map.setCenter(marker.getPosition());
    map.setZoom(17);
}
