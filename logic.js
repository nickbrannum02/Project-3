// Start function with a pause
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
//Introduce delay 
sleep(1000).then(() => {

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


//Define arrays and complete with lists
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

// Create a scatterplot
const ctx = document.getElementById('scatterplot').getContext('2d');
new Chart(ctx, {
    type: 'scatter',
    data: {

        labels: labels,
        datasets: [{
            label: 'County Data',
            data: countyData.map((item, index) => ({
                x: xDataPoints[index],
                y: yDataPoints[index],
                label: item.County,
            })),
            backgroundColor: 'rgba(75, 192, 192, 1.0)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            pointRadius: 4,
        }]

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
// Initialize an empty cityData object
let cityData = {};

// Fetch data from the API and populate cityData
d3.json('/api/city_data')
  .then(function (data) {
    cityData = data;

    // Create the chart after data is loaded
    createBarChart();
  })
  .catch(function (error) {
    console.error('Error fetching data:', error);
  });

// Function to create the bar chart
function createBarChart() {
  // Create the chart using the retrieved data
  const config = {
    type: 'bar',
    data: {
      labels: cityData.map(entry => entry.City),
      datasets: [
        {
          label: 'Number of Courts',
          data: cityData.map(entry => entry.Number of Courts]), 
          backgroundColor: 'rgba(75, 192, 192, 0.2',
          borderColor: 'rgba(75, 192, 192, 1',
          borderWidth: 1,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  // Create the chart
  const ctx = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(ctx, config);



// Create customized markers for hospitals
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
              `<b>Location Name:</b> ${item["Name"]}<br>` +
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