// src/pages/Pagamento.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Wallet, CreditCard, Banknote, ShoppingBag } from "lucide-react";
import { criarPedido, formatarBRL } from "../services/pedidoService";
import { listarCarrinho, salvarCarrinho } from "../services/carrinhoService";
import { getCurrentUser } from "../services/authService";

const TAXA_CONVENIENCIA = 0.06; // 6% sobre o subtotal

export default function Pagamento() {
  const navigate = useNavigate();
  // O carrinho é lido uma vez ao abrir a tela de pagamento.
  const [cart] = useState(() => listarCarrinho());
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );
  const taxa = useMemo(() => subtotal * TAXA_CONVENIENCIA, [subtotal]);
  const total = subtotal + taxa;

  const paymentOptions = [
    { value: "Pix", label: "Pix", icon: Wallet },
    { value: "Cartão", label: "Cartão", icon: CreditCard },
    { value: "Dinheiro", label: "Dinheiro", icon: Banknote },
  ];

  const handleFinishOrder = (event) => {
    event.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Seu carrinho está vazio. Adicione itens antes de finalizar o pedido.");
      return;
    }
    if (!customerName.trim()) {
      setError("Informe o nome do cliente.");
      return;
    }
    if (!paymentMethod) {
      setError("Selecione uma forma de pagamento.");
      return;
    }

    setSubmitting(true);

    // O pedido é criado pelo pedidoService, que gera o número,
    // define o status inicial e grava a lista no LocalStorage.
    const usuario = getCurrentUser();

    const pedido = criarPedido({
      items: cart,
      customerName,
      paymentMethod,
      subtotal,
      taxa,
      total,
      userId: usuario ? usuario.id : null,
    });

    // Esvazia o carrinho pelo service para o contador da Navbar atualizar.
    salvarCarrinho([]);

    navigate(`/pedido/${pedido.number}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

        {/* Coluna esquerda: título + resumo do pedido, no espírito da Home */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Finalize seu <span className="text-primary-600">pedido</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Confira o resumo abaixo, informe seus dados e escolha a forma de pagamento para retirar seu lanche na cantina.
            </p>
          </div>

          <div className="border border-gray-200 bg-white rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
                Seu Pedido
              </span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                <ShoppingBag className="w-4 h-4 text-primary-600" />
                {cart.length} {cart.length === 1 ? "item" : "itens"}
              </span>
            </div>

            {cart.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">Seu carrinho está vazio.</p>
            ) : (
              <ul className="divide-y divide-gray-100 border-t border-gray-100">
                {cart.map((item) => (
                  <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                    <span className="text-gray-700">{item.quantity}x {item.name}</span>
                    <span className="font-semibold text-gray-900">
                      {formatarBRL(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="pt-3 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatarBRL(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Taxa de conveniência</span>
                <span>{formatarBRL(taxa)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-primary-600 text-lg">{formatarBRL(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna direita: formulário, mesmo cartão flutuante da Home */}
        <div className="lg:col-span-5 relative w-full max-w-md mx-auto">
          <form
            onSubmit={handleFinishOrder}
            className="relative border border-gray-200 bg-white rounded-2xl p-5 space-y-5"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
                Pagamento
              </span>
            </div>

            <div>
              <label htmlFor="customerName" className="block text-sm font-semibold text-gray-700 mb-2">
                Nome do cliente
              </label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Digite seu nome"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <span className="block text-sm font-semibold text-gray-700 mb-2">Forma de pagamento</span>
              <div className="grid grid-cols-3 gap-2">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = paymentMethod === option.value;
                  return (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => setPaymentMethod(option.value)}
                      className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <p className="text-xs text-accent-600 bg-accent-50 border border-accent-100 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || cart.length === 0}
              className="w-full px-8 py-4 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base inline-flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Finalizar pedido</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}