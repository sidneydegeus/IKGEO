var map;
var markers;

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
        fullscreenControl: false
    }

    // New map
    map = new google.maps.Map(document.getElementById('map'), options);

    //var markers = new Map();
    // Listen for click on map
    //google.maps.event.addListener(map, 'click', function(event){
    // Add marker
    //  addMarker({coords:event.latLng});
    //});

    var rawData = LoadData();
    markers = ConstructData(rawData);

    for (var [key, value] of markers) {
        addFilter(key);

        // temp, should be done later on
        for (var i = 0; i < value.length; i++) {
            addMarker(value[i]);
        }
    }
}

// Add Marker Function
function addMarker(props) {
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
}

function addFilter(name) {
    $('.funkyradio').append(
        '<div class="funkyradio-default ' + name + '">' +
        '<input type="checkbox" name="checkbox ' + name + '" id="checkbox ' + name + '" checked/>' +
        '<label for="checkbox ' + name + '">' + name + '</label>' +
        '</div>'
    );
}

function CreateMarkerDataMap(data) {
    var newMarkers = new Map();
    // 3 should be data list
    for (var i = 0; i < data.length; i++) {
        if (!newMarkers.has(data[i].type)) {
            newMarkers.set(data[i].type, []);
        }
        newMarkers.get(data[i].type).push(CreateMarker(data[i]));
    }
    return newMarkers;
}

function CreateMarkerData(data) {
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
