import React from "react";
import { Link } from "react-router-dom";
import { 
  Clock, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight,
  QrCode
} from "lucide-react";

export default function ComoFunciona() {
  const passos = [
    {
      step: "01",
      icon: Smartphone,
      title: "Escolha seu lanche online",
      description: "Acesse o cardápio digital de qualquer lugar do campus através do seu celular ou computador."
    },
    {
      step: "02",
      icon: QrCode,
      title: "Pague com PIX ou Cartão",
      description: "Realize o pagamento instantâneo e seguro sem precisar pegar fila no caixa."
    },
    {
      step: "03",
      icon: Clock,
      title: "Acompanhe o Status",
      description: "Receba notificações em tempo real enquanto sua refeição é preparada na cantina."
    },
    {
      step: "04",
      icon: CheckCircle2,
      title: "Retire com sua Senha",
      description: "Vá ao balcão exclusivo de retirada rápida assim que sua senha for chamada."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Como funciona a <span className="text-primary-600">Cantina IFRS</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Desenvolvido para otimizar o tempo dos estudantes e servidores. Peça online, pague com praticidade e aproveite seu intervalo ao máximo.
          </p>
        </div>

        {/* Como Funciona - Passos */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900">Passo a Passo Simples</h2>
            <p className="text-sm text-gray-500 mt-1">Em apenas 4 etapas você garante seu lanche sem complicações</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {passos.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-gray-200 relative flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-3xl font-black text-gray-200">{item.step}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold">Pronto para fazer seu primeiro pedido?</h2>
            <p className="text-primary-100 text-sm sm:text-base">
              Explore nosso cardápio completo e experimente a facilidade de pedir sem pegar filas.
            </p>
          </div>
          <Link
            to="/cardapio"
            className="px-8 py-4 bg-white text-primary-700 hover:bg-primary-50 font-bold rounded-xl transition-all inline-flex items-center gap-2 shrink-0"
          >
            <span>Ir para o Cardápio</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
