// src/pages/Dashboard.jsx
// Dashboard administrativo: visão geral dos pedidos e do faturamento.

import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Package,
  ArrowRight,
} from "lucide-react";
import {
  obterMetricas,
  formatarBRL,
  TODOS_STATUS,
  CORES_STATUS,
} from "../services/pedidoService";
import { listarProdutos } from "../services/produtoService";
import { useVersaoPedidos } from "../hooks/useVersaoPedidos";

export default function Dashboard() {
  // As métricas são recalculadas sempre que um pedido muda.
  const versao = useVersaoPedidos();
  const metricas = useMemo(
    () => obterMetricas(),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- versão é só o gatilho que refaz o cálculo quando um pedido muda
    [versao]
  );
  const totalProdutos = useMemo(
    () => listarProdutos().length,
    // eslint-disable-next-line react-hooks/exhaustive-deps -- versão é só o gatilho que refaz o cálculo quando um pedido muda
    [versao]
  );

  const cartoes = [
    {
      titulo: "Pedidos no total",
      valor: metricas.totalPedidos,
      icone: ClipboardList,
    },
    {
      titulo: "Em andamento",
      valor: metricas.pedidosEmAberto,
      icone: Clock,
      destaque: true,
    },
    {
      titulo: "Entregues",
      valor: metricas.pedidosEntregues,
      icone: CheckCircle2,
    },
    {
      titulo: "Produtos cadastrados",
      valor: totalProdutos,
      icone: Package,
    },
  ];

  // Maior contagem entre os status, usada para dimensionar as barras.
  const maiorContagem = Math.max(
    1,
    ...TODOS_STATUS.map((status) => metricas.porStatus[status] || 0)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Cabecalho */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Área administrativa
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Dashboard da <span className="text-primary-600">cantina</span>
          </h1>
          <p className="text-gray-600">
            Resumo dos pedidos registrados no sistema.
          </p>
        </div>

        <Link
          to="/admin/pedidos"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm transition-all"
        >
          Gerenciar pedidos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Cartoes de numeros */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cartoes.map((cartao) => {
          const Icone = cartao.icone;
          return (
            <div
              key={cartao.titulo}
              className={`border rounded-2xl p-5 ${
                cartao.destaque
                  ? "border-primary-200 bg-primary-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {cartao.titulo}
                </span>
                <Icone className="w-4 h-4 text-primary-600" />
              </div>
              <p className="text-3xl font-extrabold text-gray-900">{cartao.valor}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Faturamento */}
        <div className="border border-gray-200 bg-white rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Faturamento
            </span>
            <DollarSign className="w-4 h-4 text-primary-600" />
          </div>
          <p className="text-3xl font-extrabold text-primary-600">
            {formatarBRL(metricas.faturamento)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Não considera pedidos cancelados.
          </p>
        </div>

        {/* Ticket medio */}
        <div className="border border-gray-200 bg-white rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Ticket médio
            </span>
            <TrendingUp className="w-4 h-4 text-primary-600" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">
            {formatarBRL(metricas.ticketMedio)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Valor médio por pedido.</p>
        </div>

        {/* Cancelados */}
        <div className="border border-gray-200 bg-white rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Cancelados
            </span>
            <ClipboardList className="w-4 h-4 text-accent-500" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">
            {metricas.pedidosCancelados}
          </p>
          <p className="text-xs text-gray-500 mt-1">Pedidos cancelados no total.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pedidos por status */}
        <div className="border border-gray-200 bg-white rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">
            Pedidos por status
          </h2>

          <ul className="space-y-3">
            {TODOS_STATUS.map((status) => {
              const quantidade = metricas.porStatus[status] || 0;
              const largura = (quantidade / maiorContagem) * 100;

              return (
                <li key={status} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={`px-2 py-0.5 rounded-md border text-xs font-bold ${CORES_STATUS[status]}`}
                    >
                      {status}
                    </span>
                    <span className="font-bold text-gray-900">{quantidade}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all"
                      style={{ width: `${largura}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Produtos mais vendidos */}
        <div className="border border-gray-200 bg-white rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">
            Produtos mais vendidos
          </h2>

          {metricas.maisVendidos.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">
              Nenhuma venda registrada ainda.
            </p>
          ) : (
            <ol className="divide-y divide-gray-100">
              {metricas.maisVendidos.map((produto, indice) => (
                <li
                  key={produto.nome}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span className="flex items-center gap-3 text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-primary-50 text-primary-700 text-xs font-bold flex items-center justify-center">
                      {indice + 1}
                    </span>
                    {produto.nome}
                  </span>
                  <span className="font-bold text-gray-900">
                    {produto.quantidade} un.
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
