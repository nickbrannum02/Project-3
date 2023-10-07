//County Data
countyData = {}
d3.json('/api/county_data')
  .then(function(data) {
    countyData = data;
    console.log(countyData);
  })

// Courts Data
courtsData = {}
d3.json('/api/courts_complete')
  .then(function(data) {
    courtsData = data;
    console.log(courtsData);
  })

