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
    // Assuming you've already loaded your data into countyData, courtsData, and hospitalData
    const dataSet = [courtsData];
    dataSet.forEach(data => {
        const markers = L.markerClusterGroup();
        data.forEach(item => {
            const marker = L.marker([item.Latitude, item.Longitude]);
            // Customize marker icon, pop-up content, etc.
            marker.bindPopup(
                `<b>Location Name:</b> ${item['Location Name']}<br>` +
                `<b>City:</b> ${item.City}<br>` +
                `<b>County:</b> ${item.County}<br>` +
                `<b>Number of Courts:</b> ${item['Number of Courts']}`
            );
            // Add the marker to the map
            marker.addTo(map);
            
        });
        markers.addLayer(marker); // Add the marker to the marker cluster group
    });

    map.addLayer(markers); // Add the marker cluster group to the map
});

    