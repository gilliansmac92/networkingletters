// dropdown menu
var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
  return new bootstrap.Dropdown(dropdownToggleEl)
})

// Create a base map object
let map = L.map('map').setView([52.0, -0.1], 5); 

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialize marker cluster group
let markerCluster = L.markerClusterGroup();

// Fetch JSON data
fetch('https://raw.githubusercontent.com/gilliansmac92/networkingletters/main/data/networkdata.json')
    .then(response => response.json())
    .then(data => {
        // Process the data and add markers to the map
        data.forEach(function(row) {
            var fromCoords = row.From.split(',').map(Number);
            var toCoords = row.To.split(',').map(Number);

            var fromPopup = "ID: " + row.ID + "<br>Sender: " + row.Sender;
            var toPopup = "ID: " + row.ID + "<br>Reciever: " + row.Reciever;

            // Add markers for 'From' and 'To' locations
            var fromMarker = L.marker(fromCoords).bindPopup(fromPopup);
            var toMarker = L.marker(toCoords).bindPopup(toPopup);

            // Add markers to the cluster group
            markerCluster.addLayer(fromMarker);
            markerCluster.addLayer(toMarker);

        });

        // Add the marker cluster group to the map
        map.addLayer(markerCluster);
    })
    .catch(error => console.error("Error loading JSON:", error));
