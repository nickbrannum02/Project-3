const countyDataSet = [countyData];
countyDataSet.forEach((data) => {
    data.forEach((item) => {
        const labels = countyData.map(item => item.County);
        const xDataPoints = countyData.map(item => item['Percent Elderly']);
        const yDataPoints = countyData.map(item => item['Courts per 10,000']);
    });
    // Create a scatterplot
    const ctx = document.getElementById('scatterplot').getContext('2d');
    new Chart(ctx, {
        type: 'scatter',
        data: {
            labels: labels,
            datasets: [{
                label: 'County Data',
                data: countyData,
                x: xDataPoints,
                y: yDataPoints,
                backgroundColor: 'rgba(75, 192, 192, 0.5)', // Adjust the color as needed
                borderColor: 'rgba(75, 192, 192, 1)', // Adjust the color as needed
                borderWidth: 1,
                pointRadius: 5, // Adjust the point size as needed
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Percent Elderly'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Courts per 10,000'
                    }
                }
            }
        }
    });
});