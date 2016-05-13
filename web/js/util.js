/**
 * Created by NK on 2016. 5. 13..
 */
var rad = function(x) {
    return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat() - p1.lat());
    var dLong = rad(p2.lng() - p1.lng());
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
};

function roundXL(n, digits) {
    if (digits >= 0) return parseFloat(n.toFixed(digits)); // 소수부 반올림

    digits = Math.pow(10, digits); // 정수부 반올림
    var t = Math.round(n * digits) / digits;

    return parseFloat(t.toFixed(0));
}

function sortingByValue(dict) {
    // Create items array
    var items = Object.keys(dict).map(function(key) {
        return [key, dict[key]];
    });

// Sort the array based on the second element
    items.sort(function(first, second) {
        return second[1] - first[1];
    });

    return items;
}
