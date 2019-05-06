var map;
var allMarkers = new Map();
var displayedMarkers = new Map();

var oldestYear;
var newestYear;

function initMap() {
    // Map options
    var options = {
        zoom: 11,
        center: { lat: 52.2956, lng: 4.5792 },
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        styles: [
            { "featureType": "road.highway", elementType: "labels", stylers: [{ visibility: "off" }] }, //turns off highway labels
            { "featureType": "road.arterial", elementType: "labels", stylers: [{ visibility: "off" }] }, //turns off arterial roads labels
            { "featureType": "road.local", elementType: "labels", stylers: [{ visibility: "off" }] }  //turns off local roads labels
        ]
    };

    // New map
    map = new google.maps.Map(document.getElementById('map'), options);
}

function LoadData(callback) {
    $.getJSON("DisasterDeclarationsSummaries-v1.json", function (data) {
        allMarkers = CreateMarkerDictionary(data);
        for (var [key, value] of allMarkers) {
            CreateFilter(key);
            displayedMarkers.set(key, []);
        }
        callback();
    });
}

function CreateYearSlider() {
    // min, max both need to be dynamic... callback isn't working
    // use static values for now
    $('#input').slider({
        min: 1953,
        max: 2019,
        range: true
    });
}

// Add Marker Function
function DisplayMarker(props) {
    var marker = new google.maps.Marker({
        position: props.coords,
        map: map,
        //icon:props.iconImage
    });

    // Check for customicon
    if (props.iconImage) {
        // Set icon image
        marker.setIcon(props.iconImage);
    }

    // Check content
    if (props.content) {
        var infoWindow = new google.maps.InfoWindow({
            content: props.content
        });

        marker.addListener('click', function () {
            infoWindow.open(map, marker);
        });
    }
    return marker;
}

function CreateFilter(name) {
    $('.filter').append(
        '<div class="filter-default ' + name + '">' +
        '<input type="checkbox" name="checkbox ' + name + '" id="checkbox ' + name + '" value="' + name + '"/>' +
        '<label class="filterLabel" for="checkbox ' + name + '">' + name + '</label>' +
        '</div>'
    );
}

function CreateMarkerDictionary(data) {
    var markers = new Map();
    for (var i = 0; i < data.length; i++) {
        var tmp = data[i];
        if (!markers.has(tmp.incidentType)) {
            markers.set(tmp.incidentType, new Map());
        }
        var date = new Date(tmp.incidentBeginDate);
        if (!markers.get(tmp.incidentType).has(date.getFullYear())) {
            markers.get(tmp.incidentType).set(date.getFullYear(), [])
        }
        if (newestYear < date.getFullYear()) {
            newestYear = date.getFullYear();
        }
        if (oldestYear > date.getFullYear()) {
            oldestYear = date.getFullYear();
        }
        //var test = $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address='+ tmp.state);
        //console.log(test);
        //markers.get(tmp.incidentType).push(CreateMarker(tmp));
    }
    return markers;
}

// mayber emove
function CreateMarker(data) {
    // do something with iconimage here
    var marker = {
        coords: data.coords,
        iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        content: data.content
    };
    return marker;
}

$(document).on('click', '.filterLabel', function () {
    var value = $(this).prev("input[type='checkbox']").val();
    var checked = $(this).prev("input[type='checkbox']:checked").length > 0;
    var filterData = allMarkers.get(value);
    for (var i = 0; i < filterData.length; i++) {
        if (checked) {
            displayedMarkers.get(value)[i].setMap(null);
        } else {
            displayedMarkers.get(value).push(DisplayMarker(filterData[i]));
        }
    }
    // empty displayed array
    if (checked) {
        displayedMarkers.set(value, []);
    }
});

initMap();
LoadData(function () {
    CreateYearSlider();
});


