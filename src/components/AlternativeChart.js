import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function AlternativeChart({ alternativeNames, totals }) {
  // 그래프 데이터 설정
  const data = {
    labels: alternativeNames,
    datasets: [
      {
        label: '대안 점수',
        data: totals,
        backgroundColor: ['#4a90e2', '#50e3c2', '#f5a623'],
        borderColor: ['#357abd', '#3db79d', '#d9822b'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h3>대안 비교 그래프</h3>
      <Bar data={data} options={options} />
    </div>
  );
}

export default AlternativeChart;
