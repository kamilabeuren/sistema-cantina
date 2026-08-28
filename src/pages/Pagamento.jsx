import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  CreditCard,
  ShoppingBag,
  Wallet,
  X,
} from "lucide-react";

import { criarPedido, formatarBRL } from "../services/pedidoService";
import { listarCarrinho, salvarCarrinho } from "../services/carrinhoService";
import { getCurrentUser } from "../services/authService";

const TAXA_CONVENIENCIA = 0.06;

const onlyDigits = (value) => value.replace(/\D/g, "");

function isValidCpf(value) {
  const cpf = onlyDigits(value);

  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  const calculateDigit = (base) => {
    const sum = base
      .split("")
      .reduce(
        (total, digit, index) =>
          total + Number(digit) * (base.length + 1 - index),
        0
      );

    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return (
    calculateDigit(cpf.slice(0, 9)) === Number(cpf[9]) &&
    calculateDigit(cpf.slice(0, 10)) === Number(cpf[10])
  );
}

function isValidCardNumber(value) {
  const number = onlyDigits(value);

  if (number.length !== 16) return false;

  let sum = 0;
  let doubleDigit = false;

  for (let index = number.length - 1; index >= 0; index--) {
    let digit = Number(number[index]);

    if (doubleDigit) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    doubleDigit = !doubleDigit;
  }

  return sum % 10 === 0;
}

function isValidExpiry(value) {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
    return false;
  }

  const [month, year] = value.split("/").map(Number);

  return new Date(2000 + year, month) > new Date();
}

export default function Pagamento() {
  const navigate = useNavigate();

  const [cart] = useState(() => listarCarrinho());
  const [customerName, setCustomerName] = useState(
    () => getCurrentUser()?.nome || ""
  );
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cpfPix, setCpfPix] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [pixModalOpen, setPixModalOpen] = useState(false);
  const [pixCode, setPixCode] = useState("");
  const [pixCopied, setPixCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(600);

  const [card, setCard] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
    cpf: "",
  });

  const [orderDate] = useState(() => new Date());

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const taxa = subtotal * TAXA_CONVENIENCIA;
  const total = subtotal + taxa;

  useEffect(() => {
    if (!pixModalOpen) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [pixModalOpen]);

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(orderDate);

  const formatTime = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = String(secondsLeft % 60).padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  const finishOrder = (method) => {
    setError("");

    if (submitting) return;

    if (cart.length === 0) {
      setError("Seu carrinho está vazio. Adicione itens antes de finalizar.");
      return;
    }

    if (!customerName.trim()) {
      setError("Informe o nome do cliente.");
      return;
    }

    setSubmitting(true);

    try {
      const usuario = getCurrentUser();

      const pedido = criarPedido({
        items: cart,
        customerName,
        paymentMethod: method,
        subtotal,
        taxa,
        total,
        userId: usuario ? usuario.id : null,
      });

      salvarCarrinho([]);
      navigate(`/pedido/${pedido.number}`);
    } catch {
      setError("Não foi possível finalizar o pedido. Tente novamente.");
      setSubmitting(false);
    }
  };

  const openPixModal = () => {
    setError("");

    if (cart.length === 0) {
      setError("Seu carrinho está vazio.");
      return;
    }

    if (!customerName.trim()) {
      setError("Informe o nome do cliente.");
      return;
    }

    if (!isValidCpf(cpfPix)) {
      setError("Informe um CPF válido para pagar com PIX.");
      return;
    }

    setSecondsLeft(600);
    setPixCode("");
    setPixCopied(false);
    setPixModalOpen(true);
  };

  const copyPixCode = async () => {
    const generatedCode =
      pixCode ||
      `PIX-${Math.floor(
        100000000000 + Math.random() * 900000000000
      )}-${total.toFixed(2).replace(".", "")}`;

    setPixCode(generatedCode);
    setPixCopied(true);

    try {
      await navigator.clipboard.writeText(generatedCode);
    } catch {
      // O código continua visível para cópia manual.
    }
  };

  const changeCardField = (field, value) => {
    let formattedValue = value;

    if (field === "number") {
      formattedValue = onlyDigits(value).slice(0, 16);
    }

    if (field === "cvv") {
      formattedValue = onlyDigits(value).slice(0, 4);
    }

    if (field === "cpf") {
      formattedValue = onlyDigits(value).slice(0, 11);
    }

    if (field === "expiry") {
      const digits = onlyDigits(value).slice(0, 4);

      formattedValue =
        digits.length > 2
          ? `${digits.slice(0, 2)}/${digits.slice(2)}`
          : digits;
    }

    setCard({ ...card, [field]: formattedValue });
  };

  const handleCardPayment = (event) => {
    event.preventDefault();
    setError("");

    if (!customerName.trim()) {
      setError("Informe o nome do cliente.");
      return;
    }

    if (card.name.trim().length < 3) {
      setError("Informe o nome impresso no cartão.");
      return;
    }

    if (!isValidCardNumber(card.number)) {
      setError("Informe um número de cartão válido.");
      return;
    }

    if (!isValidExpiry(card.expiry)) {
      setError("Informe uma data de validade futura no formato MM/AA.");
      return;
    }

    if (!/^\d{3,4}$/.test(card.cvv)) {
      setError("O CVV deve ter 3 ou 4 números.");
      return;
    }

    if (!isValidCpf(card.cpf)) {
      setError("Informe um CPF válido.");
      return;
    }

    finishOrder("Cartão de crédito");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        <section className="lg:col-span-7 space-y-8">
          <div className="space-y-4 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Finalize seu <span className="text-primary-600">pedido</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Confira os dados do pedido e escolha a forma de pagamento.
            </p>
          </div>

          <section className="border border-gray-200 bg-white rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
                Seu pedido
              </span>

              <span className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                <ShoppingBag className="w-4 h-4 text-primary-600" />
                {cart.length} {cart.length === 1 ? "item" : "itens"}
              </span>
            </div>

            <div className="border-y border-gray-100 py-4 space-y-1">
              <p className="text-sm text-gray-500">Nome do cliente</p>

              <p className="font-bold text-gray-900">
                {customerName || "Aguardando preenchimento"}
              </p>

              <p className="pt-2 font-semibold text-primary-700">
                Cantina IFRS Campus Farroupilha
              </p>

              <p className="text-sm text-gray-500">
                Data do pedido: {formattedDate}
              </p>
            </div>

            {cart.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                Seu carrinho está vazio.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {cart.map((item) => (
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
            )}

            <div className="pt-3 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Valor dos itens</span>
                <span>{formatarBRL(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Taxa de conveniência</span>
                <span>{formatarBRL(taxa)}</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-900">Valor total</span>

                <span className="font-bold text-primary-600 text-lg">
                  {formatarBRL(total)}
                </span>
              </div>
            </div>
          </section>
        </section>

        <section className="lg:col-span-5 relative w-full max-w-md mx-auto">
          <div className="border border-gray-200 bg-white rounded-2xl p-5 space-y-5">
            <span className="inline-block px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
              Pagamento
            </span>

            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
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
              <p className="mb-2 text-sm font-semibold text-gray-700">
                Forma de pagamento
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("pix");
                    setError("");
                  }}
                  className={`p-4 rounded-xl border font-semibold flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === "pix"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  PIX
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("card");
                    setError("");
                  }}
                  className={`p-4 rounded-xl border font-semibold flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === "card"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  Cartão de crédito
                </button>
              </div>
            </div>

            {paymentMethod === "pix" && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="cpfPix"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    CPF
                  </label>

                  <input
                    id="cpfPix"
                    inputMode="numeric"
                    value={cpfPix}
                    onChange={(event) =>
                      setCpfPix(onlyDigits(event.target.value).slice(0, 11))
                    }
                    placeholder="Somente números"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  />
                </div>

                <button
                  type="button"
                  onClick={openPixModal}
                  disabled={cart.length === 0}
                  className="w-full py-4 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold"
                >
                  Pagar com PIX
                </button>
              </div>
            )}

            {paymentMethod === "card" && (
              <form onSubmit={handleCardPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome no cartão
                  </label>

                  <input
                    value={card.name}
                    onChange={(event) =>
                      changeCardField("name", event.target.value)
                    }
                    placeholder="Nome impresso no cartão"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Número do cartão
                  </label>

                  <input
                    inputMode="numeric"
                    value={card.number}
                    onChange={(event) =>
                      changeCardField("number", event.target.value)
                    }
                    placeholder="16 dígitos"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expira em
                    </label>

                    <input
                      inputMode="numeric"
                      value={card.expiry}
                      onChange={(event) =>
                        changeCardField("expiry", event.target.value)
                      }
                      placeholder="MM/AA"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CVV
                    </label>

                    <input
                      inputMode="numeric"
                      value={card.cvv}
                      onChange={(event) =>
                        changeCardField("cvv", event.target.value)
                      }
                      placeholder="3 ou 4 dígitos"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CPF do titular
                  </label>

                  <input
                    inputMode="numeric"
                    value={card.cpf}
                    onChange={(event) =>
                      changeCardField("cpf", event.target.value)
                    }
                    placeholder="Somente números"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || cart.length === 0}
                  className="w-full py-4 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold"
                >
                  Pagar
                </button>
              </form>
            )}

            {error && (
              <p className="text-sm text-accent-600 bg-accent-50 border border-accent-100 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <Link
              to="/carrinho"
              className="w-full py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para o carrinho
            </Link>
          </div>
        </section>
      </div>

      {pixModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 p-4 flex items-center justify-center">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-primary-600">
                  Cantina IFRS Campus Farroupilha
                </p>

                <h2 className="text-2xl font-extrabold text-gray-900">
                  Pagamento via PIX
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setPixModalOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Fechar modal"
              >
                <X />
              </button>
            </div>

            <p className="text-gray-600">
              Toque no botão abaixo para copiar o código PIX e realizar o
              pagamento deste pedido.
            </p>

            <p className="text-gray-600">
              Após copiado, abra o app do seu banco e utilize a opção copia e
              cola.
            </p>

            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">
                Valor a pagar: {formatarBRL(total)}
              </p>

              <p className="text-sm text-gray-600 mt-2">
                Tempo restante para pagamento
              </p>

              <p className="text-3xl font-extrabold text-primary-700">
                {formatTime()}
              </p>
            </div>

            {pixCode && (
              <p className="text-xs break-all bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-600">
                {pixCode}
              </p>
            )}

            <button
              type="button"
              onClick={copyPixCode}
              disabled={secondsLeft === 0}
              className="w-full py-4 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2"
            >
              <Copy className="w-5 h-5" />
              {pixCopied ? "Código PIX copiado!" : "Copiar código PIX"}
            </button>

            <button
              type="button"
              onClick={() => finishOrder("PIX")}
              disabled={!pixCopied || secondsLeft === 0 || submitting}
              className="w-full py-3 rounded-xl border border-primary-500 text-primary-700 font-bold disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5 inline mr-2" />
              Já realizei o pagamento
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
