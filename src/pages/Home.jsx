import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Coffee } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Lado Esquerdo: Conteúdo Textual e CTA */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          
          {/* Título Principal */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Alimente sua rotina. <br />
              <span className="text-primary-600">Sem perder o intervalo.</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Faça seu pedido online de onde estiver no campus, evite as filas e retire seu lanche pronto diretamente no balcão da cantina.
            </p>
          </div>

          {/* Área de Botões (CTA) - Centralizada em telas pequenas, alinhada à esquerda em telas grandes */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              to="/cardapio"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-base inline-flex items-center justify-center gap-2"
            >
              <span>Ver Cardápio</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/como-funciona"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold text-base inline-flex items-center justify-center gap-2"
            >
              <span>Como funciona</span>
            </Link>
          </div>

        </div>

        {/* Lado Direito: Preview de Interface Minimalista (Estética de Cantina) */}
        <div className="lg:col-span-5 relative w-full max-w-md mx-auto">
          {/* Card Mockup de Produto 1 */}
          <div className="relative border border-gray-200 bg-white rounded-2xl p-5 space-y-4">
            
            {/* Header do Mockup */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
                Mais Vendido
              </span>
              <span className="text-sm font-bold text-gray-900">
                Combo IFRS Class
              </span>
            </div>

            {/* Imagem do Produto Gerado */}
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-100 relative">
              <img
                src="/pao-de-queijo-suco.png"
                alt="Combo Pão de Queijo + Suco"
                className="w-full h-full object-cover"
              />
              {/* Badge de Preço */}
              <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-bold">
                R$ 9,50
              </div>
            </div>

            {/* Informações Extras de Usabilidade */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>Preparo: 8-12 min</span>
              </div>
              <div className="text-gray-500">
                <span>Retirada Rápida</span>
              </div>
            </div>

          </div>

          {/* Card Flutuante 2 (Minimalista e Clean Overlay) */}
          <div className="hidden sm:block absolute -bottom-6 -left-6 border border-gray-200 bg-white rounded-xl p-4 w-56 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse"></span>
              <span className="text-xs font-bold text-gray-800">Pronto para Retirada</span>
            </div>
            <div className="text-sm font-semibold text-gray-900">Senha #304</div>
            <div className="text-[11px] text-gray-500">Seu pão de queijo está quentinho te esperando.</div>
          </div>

        </div>

      </div>
    </div>
  );
}