document.addEventListener('DOMContentLoaded', () => {
  const treeData = JSON.parse(localStorage.getItem('treeData'));

  const chartContainer = document.getElementById('chart');
  let currentDataKey = 'Ширина';

  function generateChartData(dataKey) {
    const widthIntervals = [
      { label: '0-2', min: 0, max: 2 },
      { label: '2-4', min: 2, max: 4 },
      { label: '4-5', min: 4, max: 5 }
    ];
  
    const crownIntervals = [
      { label: '5-8', min: 5, max: 8 },
      { label: '8-12', min: 8, max: 12 },
      { label: '12-15', min: 12, max: 15 }
    ];
  
    const intervals = dataKey === 'Ширина' ? widthIntervals : crownIntervals;
  
    const counts = {};
  
    for (const interval of intervals) {
      counts[interval.label] = 0;
    }
  
    for (const tree of treeData) {
      const value = tree[dataKey];
      for (const interval of intervals) {
        if (value >= interval.min && value < interval.max) {
          counts[interval.label]++;
          break;
        }
      }
    }
  
    const labels = intervals.map(interval => interval.label);
    const data = Object.values(counts);
  
    return {
      labels: labels,
      datasets: [{
        label: `Распределение деревьев по ${dataKey}`,
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    };
  }
  
  

  function createChart(dataKey) {
    const chartData = generateChartData(dataKey);

    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true,
          precision: 0,
          stepSize: 1
        }
      }
    };

    if (chartContainer.chart) {
      chartContainer.chart.destroy();
    }

    chartContainer.chart = new Chart(chartContainer, {
      type: 'bar',
      data: chartData,
      options: chartOptions
    });
  }

  document.getElementById('toggleButton').addEventListener('click', () => {
    currentDataKey = (currentDataKey === 'Ширина') ? 'Крона' : 'Ширина';
    createChart(currentDataKey);
  });

  createChart(currentDataKey);
});
