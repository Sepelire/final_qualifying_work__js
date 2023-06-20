window.addEventListener('DOMContentLoaded', () => {
    const treeData = JSON.parse(localStorage.getItem('treeData'));
  
    if (treeData) {
      const treeCrownSizes = treeData.map(tree => tree.Крона);
  
      const chartData = {
        labels: ['Размеры крон'],
        datasets: [
          {
            label: 'Количество деревьев',
            data: treeCrownSizes,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      };
  
      const chartOptions = {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            precision: 0,
            title: {
              display: true,
              text: 'Количество деревьев'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Размеры крон'
            }
          }
        }
      };
  
      const chartContainer = document.getElementById('chart');
      const chart = new Chart(chartContainer, {
        type: 'bar',
        data: chartData,
        options: chartOptions
      });
    }
  });
  