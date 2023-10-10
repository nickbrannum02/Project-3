function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }
      
sleep(2000).then(() => { 
    // JavaScript to initialize the map
    const map = L.map("map", {
        center: [27.96044, -82.30695],
        zoom: 6
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    
    // L.marker([51.505, -0.09]).addTo(map)
    //     .bindPopup('A sample location.')
    //     .openPopup();
    console.log(countyData.length); 
});

// Define a variable to store the court data
let courtsData = {};

// Fetch the court data using D3.js
d3.json('/api/courts_complete')
  .then(function(data) {
    courtsData = data;
    console.log(courtsData);
    

    // Create a marker cluster group for the second set of markers (courtsData)
    const courtsMarkers = L.markerClusterGroup();

    // Iterate through the court data and add markers
    for (const court of courtsData) {
        const marker = L.marker([court.latitude, court.longitude]);
        // Customize the marker pop-up content as needed
        marker.bindPopup(`Court Name: ${court.name}<br>Address: ${court.address}`);
        courtsMarkers.addLayer(marker);
    }

    map.addLayer(courtsMarkers);
  })
  .catch(function(error) {
    console.error("Error fetching court data:", error);
  });

