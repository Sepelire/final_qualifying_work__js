document.addEventListener('DOMContentLoaded', () => {
  const treeData = JSON.parse(localStorage.getItem('treeData'));

  const trunkWidths = treeData.map(tree => parseFloat(tree.Ширина));
  const labels = ['0-2', '2-4', '4-5'];
  const counts = [0, 0, 0];

  for (const width of trunkWidths) {
    if (width >= 0 && width < 2) {
      counts[0]++;
    } else if (width >= 2 && width < 4) {
      counts[1]++;
    } else if (width >= 4 && width <= 5) {
      counts[2]++;
    }
  }

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Распределение деревьев по ширине ствола',
      data: counts,
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    }]
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
        stepSize: 1
      }
    }
  };

  const chartContainer = document.getElementById('chart');
  const chart = new Chart(chartContainer, {
    type: 'bar',
    data: chartData,
    options: chartOptions
  });
});
