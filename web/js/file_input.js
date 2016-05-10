/**
 * Created by NK on 2016. 5. 2..
 */
function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    for (var i = 0, f; f = files[i]; i++) {
        //var output = createGPSData(files[i]);
        var output = createGPSData(files[i]);
        //var output = createDurationTime(files[i]);
    }
    //document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

function createOnlyGPSData(file){
    var reader = new FileReader();
    var coord = [];

    reader.onload = function(progressEvent){
        // Entire file
        //console.log(this.result);

        //20140930081757	PRX	0
        //20140930081757	GPS	37.50040792	127.01275707	123.0	0.0	0.0	0.0
        //20140930081757	ACTION	Stay
        // delimited by TAB

        // By lines
        var lines = this.result.split('\n');

        for(var n = 0; n < lines.length; n++){
            // 빈 라인 필터링 하고..
            if(lines[n].length != 0){
                // GPS 와 Action Log 만 가져온다.
                var elements = lines[n].split('\t');

                // GPS 또는 ACTION
                var value_key = elements[1];
                var dic = {}
                if(value_key == 'GPS'){
                    var lat = parseFloat(elements[2]);
                    var lng = parseFloat(elements[3]);

                    if(lat != 0.0 && lng != 0.0){
                        dic['lat'] = lat;
                        dic['lng'] = lng;

                        coord.push(dic)
                    }
                }
            }
        }
        initMap(coord)
    };
    reader.readAsText(file);
}
function createDurationTime(gpsDict){
    var durationDict = {};

    for(var key in gpsDict){
        var elements = gpsDict[key];
        var gps = elements[0];
        var lat = gps['lat'];
        var lng = gps['lng'];

        var actionDic = elements[1];
        var action = actionDic['ACTION'];

        if(action == "Stay"){
            var newKey = [lat, lng].join();

            if(!durationDict[newKey]){
                durationDict[newKey] = [];
            }
            durationDict[newKey].push(key)
        }
    }

    var durationCountDict = {};

    for(var key in durationDict){
        durationCountDict[key] = parseInt(durationDict[key].length)
    }

    initCircleMap(durationCountDict);

    //console.log(JSON.stringify(durationCountDict));

}
function createGPSData(file){
    var reader = new FileReader();
    var gps_dic = {};

    reader.onload = function(progressEvent){
        // Entire file
        //console.log(this.result);

        //20140930081757	PRX	0
        //20140930081757	GPS	37.50040792	127.01275707	123.0	0.0	0.0	0.0
        //20140930081757	ACTION	Stay
        // delimited by TAB

        // By lines
        var lines = this.result.split('\n');

        for(var n = 0; n < lines.length; n++){
            // 빈 라인 필터링 하고..
            if(lines[n].length != 0){
                // GPS 와 Action Log 만 가져온다.
                var elements = lines[n].split('\t');
                var key = elements[0];
                if(!gps_dic[key]){
                    gps_dic[key] = [];
                }

                // GPS 또는 ACTION
                var value_key = elements[1];
                var dic = {};

                if(value_key == 'GPS'){
                    var lat = parseFloat(elements[2]);
                    var lng = parseFloat(elements[3]);

                    var location = {lat:lat, lng:lng};
                    gps_dic[key].push(location);

                }else if(value_key == 'ACTION'){
                    var action = elements[2];
                    dic = {ACTION:action};
                    gps_dic[key].push(dic);
                }
                //console.log(lines[n]);
            }
        }
        var json_result = JSON.stringify(gps_dic);
        initMap(gps_dic)
        //createDurationTime(gps_dic);
    };
    reader.readAsText(file);

    return gps_dic;

}

document.getElementById('files').addEventListener('change', handleFileSelect, false);