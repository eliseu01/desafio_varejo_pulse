'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, DollarSign, User, ShoppingCart, BarChart, Search, Plus, Edit, Trash } from "lucide-react";
import { useState, useEffect } from 'react';
import SalesChart from '@/components/SalesChart';

const API_BASE = "http://localhost:3000";

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

  // State for CRUD operations
  const [clientName, setClientName] = useState('');
  const [clientId, setClientId] = useState('');
  const [productName, setProductName] = useState('');
  const [productValue, setProductValue] = useState('');
  const [productId, setProductId] = useState('');


  async function uploadDat() {
    const fileInput = document.getElementById("datFile") as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Selecione um arquivo!");
      return;
    }
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
      const res = await fetch(`${API_BASE}/reader`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("Arquivo enviado e processado!");
        loadSales();
      } else {
        alert("Erro ao enviar o arquivo.");
      }
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
      alert("Erro de conexão ao enviar o arquivo.");
    }
  }

  async function loadSales(searchTerm = '') {
    try {
      const res = await fetch(`${API_BASE}/order?search=${searchTerm}`);
      const json = await res.json();
      const salesData = json.data;
      setSales(salesData);

      let total = 0;
      const productCount: { [key: string]: number } = {};
      const clientCount: { [key: string]: number } = {};

      salesData.forEach((sale: Sale) => {
        const totalValue = sale.quantidade * sale.produto.valor_unitario;
        total += totalValue;

        productCount[sale.produto.nome] = (productCount[sale.produto.nome] || 0) + sale.quantidade;
        clientCount[sale.cliente.nome] = (clientCount[sale.cliente.nome] || 0) + totalValue;
      });

      setTotalSales(total);

      if (Object.keys(clientCount).length > 0) {
        const topClientName = Object.keys(clientCount).reduce((a, b) => clientCount[a] > clientCount[b] ? a : b);
        setTopClient(topClientName);
      }

      if (Object.keys(productCount).length > 0) {
        const topProductName = Object.keys(productCount).reduce((a, b) => productCount[a] > productCount[b] ? a : b);
        setTopProduct(topProductName);
      }

    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
    }
  }

  async function createClient() {
    try {
      await fetch(`${API_BASE}/client`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: clientName }),
      });
      alert('Cliente criado!');
      setClientName('');
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
    }
  }

  async function updateClient() {
    try {
      await fetch(`${API_BASE}/client/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: clientName }),
      });
      alert('Cliente atualizado!');
      setClientId('');
      setClientName('');
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    }
  }

  async function deleteClient() {
    try {
      await fetch(`${API_BASE}/client/${clientId}`, { method: 'DELETE' });
      alert('Cliente deletado!');
      setClientId('');
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
    }
  }

  async function createProduct() {
    try {
      await fetch(`${API_BASE}/product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: productName, valor_unitario: parseFloat(productValue) }),
      });
      alert('Produto criado!');
      setProductName('');
      setProductValue('');
    } catch (error) {
      console.error("Erro ao criar produto:", error);
    }
  }

  async function updateProduct() {
    try {
      await fetch(`${API_BASE}/product/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: productName, valor_unitario: parseFloat(productValue) }),
      });
      alert('Produto atualizado!');
      setProductId('');
      setProductName('');
      setProductValue('');
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
    }
  }

  async function deleteProduct() {
    try {
      await fetch(`${API_BASE}/product/${productId}`, { method: 'DELETE' });
      alert('Produto deletado!');
      setProductId('');
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  }

  useEffect(() => {
    loadSales();
  }, []);

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <header className="bg-gray-100 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-600">
          📊 Relatório de Vendas - Varejo Rápido
        </h1>
      </header>

      <main className="p-8">
        <div className="grid gap-8">
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="bg-gray-100 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-blue-600">
                  Total de Vendas
                </CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{`R$${totalSales.toFixed(2)}`}</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-100 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-blue-600">
                  Cliente Top
                </CardTitle>
                <User className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{topClient}</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-100 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-blue-600">
                  Produto + Vendido
                </CardTitle>
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
                  className="flex-grow bg-white text-gray-800 border border-gray-300 rounded-l-md p-2"
                />
                <button onClick={uploadDat} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-md">
                  Enviar
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
                  onInput={(e) => loadSales((e.target as HTMLInputElement).value)}
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

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Gerenciar Clientes</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input value={clientName} onChange={(e) => setClientName(e.target.value)} type="text" placeholder="Nome do cliente" className="flex-grow bg-white text-gray-800 border border-gray-300 rounded-md p-2" />
                  <button onClick={createClient} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center">
                    <Plus className="mr-2 h-4 w-4" /> Adicionar
                  </button>
                </div>
                <div className="flex gap-2">
                  <input value={clientId} onChange={(e) => setClientId(e.target.value)} type="number" placeholder="ID para editar/deletar" className="flex-grow bg-white text-gray-800 border border-gray-300 rounded-md p-2" />
                  <button onClick={updateClient} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md flex items-center">
                    <Edit className="mr-2 h-4 w-4" /> Editar
                  </button>
                  <button onClick={deleteClient} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md flex items-center">
                    <Trash className="mr-2 h-4 w-4" /> Deletar
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Gerenciar Produtos</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input value={productName} onChange={(e) => setProductName(e.target.value)} type="text" placeholder="Nome do produto" className="flex-grow bg-white text-gray-800 border border-gray-300 rounded-md p-2" />
                  <input value={productValue} onChange={(e) => setProductValue(e.target.value)} type="number" placeholder="Valor unitário" className="bg-white text-gray-800 border border-gray-300 rounded-md p-2" />
                  <button onClick={createProduct} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center">
                    <Plus className="mr-2 h-4 w-4" /> Adicionar
                  </button>
                </div>
                <div className="flex gap-2">
                  <input value={productId} onChange={(e) => setProductId(e.target.value)} type="number" placeholder="ID para editar/deletar" className="flex-grow bg-white text-gray-800 border border-gray-300 rounded-md p-2" />
                  <button onClick={updateProduct} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md flex items-center">
                    <Edit className="mr-2 h-4 w-4" /> Editar
                  </button>
                  <button onClick={deleteProduct} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md flex items-center">
                    <Trash className="mr-2 h-4 w-4" /> Deletar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}