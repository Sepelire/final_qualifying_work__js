
document.addEventListener('DOMContentLoaded', () => {
  let treeData = [];

  const chartContainer = document.getElementById('chart');
  let currentDataKey = 'pine_width';

  function generateChartData(dataKey) {
    const widthIntervals = [
      { label: '0-2', min: 0, max: 2 },
      { label: '2-4', min: 2, max: 4 },
      { label: '4-5', min: 4, max: 5 }
    ];
  
    const crownIntervals = [
      { label: '0', min: 0, max: 1 },
      { label: '5-8', min: 5, max: 8 },
      { label: '8-12', min: 8, max: 12 },
      { label: '12-15', min: 12, max: 15 }
    ];
  
    const heightIntervals = [
      { label: '20-30', min: 20, max: 30 },
      { label: '30-40', min: 30, max: 40 },
      { label: '40-50', min: 40, max: 50 }
    ];
  
    const intervals = dataKey === 'pine_width' ? widthIntervals : (dataKey === 'pine_crown' ? crownIntervals : heightIntervals);
  
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

  document.querySelectorAll('input[name="dataKey"]').forEach(radio => {
    radio.addEventListener('change', () => {
      currentDataKey = radio.value;
      createChart(currentDataKey);
    });
  });

  document.getElementById('loadDataButton').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target.result;
        try {
          treeData = JSON.parse(contents);
          createChart(currentDataKey);
        } catch (error) {
          console.error('Ошибка при чтении файла:', error);
        }
      };
      reader.readAsText(file);
    });
    input.click();
  });

  document.getElementById('widthRadio').addEventListener('change', () => {
    currentDataKey = 'pine_width';
    createChart(currentDataKey);
  });

  document.getElementById('crownRadio').addEventListener('change', () => {
    currentDataKey = 'pine_crown';
    createChart(currentDataKey);
  });

  document.getElementById('heightRadio').addEventListener('change', () => {
    currentDataKey = 'pine_height';
    createChart(currentDataKey);
  });

  createChart(currentDataKey);
});