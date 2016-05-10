/**
 * Created by NK on 2016. 5. 2..
 */
// This example creates a 2-pixel-wide red polyline showing the path of William
// Kingsford Smith's first trans-Pacific flight between Oakland, CA, and
// Brisbane, Australia.

var markerImg = {
    Walking:"image/walking.png",
    Bus:"image/car.png",
    Stay:"image/staying.png"
};

var testMarker = [
    {lat:37.4995781, lng:127.01092512},
    {lat:37.49445082, lng:126.96054889}
];

var testContent1 = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">20140930082910</h1>'+
    '<div id="bodyContent">'+
    '<p>Activity Type : <b>Stay</b></p>'+
    '<p>Location : <b>37.4995781,127.01092512</b></p>'+
    '</div>'+
    '</div>';

var testContent2 = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">20140930094936</h1>'+
    '<div id="bodyContent">'+
    '<p>Activity Type : <b>Stay</b></p>'+
    '<p>Location : <b>37.49445082,126.96054889</b></p>'+
    '</div>'+
    '</div>';
function initCircleMap(durationData){
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: {lat:37.50040792,lng:127.01275707}//{lat: 37.090, lng: -95.712}
    });

    for(var loc in durationData){
        // Construct the circle for each value in citymap.
        // Note: We scale the area of the circle based on the population.
        // Add the circle for this city to the map.
        var location = loc.split(",");
        var lat = parseFloat(location[0]);
        var lng = parseFloat(location[1]);

        var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: {lat:lat, lng:lng},
            radius: durationData[loc] * 10
        });
    }
}
function initMap(gpsData) {

    /*
    * {"20140930081757":[
    *                       {"GPS":{
    *                               "lat":37.9293892,
    *                               "lng":127.9283945
    *                               }
    *                       },
    *                       {"ACTION":"Stay"}
    *                   ]
    * */
    var coord = {};
    var times = [];
    var paths = [];
    var actions = [];
    for (var date in gpsData){
        var elements = gpsData[date];
        var gps = elements[0];
        var lat = gps['lat'];
        var lng = gps['lng'];

        times.push(date);

        var action = elements[1];

        if(!coord['gps']){
            coord['gps'] = [];
        }
        if(lat != 0.0 && lng != 0.0){
            paths.push(gps);
            actions.push(action['ACTION']);
        }
    }
    var center = coord[0];

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: paths[paths.length / 2]
    });

    var flightPath = new google.maps.Polyline({
        path: paths,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    for(var i = 0; i < actions.length; i++)
    {
        var path = paths[i];
        var action = actions[i];
        var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">'+times[i]+'</h1>'+
            '<div id="bodyContent">'+
            '<p>Activity Type : <b>'+ actions[i] +'</b></p>'+
            '<p>Location : <b>'+ [path['lat'], path['lng']].join() +'</b></p>'+
            '</div>'+
            '</div>';
        var infowindow = new google.maps.InfoWindow({
            content:contentString
        });

        //if(action == 'Stay'){
            var marker = new google.maps.Marker({
                position: path,
                map: map,
                icon:markerImg[action]
            });

            google.maps.event.addListener(marker,'click', (function(marker,contentString,infowindow){
                return function() {
                    infowindow.setContent(contentString);
                    infowindow.open(map,marker);
                };
            })(marker,contentString,infowindow));
        //}
    }

    //var marker1 = new google.maps.Marker({
    //    position: testMarker[0],
    //    map: map,
    //    icon:markerImg['Stay']
    //});
    //
    //var marker2 = new google.maps.Marker({
    //    position: testMarker[1],
    //    map: map,
    //    icon:markerImg['Stay']
    //});
    //var infowindow1 = new google.maps.InfoWindow({
    //    content:contentString
    //});
    //google.maps.event.addListener(marker1,'click', (function(marker1,testContent1,infowindow1){
    //    return function() {
    //        infowindow1.setContent(testContent1);
    //        infowindow1.open(map,marker1);
    //    };
    //})(marker1,testContent1,infowindow1));
    //
    //var infowindow2 = new google.maps.InfoWindow({
    //    content:contentString
    //});
    //google.maps.event.addListener(marker2,'click', (function(marker2,testContent2,infowindow2){
    //    return function() {
    //        infowindow2.setContent(testContent2);
    //        infowindow2.open(map,marker2);
    //    };
    //})(marker2,testContent2,infowindow2));


    flightPath.setMap(map);
}