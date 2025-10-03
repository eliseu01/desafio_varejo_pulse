
'use client'

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Sale {
    id: number;
    data: string;
    cliente: {
        id: number;
        nome: string;
    };
    produto: {
        id: number;
        nome: string;
        valor_unitario: number;
    };
    quantidade: number;
}

interface SalesChartProps {
  sales: Sale[];
}

export default function SalesChart({ sales }: SalesChartProps) {
  const productCount: { [key: string]: number } = {};

  sales.forEach((sale) => {
    productCount[sale.produto.nome] = (productCount[sale.produto.nome] || 0) + sale.quantidade;
  });

  const data = {
    labels: Object.keys(productCount),
    datasets: [
      {
        label: 'Quantidade Vendida',
        data: Object.values(productCount),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Vendas por Produto',
      },
    },
  };

  return <Bar data={data} options={options} />;
}
