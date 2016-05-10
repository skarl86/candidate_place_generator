/**
 * Created by Namgee on 2016. 5. 11..
 */
function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    for (var i = 0, f; f = files[i]; i++) {
        //var output = createGPSData(files[i]);
        createPlaceData(files[i]);
        //var output = createDurationTime(files[i]);
    }
}

var places = [];

function createPlaceData(file) {
    var reader = new FileReader();
    places = [];
    reader.onload = function(progressEvent){
        var lines = this.result.split('\n');

        for(var n = 0; n < lines.length; n++){
            var elements = lines[n].split('\t');
            var date = elements[0];
            var lat = parseFloat(elements[1]);
            var lng = parseFloat(elements[2]);
            var label = elements[3];

            var place = {date:date, lat:lat, lng:lng, label:label};

            places.push(place);
        }
        getNearbySearchAtPlace()
        // loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyD4efBm5pPQFojapLkNtg71AOY2246SJrU&signed_in=true&callback=getNearbySearchAtPlace');
    };

    reader.readAsText(file);
}

function loadScript(src){
    var script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
    script.src = src;
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
// $('#file #file')e.addEventListener('change', handleFileSelect, false);