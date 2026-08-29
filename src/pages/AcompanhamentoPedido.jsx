import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2,
  ShoppingBag,
  User,
  CreditCard,
  Receipt,
  ArrowLeft,
  Clock,
  Circle,
} from "lucide-react";
import {
  buscarPedidoPorNumero,
  formatarBRL,
  formatarDataHora,
  STATUS_PEDIDO,
  STATUS_CANCELADO,
  CORES_STATUS,
} from "../services/pedidoService";
import { useVersaoPedidos } from "../hooks/useVersaoPedidos";

export default function AcompanhamentoPedido() {
  const { id } = useParams();

  // Mantém a tela sincronizada: se o admin mudar o status no painel,
  // o cliente vê a mudança sem precisar recarregar a página.
  const versao = useVersaoPedidos();
  const order = useMemo(
    () => buscarPedidoPorNumero(id),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- versão é só o gatilho que refaz o cálculo quando um pedido muda
    [id, versao]
  );

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="border border-gray-200 bg-white rounded-2xl p-8 text-center space-y-5">
            <Receipt className="w-12 h-12 text-primary-600 mx-auto" />

            <h1 className="text-3xl font-extrabold text-gray-900">
              Pedido não encontrado
            </h1>

            <p className="text-gray-600">
              Não foi possível encontrar as informações desse pedido.
            </p>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para a Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

        {/* Coluna esquerda */}
        <div className="lg:col-span-7 space-y-8">

          <div className="space-y-4 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <CheckCircle2 className="w-12 h-12 text-primary-600" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Pedido <span className="text-primary-600">confirmado!</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Seu pedido foi recebido com sucesso. Acompanhe as informações
              abaixo.
            </p>
          </div>

          {/* Status do pedido */}
          <div className="border border-gray-200 bg-white rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
                Status do pedido
              </span>

              <span
                className={`px-2.5 py-1 rounded-md border text-xs font-bold ${
                  CORES_STATUS[order.status] || CORES_STATUS.Recebido
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <p className="text-sm text-gray-500 mb-1">Número do pedido</p>
              <p className="text-2xl font-extrabold text-gray-900">#{order.number}</p>
            </div>

            {order.status === STATUS_CANCELADO ? (
              <div className="border-t border-gray-100 pt-5">
                <p className="text-sm font-semibold text-accent-600">
                  Este pedido foi cancelado pela cantina.
                </p>
              </div>
            ) : (
              <ol className="border-t border-gray-100 pt-5 space-y-4">
                {STATUS_PEDIDO.map((etapa) => {
                  const posicaoEtapa = STATUS_PEDIDO.indexOf(etapa);
                  const posicaoAtual = STATUS_PEDIDO.indexOf(order.status);
                  const concluida = posicaoEtapa < posicaoAtual;
                  const atual = posicaoEtapa === posicaoAtual;

                  const registro = (order.historicoStatus || []).find(
                    (item) => item.status === etapa
                  );

                  return (
                    <li key={etapa} className="flex items-start gap-3">
                      {concluida ? (
                        <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0" />
                      ) : atual ? (
                        <Clock className="w-5 h-5 text-primary-600 shrink-0 animate-pulse" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                      )}

                      <div>
                        <p
                          className={`text-sm ${
                            concluida || atual
                              ? "font-semibold text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {etapa}
                        </p>
                        {registro && (
                          <p className="text-xs text-gray-500">
                            {formatarDataHora(registro.em)}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          {/* Informações do cliente */}
          <div className="border border-gray-200 bg-white rounded-2xl p-5 space-y-4">
            <span className="px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
              Informações
            </span>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary-600" />

                <div>
                  <p className="text-xs text-gray-500">
                    Cliente
                  </p>

                  <p className="font-semibold text-gray-900">
                    {order.customerName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-primary-600" />

                <div>
                  <p className="text-xs text-gray-500">
                    Forma de pagamento
                  </p>

                  <p className="font-semibold text-gray-900">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna direita */}
        <div className="lg:col-span-5 relative w-full max-w-md mx-auto">
          <div className="relative border border-gray-200 bg-white rounded-2xl p-5 space-y-5">

            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
                Comprovante
              </span>

              <ShoppingBag className="w-5 h-5 text-primary-600" />
            </div>

            {/* Itens */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Itens do pedido
              </h2>

              <ul className="divide-y divide-gray-100 border-t border-gray-100">
                {order.items?.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <span className="text-gray-700">
                      {item.quantity}x {item.name}
                    </span>

                    <span className="font-semibold text-gray-900">
                      {formatarBRL(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Valores */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatarBRL(order.subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Taxa de conveniência</span>
                <span>{formatarBRL(order.taxa)}</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-900">
                  Total
                </span>

                <span className="font-bold text-primary-600 text-lg">
                  {formatarBRL(order.total)}
                </span>
              </div>
            </div>

            {/* Mensagem */}
            <div className="bg-primary-50 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-primary-700">
                Obrigado pela sua compra!
              </p>

              <p className="text-xs text-gray-600 mt-1">
                Aguarde a preparação do seu pedido.
              </p>
            </div>

            <Link
              to="/"
              className="w-full px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para a Home
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}