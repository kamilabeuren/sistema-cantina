// src/pages/AdminPedidos.jsx
// Painel administrativo de pedidos: lista, filtros e alteração de status.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Search,
  ChevronRight,
  ChevronDown,
  XCircle,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import {
  filtrarPedidos,
  alterarStatusPedido,
  avancarStatusPedido,
  cancelarPedido,
  proximoStatus,
  formatarBRL,
  formatarDataHora,
  TODOS_STATUS,
  STATUS_PEDIDO,
  STATUS_CANCELADO,
  CORES_STATUS,
} from "../services/pedidoService";
import { useVersaoPedidos } from "../hooks/useVersaoPedidos";

export default function AdminPedidos() {
  const [statusFiltro, setStatusFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [expandido, setExpandido] = useState(null);

  // Recalcula a lista quando os filtros mudam e quando um pedido é alterado.
  const versao = useVersaoPedidos();
  const pedidos = useMemo(
    () => filtrarPedidos({ status: statusFiltro, busca }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- versão é só o gatilho que refaz o cálculo quando um pedido muda
    [statusFiltro, busca, versao]
  );

  const opcoesFiltro = useMemo(() => ["Todos", ...TODOS_STATUS], []);

  function handleAvancar(numero) {
    avancarStatusPedido(numero);
  }

  // Avançar é o caso comum e acontece num clique só.
  // Voltar o pedido para uma etapa anterior pede confirmação, porque na
  // correria do balcão é fácil registrar errado e o cliente ver na tela dele.
  function handleAlterarStatus(numero, statusAtual, novoStatus) {
    if (novoStatus === statusAtual) return;

    const posicaoAtual = STATUS_PEDIDO.indexOf(statusAtual);
    const posicaoNova = STATUS_PEDIDO.indexOf(novoStatus);
    const estaVoltando =
      posicaoAtual !== -1 && posicaoNova !== -1 && posicaoNova < posicaoAtual;

    if (estaVoltando) {
      const confirmado = window.confirm(
        `Voltar o pedido #${numero} de "${statusAtual}" para "${novoStatus}"?\n\n` +
          "O cliente vê essa mudança na tela de acompanhamento dele."
      );
      if (!confirmado) return;
    }

    alterarStatusPedido(numero, novoStatus);
  }

  function handleCancelar(numero) {
    if (window.confirm(`Cancelar o pedido #${numero}?`)) {
      cancelarPedido(numero);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Cabecalho */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
            <ClipboardList className="w-3.5 h-3.5" />
            Área administrativa
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Painel de <span className="text-primary-600">pedidos</span>
          </h1>
          <p className="text-gray-600">
            Acompanhe os pedidos da cantina e atualize o status de cada um.
          </p>
        </div>

        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all"
        >
          <LayoutDashboard className="w-4 h-4 text-primary-600" />
          Ver dashboard
        </Link>
      </div>

      {/* Filtros */}
      <div className="border border-gray-200 bg-white rounded-2xl p-4 mb-6 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por número do pedido ou nome do cliente"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {opcoesFiltro.map((opcao) => (
            <button
              key={opcao}
              type="button"
              onClick={() => setStatusFiltro(opcao)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                statusFiltro === opcao
                  ? "bg-primary-500 border-primary-500 text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opcao}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de pedidos */}
      {pedidos.length === 0 ? (
        <div className="border border-gray-200 bg-white rounded-2xl p-12 text-center space-y-3">
          <ClipboardList className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="font-semibold text-gray-900">Nenhum pedido encontrado</p>
          <p className="text-sm text-gray-500">
            Ajuste os filtros acima ou aguarde novos pedidos dos clientes.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidos.map((pedido) => {
            const seguinte = proximoStatus(pedido.status);
            const temObservacao = (pedido.items || []).some(
              (item) => item.note && item.note.trim() !== ""
            );
            const finalizado =
              pedido.status === "Entregue" || pedido.status === STATUS_CANCELADO;
            const aberto = expandido === pedido.number;

            return (
              <div
                key={pedido.number}
                className="border border-gray-200 bg-white rounded-2xl overflow-hidden"
              >
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Identificacao */}
                  <button
                    type="button"
                    onClick={() => setExpandido(aberto ? null : pedido.number)}
                    className="flex items-center gap-3 text-left flex-1 min-w-0"
                  >
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
                        aberto ? "rotate-180" : ""
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="font-extrabold text-gray-900">
                        #{pedido.number}
                        <span className="ml-2 font-medium text-gray-600 truncate">
                          {pedido.customerName}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatarDataHora(pedido.createdAt)} · {pedido.paymentMethod} ·{" "}
                        {(pedido.items || []).length}{" "}
                        {(pedido.items || []).length === 1 ? "item" : "itens"}
                      </p>

                      {/* Sem este aviso o funcionário teria que abrir todos os
                          pedidos para descobrir quais têm observação. */}
                      {temObservacao && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[11px] font-bold text-amber-800">
                          <MessageSquare className="w-3 h-3" />
                          Observação do cliente
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Total e status */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-primary-600">
                      {formatarBRL(pedido.total)}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-md border text-xs font-bold ${
                        CORES_STATUS[pedido.status] || CORES_STATUS.Recebido
                      }`}
                    >
                      {pedido.status}
                    </span>
                  </div>

                  {/* Acoes de status */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={pedido.status}
                      onChange={(e) =>
                        handleAlterarStatus(pedido.number, pedido.status, e.target.value)
                      }
                      aria-label={`Status do pedido ${pedido.number}`}
                      className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {TODOS_STATUS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {seguinte && (
                      <button
                        type="button"
                        onClick={() => handleAvancar(pedido.number)}
                        title={`Avançar para ${seguinte}`}
                        className="px-3 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold inline-flex items-center gap-1 transition-all"
                      >
                        <span className="hidden sm:inline">{seguinte}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}

                    {!finalizado && (
                      <button
                        type="button"
                        onClick={() => handleCancelar(pedido.number)}
                        title="Cancelar pedido"
                        className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-accent-600 hover:border-accent-200 transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Detalhes do pedido */}
                {aberto && (
                  <div className="border-t border-gray-100 bg-gray-50/60 p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                        Itens
                      </h2>
                      <ul className="divide-y divide-gray-200">
                        {(pedido.items || []).map((item) => (
                          <li key={item.id} className="py-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-700">
                                {item.quantity}x {item.name}
                              </span>
                              <span className="font-semibold text-gray-900">
                                {formatarBRL(item.price * item.quantity)}
                              </span>
                            </div>

                            {/* Observação que o cliente escreveu no carrinho.
                                É o que a cozinha precisa ver: alergia, item a
                                remover, pedido especial. */}
                            {item.note && item.note.trim() !== "" && (
                              <p className="mt-1.5 flex items-start gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-xs text-amber-900">
                                <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                <span>{item.note}</span>
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-between pt-3 mt-2 border-t border-gray-200 text-sm">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-primary-600">
                          {formatarBRL(pedido.total)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                        Histórico de status
                      </h2>
                      <ol className="space-y-2">
                        {(pedido.historicoStatus || []).map((registro, indice) => (
                          <li
                            key={`${registro.status}-${indice}`}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-700">{registro.status}</span>
                            <span className="text-gray-500 text-xs">
                              {formatarDataHora(registro.em)}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
