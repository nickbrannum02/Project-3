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
    iconSize: [45, 45], 
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
const labels = [];
const xDataPoints = [];
const yDataPoints = [];
const countyDataSet = [countyData];
countyDataSet.forEach((data) => {
    data.forEach((item) => {
        labels.push(item.County);
        xDataPoints.push(item['Percent Elderly']);
        yDataPoints.push(item['Courts per 10,000']);

});

// Calculate linear regression line parameters
function calculateLinearRegression(xData, yData) {
    const n = xData.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    for (let i = 0; i < n; i++) {
        sumX += xData[i];
        sumY += yData[i];
        sumXY += xData[i] * yData[i];
        sumX2 += xData[i] * xData[i];
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}

const { slope, intercept } = calculateLinearRegression(xDataPoints, yDataPoints);

const regressionLine = {
    label: 'Linear Regression',
    data: [
        { x: Math.min(...xDataPoints), y: slope * Math.min(...xDataPoints) + intercept },
        { x: Math.max(...xDataPoints), y: slope * Math.max(...xDataPoints) + intercept },
    ],
    backgroundColor: 'rgba(255, 0, 0, 1)',  // Set the line color
    borderColor: 'rgba(255, 0, 0, 1)',      // Set the line color
    borderWidth: 2,  // Set the line width
    fill: false,    // Ensure it's not filled
};

// Create a scatterplot
const ctx = document.getElementById('scatterplot').getContext('2d');
new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [
            {
                label: 'County Data',
                data: countyData.map((item, index) => ({
                    x: xDataPoints[index],
                    y: yDataPoints[index],
                    label: item.County,
                })),
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                pointRadius: 5,
            },
            regressionLine, // Add the regression line dataset
        ],
    },
    options: {
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Percent Elderly',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Courts per 10,000',
                },
            },
        },
    },
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
});