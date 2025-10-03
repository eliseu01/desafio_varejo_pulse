'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, DollarSign, User, ShoppingCart, BarChart, Search, Plus, Edit, Trash } from "lucide-react";
import { useState, useEffect } from 'react';
import SalesChart from '@/components/SalesChart';
import { uploadFile } from "./service/dat.service";
import LoadData from "@/components/common/LoadData";
import Notification, { NotificationProps as NotificationType } from '@/components/Notification'; // Ajuste o caminho

const API_BASE = "http://localhost:8080";

interface Product {
  id: number;
  nome: string;
  valor_unitario: number;
}

interface Client {
  id: number;
  nome: string;
}

interface Sale {
  id: number;
  data: string;
  cliente: Client;
  produto: Product;
  quantidade: number;
}

export default function Home() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [topClient, setTopClient] = useState('-');
  const [topProduct, setTopProduct] = useState('-');
  const [loading, setLoading] = useState(false);

  // Novos estados para notificações e erros
  const [notifications, setNotifications] = useState<Omit<NotificationType, 'onClose'>[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  // State for CRUD operations
  const [clientName, setClientName] = useState('');
  const [clientId, setClientId] = useState('');
  const [productName, setProductName] = useState('');
  const [productValue, setProductValue] = useState('');
  const [productId, setProductId] = useState('');

  // Funções de notificação
  const addNotification = (message: string, type: NotificationType['type']) => {
    setNotifications(prev => [...prev, { id: Date.now(), message, type }]);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };


  async function uploadDat() {
    const fileInput = document.getElementById("datFile") as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      addNotification("Selecione um arquivo .dat para enviar.", 'error');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    const response = await uploadFile(fileInput.files?.[0] ? fileInput.files[0] : new File([], ''));
    setLoading(false);
    if (response === 200) {
      addNotification("Arquivo enviado com sucesso!", 'success');
    } else {
      addNotification("Erro ao enviar arquivo.", 'error');
    }
  }

  // Funções CRUD com validação e notificações
  async function createClient() {
    if (!clientName.trim()) {
      setErrors(prev => ({ ...prev, clientName: true }));
      addNotification('O nome do cliente é obrigatório.', 'error');
      return;
    }
    try {
      await fetch(`${API_BASE}/client`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: clientName }),
      });
      addNotification('Cliente criado!', 'success');
      setClientName('');
    } catch (error) {
      addNotification('Erro ao criar cliente.', 'error');
      console.error("Erro ao criar cliente:", error);
    }
  }

  async function updateClient() {
     if (!clientId.trim() || !clientName.trim()) {
      setErrors(prev => ({ ...prev, clientId: !clientId.trim(), clientName: !clientName.trim() }));
      addNotification('ID e Nome do cliente são obrigatórios.', 'error');
      return;
    }
    try {
      await fetch(`${API_BASE}/client/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: clientName }),
      });
      addNotification('Cliente atualizado!', 'success');
      setClientId('');
      setClientName('');
    } catch (error) {
      addNotification('Erro ao atualizar cliente.', 'error');
      console.error("Erro ao atualizar cliente:", error);
    }
  }

  async function deleteClient() {
    if (!clientId.trim()) {
      setErrors(prev => ({ ...prev, deleteClientId: true }));
      addNotification('O ID do cliente é obrigatório para deletar.', 'error');
      return;
    }
    try {
      await fetch(`${API_BASE}/client/${clientId}`, { method: 'DELETE' });
      addNotification('Cliente deletado!', 'success');
      setClientId('');
    } catch (error) {
      addNotification('Erro ao deletar cliente.', 'error');
      console.error("Erro ao deletar cliente:", error);
    }
  }

  async function createProduct() {
     if (!productName.trim() || !productValue.trim()) {
      setErrors(prev => ({ ...prev, productName: !productName.trim(), productValue: !productValue.trim() }));
      addNotification('Nome e Valor do produto são obrigatórios.', 'error');
      return;
    }
    try {
      await fetch(`${API_BASE}/product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: productName, valor_unitario: parseFloat(productValue) }),
      });
      addNotification('Produto criado!', 'success');
      setProductName('');
      setProductValue('');
    } catch (error) {
      addNotification('Erro ao criar produto.', 'error');
      console.error("Erro ao criar produto:", error);
    }
  }

  // ... Implemente a mesma lógica de validação para updateProduct e deleteProduct

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
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gray-100 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-blue-600">Total de Vendas</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{`R$${totalSales.toFixed(2)}`}</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-100 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-blue-600">Cliente Top</CardTitle>
                <User className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{topClient}</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-100 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-blue-600">Produto + Vendido</CardTitle>
                <ShoppingCart className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{topProduct}</div>
              </CardContent>
            </Card>
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
                <button onClick={uploadDat} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-md">
                  {loading ? <LoadData message="" /> : 'Enviar'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart className="mr-2" /> Gráfico de Vendas
            </h2>
            <div className="h-96 w-full">
              <SalesChart sales={sales} />
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar Cliente ou Produto"
                  className="bg-white text-gray-800 border border-gray-300 rounded-md p-2 pl-10 w-full"
                />
              </div>
            </div>
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
                    <td className="p-2">{new Date(sale.data).toLocaleDateString()}</td>
                    <td className="p-2">{sale.cliente.nome}</td>
                    <td className="p-2">{sale.produto.nome}</td>
                    <td className="p-2">{sale.quantidade}</td>
                    <td className="p-2">{`R$${sale.produto.valor_unitario.toFixed(2)}`}</td>
                    <td className="p-2">{`R$${(sale.quantidade * sale.produto.valor_unitario).toFixed(2)}`}</td>
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