require('mapbox.js');
require('leaflet-hash');
var request = require('request');
var endpoint = 'https://api.mapbox.com/directions/v5/mapbox/driving/';

L.mapbox.accessToken = 'pk.eyJ1IjoiYm9iYnlzdWQiLCJhIjoiTi16MElIUSJ9.Clrqck--7WmHeqqvtFdYig';

var map = L.mapbox.map('map').setView([39.9432, -75.1433], 14);
L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v8').addTo(map);
L.hash(map);

var start = L.marker([39.9432, -75.1433], {
  draggable: true
}).addTo(map);

var end = L.marker([39.9432, -75.2433], {
  draggable: true
}).addTo(map);

var routeGeoJSON = L.layerGroup();
routeGeoJSON.addTo(map);

var sidebar = document.getElementById('side');

start.on('dragend', function(e) {
    getRoute(this.getLatLng().lng, this.getLatLng().lat, end.getLatLng().lng, end.getLatLng().lat, function(err, route) {
          routeGeoJSON.clearLayers();
          addToMap(route);
    });
});

end.on('dragend', function(e) {
    getRoute(start.getLatLng().lng, start.getLatLng().lat, this.getLatLng().lng, this.getLatLng().lat, function(err, route) {
          routeGeoJSON.clearLayers();
          addToMap(route);
    });
});


function getRoute(fromLng, fromLat, toLng, toLat, callback) {
    request(endpoint + fromLng + ',' + fromLat + ';' + toLng + ',' + toLat + '.json?geometries=geojson&overview=full&steps=true&access_token=pk.eyJ1IjoiYm9iYnlzdWQiLCJhIjoiTi16MElIUSJ9.Clrqck--7WmHeqqvtFdYig', function(err, res, body) {
        if (err) return callback(err);
        if (body && res.statusCode === 200) {
            var route = JSON.parse(body);
            var steps = route.routes[0].legs[0].steps;
            sidebar.innerHTML = '';
            for (var i = 0; i < steps.length; i++) {
                var maneuver = steps[i].maneuver;
                var item = document.createElement('div');
                var image = document.createElement('img');
                var icon = maneuver.modifier ? (maneuver.type + '_' + maneuver.modifier).replace(' ', '_') : maneuver.type.replace(' ', '_');
                item.innerHTML = maneuver.instruction;
                item.setAttribute('class', 'instruction');
                image.setAttribute('src', './icons/direction_' + icon.replace(' ', '_') + '.png');
                image.setAttribute('width', '50');
                sidebar.appendChild(item);
                sidebar.appendChild(image);
            }
            return callback(null, route);
        }
    });
}

function addToMap(route) {
    L.geoJson({
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': route.routes[0].geometry.coordinates
                }
            }
        ]
    }).addTo(routeGeoJSON);
}
