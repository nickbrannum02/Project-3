function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

sleep(2000).then(() => {
  // JavaScript to initialize the map
  const map = L.map("map", {
      center: [27.96044, -82.30695],
      zoom: 6,
  });

  // Base map layer
  const baseLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
  });

  const courtIcon = L.icon({
    iconUrl: 'static/images/pickleball_court_marker.png', 
    iconSize: [32, 32], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32]
  });

  // Create a marker cluster group for courts
  const courtMarkers = L.markerClusterGroup();
  const courtDataSet = [courtsData];
  courtDataSet.forEach((data) => {
      data.forEach((item) => {
          const marker = L.marker([item.Location.Latitude, item.Location.Longitude], {icon: courtIcon});
          // Customize marker icon, pop-up content, etc.
          marker.bindPopup(
              `<b>Location Name:</b> ${item["Location Name"]}<br>` +
              `<b>City:</b> ${item.City}<br>` +
              `<b>County:</b> ${item.County}<br>` +
              `<b>Number of Courts:</b> ${item["Number of Courts"]}`
          );
          // Add the marker to the marker cluster group
          courtMarkers.addLayer(marker);
      });
  });

  const hosIcon = L.icon({
    iconUrl: 'static/images/hospital_marker_icon.png', 
    iconSize: [32, 32], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32]
});

  // Create a marker cluster group for hospitals
  const hosMarkers = L.markerClusterGroup();
  const hosDataSet = [hospitalData];
  hosDataSet.forEach((data) => {
      data.forEach((item) => {
          const hosMarker = L.marker([item.Latitude, item.Longitude], {icon: hosIcon});
          // Customize marker icon, pop-up content, etc.
          hosMarker.bindPopup(
              `<b>Location Name:</b> ${item["Location Name"]}<br>` +
              `<b>City:</b> ${item.City}<br>` +
              `<b>County:</b> ${item.County}<br>`
          );
          // Add the marker to the marker cluster group
          hosMarkers.addLayer(hosMarker);
      });
  });

  // Heatmap layer
  let heatArray = [];
  courtDataSet.forEach((data) => {
      data.forEach((item) => {
          heatArray.push([item.Location.Latitude, item.Location.Longitude]);
      });
  });
  let heat = L.heatLayer(heatArray, {
      minOpacity: 0.25,
      radius: 25,
      blur: 11,
  });

  // Add the base layer and marker clusters to the map
  map.addLayer(baseLayer);
  map.addLayer(courtMarkers);
  map.addLayer(hosMarkers);
  map.addLayer(heat);

  // Create an object for overlay layers (marker clusters and heatmap)
  const overlayLayers = {
      "Markers (Courts)": courtMarkers,
      "Markers (Hospitals)": hosMarkers,
      "Heatmap": heat,
  };

  // Create layer control and add it to the map
  L.control.layers(null, overlayLayers).addTo(map);
});