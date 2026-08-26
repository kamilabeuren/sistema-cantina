// src/pages/MeusPedidos.jsx
// Histórico de pedidos do cliente.

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, ArrowRight, ShoppingBag } from "lucide-react";
import {
  listarPedidosDoUsuario,
  formatarBRL,
  formatarDataHora,
  CORES_STATUS,
} from "../services/pedidoService";
import { getCurrentUser } from "../services/authService";
import { useVersaoPedidos } from "../hooks/useVersaoPedidos";

export default function MeusPedidos() {
  const usuario = getCurrentUser();

  // O cliente ve a mudança de status assim que o admin altera no painel.
  const versao = useVersaoPedidos();
  const pedidos = useMemo(
    () => listarPedidosDoUsuario(usuario ? usuario.id : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- versão é só o gatilho que refaz o cálculo quando um pedido muda
    [usuario, versao]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="space-y-2 mb-8">
        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
          <ClipboardList className="w-3.5 h-3.5" />
          Meus pedidos
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
          Histórico de <span className="text-primary-600">pedidos</span>
        </h1>
        <p className="text-gray-600">
          {usuario
            ? `Pedidos feitos com a conta de ${usuario.nome}.`
            : "Pedidos feitos neste dispositivo. Entre na sua conta para manter seu histórico salvo."}
        </p>
      </div>

      {pedidos.length === 0 ? (
        <div className="border border-gray-200 bg-white rounded-2xl p-12 text-center space-y-4">
          <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="font-semibold text-gray-900">
            Você ainda não fez nenhum pedido
          </p>
          <p className="text-sm text-gray-500">
            Escolha seus lanches favoritos no cardápio e faça o primeiro pedido.
          </p>
          <Link
            to="/cardapio"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold transition-all"
          >
            Ver cardápio
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidos.map((pedido) => (
            <Link
              key={pedido.number}
              to={`/pedido/${pedido.number}`}
              className="block border border-gray-200 bg-white rounded-2xl p-5 hover:border-primary-200 hover:bg-primary-50/30 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-extrabold text-gray-900">
                    Pedido #{pedido.number}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatarDataHora(pedido.createdAt)} · {pedido.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center gap-3">
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
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">
                {(pedido.items || [])
                  .map((item) => `${item.quantity}x ${item.name}`)
                  .join(", ")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
