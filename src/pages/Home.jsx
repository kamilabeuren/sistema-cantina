import React from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Clock, 
  Smartphone, 
  QrCode, 
  CheckCircle2 
} from "lucide-react";

export default function Home() {
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

  const scrollToComoFunciona = (e) => {
    e.preventDefault();
    const element = document.getElementById("como-funciona");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-12 lg:py-20">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Alimente sua rotina. <br />
                <span className="text-primary-600">Sem perder o intervalo.</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Faça seu pedido online de onde estiver no campus, evite as filas e retire seu lanche pronto diretamente no balcão da cantina.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/cardapio"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-base inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Ver Cardápio</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                type="button"
                onClick={scrollToComoFunciona}
                className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold text-base inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Como funciona</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative w-full max-w-md mx-auto">
            <div className="relative border border-gray-200 bg-white rounded-2xl p-5 space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
                  Mais Vendido
                </span>
                <span className="text-sm font-bold text-gray-900">
                  Combo IFRS
                </span>
              </div>

              <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-100 relative">
                <img
                  src="/pao-de-queijo-suco.png"
                  alt="Combo Pão de Queijo + Suco"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-bold">
                  R$ 9,50
                </div>
              </div>

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

            <div className="hidden sm:block absolute -bottom-6 -left-6 border border-gray-200 bg-white rounded-xl p-4 w-48 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse"></span>
                <span className="text-xs font-bold text-gray-800">Pronto para Retirada</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">Senha #304</div>
              <div className="text-[11px] text-gray-500 text-balance">Seu pão de queijo está quentinho te esperando.</div>
            </div>

          </div>

        </div>
      </section>

      {/* Seção Como Funciona */}
      <section id="como-funciona" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {passos.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 text-primary-600 flex items-center justify-center font-bold">
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
      </section>

    </div>
  );
}