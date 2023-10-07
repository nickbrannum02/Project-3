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

    