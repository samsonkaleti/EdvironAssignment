import  { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RealTimeChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Real-Time Data",
        data: [],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
    ],
  });

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:8080");

    socket.on("real-time-data", (data) => {
      setChartData((prev) => {
        const newLabels = [...prev.labels, data.timestamp];
        const newData = [...prev.datasets[0].data, data.value];

        return {
          labels: newLabels.slice(-10),
          datasets: [{ ...prev.datasets[0], data: newData.slice(-10) }],
        };
      });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="w-full max-w-4xl p-4">
      <h2 className="text-xl font-bold mb-4">Real-Time Data Visualization</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default RealTimeChart;