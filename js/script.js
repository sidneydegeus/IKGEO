var map;
var allMarkers = new Map();
var displayedMarkers = new Map();

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
            {"featureType": "road.highway",elementType: "labels",stylers:[{visibility: "off"}]}, //turns off highway labels
            {"featureType": "road.arterial",elementType: "labels",stylers: [{visibility: "off"}]}, //turns off arterial roads labels
            {"featureType": "road.local",elementType: "labels",stylers: [{visibility: "off"}]}  //turns off local roads labels
        ]
    }

    // New map
    map = new google.maps.Map(document.getElementById('map'), options);

    var rawData = LoadData();
    allMarkers = CreateMarkerDictionary(rawData);

    for (var [key, value] of allMarkers) {
        DisplayFilter(key);
        displayedMarkers.set(key, []);
    }
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

function DisplayFilter(name) {
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
        if (!markers.has(tmp.type)) {
            markers.set(tmp.type, []);
        }
        markers.get(tmp.type).push(CreateMarker(tmp));
    }
    return markers;
}

function CreateMarker(data) {
    // do something with iconimage here
    var marker = {
        coords: data.coords,
        iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        content: data.content
    };
    return marker;
}

function LoadData() {
    var rawData = [
        {
            type: 'Earthquake',
            coords: { lat: 42.4668, lng: -70.9495 },
            content: '<h1>Lynn MA</h1>',
        },
        {
            type: 'Volcano',
            coords: { lat: 42.8584, lng: -70.9300 },
            content: '<h1>Amesbury MA</h1>'
        },
        {
            type: 'Tornado',
            coords: { lat: 42.7762, lng: -71.0773 },
            content: ''
        },
        {
            type: 'Earthquake',
            coords: { lat: 52.2956, lng: 4.5792 },
            content: 'Hillegom'
        }
    ];
    return rawData;
}

$(document).on('click', '.filterLabel', function() {
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
})
