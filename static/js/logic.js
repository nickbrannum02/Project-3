function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
sleep(2000).then(() => {
    // JavaScript to initialize the map
    const map = L.map("map", {
        center: [27.96044, -82.30695],
        zoom: 6,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Create a marker cluster group
    const markers = L.markerClusterGroup();

    // Assuming you've already loaded your data into countyData, courtsData, and hospitalData
    const dataSet = [courtsData];
    dataSet.forEach((data) => {
        data.forEach((item) => {
            const marker = L.marker([item.Latitude, item.Longitude]);
            // Customize marker icon, pop-up content, etc.
            marker.bindPopup(
                `<b>Location Name:</b> ${item["Location Name"]}<br>` +
                    `<b>City:</b> ${item.City}<br>` +
                    `<b>County:</b> ${item.County}<br>` +
                    `<b>Number of Courts:</b> ${item["Number of Courts"]}`
            );
            // Add the marker to the marker cluster group
            markers.addLayer(marker);
        });
    });

    // Add the marker cluster group to the map
    map.addLayer(markers);
});