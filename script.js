// Create a base map object 
//https://leafletjs.com/reference.html#map
<script>
// Initialize the map centered on an approximate location
   var map = L.map('map').setView([52.0, -0.1], 5);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create a marker cluster group
var markerCluster = L.markerClusterGroup();

// Replace the URL below with the correct link to your JSON file
fetch('https://raw.githubusercontent.com/gilliansmac92/networkingletters/main/data/networkdata.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Process the data and add markers to the map
        data.forEach(function(row) {
            var fromCoords = row.From.split(',').map(Number);
            var toCoords = row.To.split(',').map(Number);

            var fromPopup = "ID: " + row.ID + "<br>Sender: " + row.Sender;
            var toPopup = "ID: " + row.ID + "<br>Receiver: " + row.Receiver;

            // Add markers for 'From' and 'To' locations
            var fromMarker = L.marker(fromCoords).bindPopup(fromPopup);
            var toMarker = L.marker(toCoords).bindPopup(toPopup);

            // Add markers to the cluster group
            markerCluster.addLayer(fromMarker);
            markerCluster.addLayer(toMarker);

            // Add polyline between 'From' and 'To'
            L.polyline([fromCoords, toCoords], { color: 'red', weight: 2 }).addTo(map);
        });

        // Add the marker cluster group to the map
        map.addLayer(markerCluster);
    })
    .catch(error => console.error("Error loading JSON:", error));
