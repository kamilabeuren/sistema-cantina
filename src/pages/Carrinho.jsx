// src/pages/Carrinho.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import {
  listarCarrinho,
  alterarQuantidade,
  excluirCarrinho,
} from "../services/carrinhoService";

const MAX_NOTE_LENGTH = 150;

export default function Carrinho() {
  const [itens, setItens] = useState([]);

  const atualizarEstado = () => {
    setItens(listarCarrinho());
  };

  useEffect(() => {
    atualizarEstado();

    // Ouve o evento dentro de salvarCarrinho()
    const ouvirAtualizacao = () => atualizarEstado();
    window.addEventListener("carrinhoAtualizado", ouvirAtualizacao);

    return () => {
      window.removeEventListener("carrinhoAtualizado", ouvirAtualizacao);
    };
  }, []);

  const formatBRL = (value) => `R$ ${Number(value).toFixed(2).replace(".", ",")}`;

  const total = itens.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Decremento vai confirmar antes de remover quando a quantidade for 1
  const botaoDecrementar = (item) => {
    if (item.quantity === 1) {
      const confirmar = window.confirm(
        `Remover "${item.name}" do carrinho?`
      );
      if (confirmar) {
        alterarQuantidade(item.id, { quantity: 0 }); // aciona a trava do service
      }
      return; // se cancelar não muda, quantidade permanece 1
    }
    alterarQuantidade(item.id, { quantity: item.quantity - 1 });
  };

  const botaoIncrementar = (item) => {
    alterarQuantidade(item.id, { quantity: item.quantity + 1 });
  };

  // Observação salva quando o campo perde o foco
  const notaSalvarSemFoco = (item, event) => {
    const texto = event.target.value.slice(0, MAX_NOTE_LENGTH);
    if (texto !== item.note) {
      alterarQuantidade(item.id, { note: texto });
    }
  };

  const removerItem = (item) => {
    const confirmar = window.confirm(
        `Remover "${item.name}" do carrinho?`
    );
    if (confirmar) {
        excluirCarrinho(item.id); //mesma lógica de confirmação
    }
    return;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="space-y-4 text-center lg:text-left mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
          Seu <span className="text-primary-600">carrinho</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Confira os itens antes de seguir para o pagamento.
        </p>
      </div>

      {itens.length === 0 ? (
        <div className="border border-gray-200 bg-white rounded-2xl p-10 text-center space-y-5">
          <ShoppingBag className="w-12 h-12 text-primary-600 mx-auto" />
          <p className="text-gray-600">Seu carrinho está vazio.</p>
          <Link
            to="/cardapio"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold transition-all"
          >
            Ver Cardápio
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <ul className="space-y-4">
            {itens.map((item) => (
              <li
                key={item.id}
                className="border border-gray-200 bg-white rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatBRL(item.price)} / unidade
                    </p>
                  </div>

                  <button
                    onClick={() => removerItem(item)}
                    aria-label={`Remover ${item.name}`}
                    className="text-gray-400 hover:text-accent-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => botaoDecrementar(item)}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="w-6 text-center font-semibold text-gray-900">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => botaoIncrementar(item)}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="font-bold text-gray-900">
                    {formatBRL(item.price * item.quantity)}
                  </span>
                </div>

                <div>
                  <label
                    htmlFor={`note-${item.id}`}
                    className="block text-xs font-semibold text-gray-500 mb-1"
                  >
                    Observação (opcional)
                  </label>
                  <textarea
                    id={`note-${item.id}`}
                    defaultValue={item.note}
                    onBlur={(e) => notaSalvarSemFoco(item, e)}
                    maxLength={MAX_NOTE_LENGTH}
                    placeholder="Ex: sem cebola, alergia a amendoim..."
                    rows={2}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>
              </li>
            ))}
          </ul>

          <div className="border border-gray-200 bg-white rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-primary-600 text-xl">
                {formatBRL(total)}
              </span>
            </div>

            <Link
              to="/pagamento"
              className="w-full px-8 py-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-base inline-flex items-center justify-center gap-2 transition-all"
            >
              <span>Ir para pagamento</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}