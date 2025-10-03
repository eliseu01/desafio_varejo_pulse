'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, DollarSign, User, ShoppingCart, BarChart, Search, Users } from "lucide-react";
import { useState, useEffect, useMemo } from 'react';
import SalesChart from '@/components/SalesChart';
import { uploadFile } from "./service/dat.service";
import LoadData from "@/components/common/LoadData";
import Notification, { NotificationProps as NotificationType } from '@/components/Notification';
import { getDashboardData } from "./service/dashboard.service";

const API_BASE = "http://localhost:8080";

// --- Interfaces atualizadas para corresponder ao backend ---
interface Product {
  id: number;
  codigo: number;
  nome: string;
  valor_unitario: number;
}

interface Client {
  id: number;
  nome: string;
}

interface Sale {
  id: number;
  data_venda: string;
  cliente: Client;
  produto: Product;
  quantidade: number;
  valor_total: number;
}

// No início do seu arquivo Home
export interface DashboardData {
  totalMes: number;
  totalDia: number;
  quantidadeVendasMes: number;
  quantidadeVendasDia: number;
  topCliente: string; // Adicione esta linha
  topProduto: string; // Adicione esta linha
}

export default function Home() {
  // --- Estados para os dados da aplicação ---
  const [sales, setSales] = useState<Sale[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [clientSearch, setClientSearch] = useState("");

  // --- Estados para notificações ---
  const [notifications, setNotifications] = useState<Omit<NotificationType, 'onClose'>[]>([]);

  // --- Funções de Notificação ---
  const addNotification = (message: string, type: NotificationType['type']) => {
    setNotifications(prev => [...prev, { id: Date.now(), message, type }]);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- Função para buscar todos os dados do backend ---
const fetchData = async () => {
  setLoading(true);
  try {
    // --- ANTES ---
    // const dashboardResponse = await fetch(`${API_BASE}/dashboard`);
    // const dashboardResult = await dashboardResponse.json();

    // --- DEPOIS (usando o serviço) ---
    // Para ver os dados de 2025-09-29, passe a data: getDashboardData('2025-09-29')
    const today = new Date();

  // Formata a data para o padrão 'AAAA-MM-DD'
  const formattedDate = today.toISOString().split('T')[0]; // Ex: "2025-10-03"

  // Chama o serviço passando a data de hoje formatada
  const dashboardResult = await getDashboardData(formattedDate);
    console.log('dash',dashboardResult)

    if (dashboardResult.status === 200) {
      setDashboardData(dashboardResult.data);
    } else {
      addNotification(dashboardResult.message, 'error');
    }

    // ... o restante da função continua igual para buscar vendas e clientes ...
    const salesResponse = await fetch(`${API_BASE}/order`);
    const salesResult = await salesResponse.json();
    if (salesResult.status === 200) {
      setSales(salesResult.data);
    }

    const clientsResponse = await fetch(`${API_BASE}/client`);
    const clientsResult = await clientsResponse.json();
    if (clientsResult.status === 200) {
      setClients(clientsResult.data);
    }

  } catch (error: any) {
    addNotification(error.message || "Não foi possível conectar ao servidor.", 'error');
  } finally {
    setLoading(false);
  }
};

  // --- Efeito para buscar os dados iniciais ao carregar a página ---
  useEffect(() => {
    fetchData();
  }, []);

  // --- Função de Upload de Arquivo ---
  async function uploadDat() {
    const fileInput = document.getElementById("datFile") as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      addNotification("Selecione um arquivo .dat para enviar.", 'error');
      return;
    }
    setLoading(true);
    try {
      const response = await uploadFile(fileInput.files[0]);
      // A resposta do seu backend agora é um JSON
      if (response.status === 200) {
        addNotification(response.message, 'success');
        fetchData(); // Recarrega os dados após o upload
      } else {
        addNotification(response.message || "Erro ao enviar arquivo.", 'error');
      }
    } catch (error: any) {
      addNotification(error.message || "Ocorreu um erro inesperado.", 'error');
    } finally {
      setLoading(false);
      fileInput.value = ""; // Limpa o input do arquivo
    }
  }

  // --- Lógica para filtrar clientes ---
  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      client.nome.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clients, clientSearch]);

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <div className="fixed top-5 right-5 z-50 w-full max-w-sm">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={removeNotification}
          />
        ))}
      </div>

      <header className="bg-gray-100 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-600">
          📊 Relatório de Vendas - Varejo Rápido
        </h1>
      </header>

      <main className="py-10 px-4 md:px-20">
        <div className="grid gap-8">
          {/* --- Seção de Cards do Dashboard --- */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-100 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-blue-600">Vendas do Mês</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{`R$ ${dashboardData?.totalMes?.toFixed(2) ?? '0.00'}`}</div>
                <p className="text-xs text-gray-500">{`${dashboardData?.quantidadeVendasMes ?? 0} vendas no mês`}</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-100 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-blue-600">Vendas do Dia</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{`R$ ${dashboardData?.totalDia?.toFixed(2) ?? '0.00'}`}</div>
                <p className="text-xs text-gray-500">{`${dashboardData?.quantidadeVendasDia ?? 0} vendas hoje`}</p>
              </CardContent>
            </Card>
            
            {/* Cards para Cliente Top e Produto + Vendido (a serem implementados no backend) */}

            <Card className="bg-gray-100 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-blue-600">Cliente Top do Mês</CardTitle>
                <User className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.topCliente ?? '-'}</div>
                <p className="text-xs text-gray-500">Cliente com maior valor em compras</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-100 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-blue-600">Produto + Vendido do Mês</CardTitle>
                <ShoppingCart className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.topProduto ?? '-'}</div>
                <p className="text-xs text-gray-500">Produto com maior valor em vendas</p>
              </CardContent>
            </Card>
          </div>
          
          {/* --- Seção de Upload --- */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Upload className="mr-2" /> Upload de Arquivo .dat
              </h2>
              <div className="flex items-center">
                <input
                  type="file"
                  id="datFile"
                  accept=".dat"
                  className="flex-grow bg-white text-gray-800 border border-gray-300 rounded-l-md p-2"
                />
                <button onClick={uploadDat} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-md" disabled={loading}>
                  {loading ? <LoadData message="Enviando..." /> : 'Enviar'}
                </button>
              </div>
            </div>

          {/* --- Seção do Gráfico de Vendas --- */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart className="mr-2" /> Gráfico de Vendas por Dia
            </h2>
            <div className="h-96 w-full">
              <SalesChart sales={sales} />
            </div>
          </div>

          {/* --- Seção de Clientes --- */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
             <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="mr-2" /> Lista de Clientes
              </h2>
            <div className="flex items-center mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar Cliente pelo nome"
                  className="bg-white text-gray-800 border border-gray-300 rounded-md p-2 pl-10 w-full"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                />
              </div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="p-2">ID</th>
                  <th className="p-2">Nome</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map(client => (
                  <tr key={client.id} className="border-b border-gray-300">
                    <td className="p-2">{client.id}</td>
                    <td className="p-2">{client.nome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- Seção da Tabela de Vendas --- */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Histórico de Vendas</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="p-2">Data</th>
                  <th className="p-2">Cliente</th>
                  <th className="p-2">Produto</th>
                  <th className="p-2">Qtd</th>
                  <th className="p-2">Valor Unitário</th>
                  <th className="p-2">Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr key={sale.id} className="border-b border-gray-300">
                    <td className="p-2">{new Date(sale.data_venda).toLocaleDateString()}</td>
                    <td className="p-2">{sale.cliente.nome}</td>
                    <td className="p-2">{sale.produto.nome}</td>
                    <td className="p-2">{sale.quantidade}</td>
                    <td className="p-2">{`R$ ${sale.produto.valor_unitario.toFixed(2)}`}</td>
                    <td className="p-2">{`R$ ${sale.valor_total.toFixed(2)}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}