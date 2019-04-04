function initMap() {
    // Map options
    var options = {
        zoom: 11,
        center: { lat: 52.2956, lng: 4.5792 }
    }

    // New map
    var map = new google.maps.Map(document.getElementById('map'), options);

    // Listen for click on map
    //google.maps.event.addListener(map, 'click', function(event){
    // Add marker
    //  addMarker({coords:event.latLng});
    //});

    // Array of markers
    var markers = [
        {
            coords: { lat: 42.4668, lng: -70.9495 },
            iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            content: '<h1>Lynn MA</h1>'
        },
        {
            coords: { lat: 42.8584, lng: -70.9300 },
            content: '<h1>Amesbury MA</h1>'
        },
        {
            coords: { lat: 42.7762, lng: -71.0773 }
        }
    ];

    // Loop through markers
    for (var i = 0; i < markers.length; i++) {
        // Add marker
        addMarker(markers[i]);
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
}