// src/app/service/dashboard.service.ts

// Importa a interface que define a estrutura dos dados do dashboard
import { DashboardData } from '../page'; // Ajuste o caminho se sua interface estiver em outro local

const API_BASE = "http://localhost:8080";

/**
 * Interface para a resposta padronizada da sua API.
 */
interface ApiResponse {
  data: DashboardData;
  message: string;
  status: number;
}

/**
 * Busca os dados do dashboard do backend.
 * @param date - Uma data opcional no formato 'AAAA-MM-DD' para buscar dados de um dia específico.
 * @returns Uma promessa que resolve para os dados do dashboard.
 */
export async function getDashboardData(date?: string): Promise<ApiResponse> {
  // Constrói a URL, adicionando o parâmetro de data se ele for fornecido
  let url = `${API_BASE}/dashboard`
  if (date) {
    url+= `?date=2025-09-29` ;
  }
  console.log(url)
  const response = await fetch(url.toString());

  // Lança um erro se a resposta da rede não for bem-sucedida
  if (!response.ok) {
    // Tenta extrair uma mensagem de erro do corpo da resposta, se houver
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Falha ao buscar os dados do dashboard.');
  }

  // Retorna os dados da resposta em formato JSON
  return response.json();
}