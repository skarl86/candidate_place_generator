/**
 * Created by Namgee on 2016. 5. 11..
 */
function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    deleteLogTable();
    deletePlaceTable();
    resetMap();

    for (var i = 0, f; f = files[i]; i++) {
        //var output = createGPSData(files[i]);
        createPlaceData(files[i]);
        //var output = createDurationTime(files[i]);
    }
}

var places = [];
var placeDic = {};

function createPlaceData(file) {
    var reader = new FileReader();
    places = [];
    reader.onload = function(progressEvent){
        var lines = this.result.split('\n');

        for(var n = 0; n < lines.length; n++){
            var elements = lines[n].split('\t');
            var date = elements[0];
            var lat = roundXL(parseFloat(elements[1]),4);
            var lng = roundXL(parseFloat(elements[2]),4);
            var label = elements[3];

            var place = {id:n, date:date, lat:lat, lng:lng, label:label.replace("\n","")};
            places.push(place);
            placeDic[[lat, lng].join()] = place;

            addLogRow(place);
        }
        getNearbySearchAtPlace()
        // loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyD4efBm5pPQFojapLkNtg71AOY2246SJrU&signed_in=true&callback=getNearbySearchAtPlace');
    };

    reader.readAsText(file);
}

function addLogRow(place) {
    $('#logTable > tbody:last').append(
        '<tr>' +
        '<td class="col-xs-4">' + place.date + '</td>' +
        '<td class="col-xs-5">' +
        '<a id="myLink" href="#" onclick="selectedLink(this.text, markersDic ,false);return false;">' + [place.lat, place.lng].join() + '</a></td>' +
        '<td class="col-xs-4">' + place.label + '</a></td>' +
            // '<td class="col-xs-3"> ' +
            // '<button type="button" class="btn btn-default" value = ' + placeType + ' onClick="openConceptNet(this)">ConceptNet</button>' +
        '</tr>');
}
function deleteLogTable(){
    $('#logTable > tbody:last').empty();
}

function loadScript(src){
    var script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
    script.src = src;
}

$(function() {

    $('#sel1').on('change', function(){
        var selected = $(this).find("option:selected").val();
        console.log(selected);
    });

});

document.getElementById('files').addEventListener('change', handleFileSelect, false);
// $('#file #file')e.addEventListener('change', handleFileSelect, false);