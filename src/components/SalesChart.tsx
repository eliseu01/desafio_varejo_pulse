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

// Interfaces alinhadas com o backend
interface Sale {
  id: number;
  data_venda: string;
  cliente: { id: number; nome: string; };
  produto: { id: number; nome: string; valor_unitario: number; };
  quantidade: number;
  valor_total: number;
}

interface SalesChartProps {
  sales: Sale[];
}

export default function SalesChart({ sales }: SalesChartProps) {
  // Lógica para agregar o valor total gasto por produto
  const salesByProduct: { [key: string]: number } = {};

  sales.forEach((sale) => {
    salesByProduct[sale.produto.nome] = (salesByProduct[sale.produto.nome] || 0) + sale.valor_total;
  });

  const data = {
    labels: Object.keys(salesByProduct),
    datasets: [
      {
        label: 'Valor Total Vendido (R$)',
        data: Object.values(salesByProduct),
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
        text: 'Total de Vendas por Produto',
      },
       tooltip: {
            callbacks: {
                label: function(context: any) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
                    }
                    return label;
                }
            }
        }
    },
    scales: {
        y: {
            ticks: {
                callback: function(value: any) {
                    return 'R$ ' + value;
                }
            }
        }
    }
  };

  return <Bar data={data} options={options} />;
}