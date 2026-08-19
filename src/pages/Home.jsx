import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Smartphone,
  QrCode,
  CheckCircle2,
  Plus,
  Sparkles
} from "lucide-react";

export default function Home() {
  const passos = [
    {
      step: "01",
      icon: Smartphone,
      title: "Escolha seu lanche",
      description: "Acesse o cardápio digital e monte seu pedido em segundos."
    },
    {
      step: "02",
      icon: QrCode,
      title: "Pague online",
      description: "Pagamento rápido via PIX ou cartão sem filas no caixa."
    },
    {
      step: "03",
      icon: CheckCircle2,
      title: "Retire no balcão",
      description: "Acompanhe o status e retire o pedido com sua senha."
    }
  ];

  const produtosDestaque = [
    {
      id: "prod-1",
      badge: "O mais vendido",
      tempo: "8-12 min",
      nome: "Combo Pão de Queijo + Suco",
      descricao: "3 pães artesanais e suco natural",
      preco: "R$ 9,50",
      imagem: "/combo-pao-queijo.jpg",
      alt: "Combo Pão de Queijo + Suco Natural",
    },
    {
      id: "prod-2",
      badge: "Destaque do Dia",
      tempo: "10-15 min",
      nome: "Burger Smash Especial",
      descricao: "Blend 160g, cheddar, bacon e salada",
      preco: "R$ 17,50",
      imagem: "/burger-artesanal.jpg",
      alt: "Burger Smash Artesanal",
    },
    {
      id: "prod-3",
      badge: "Opção Saudável",
      tempo: "5-8 min",
      nome: "Sanduíche Natural de Frango",
      descricao: "Pão integral, frango grelhado e salada",
      preco: "R$ 12,00",
      imagem: "/sanduiche-natural.jpg",
      alt: "Sanduíche Natural de Frango",
    }
  ];

  return (
    <div className="bg-white py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Layout Grid:
            Hero + 3 Steps (Coluna Esquerda) | 3 Produtos Destaque (Coluna Direita)
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[1fr_auto] gap-8 lg:gap-x-10 lg:gap-y-4 items-stretch">

          {/* 1. Hero Section: Topo no mobile (order-1), Linha 1 no desktop (lg:col-span-8 lg:row-start-1) */}
          <div className="order-1 lg:col-span-8 lg:row-start-1 flex flex-col justify-center py-2 sm:py-4 h-full relative isolate">
            {/* Pattern de fundo cinza clarinho atrás do container do h1 sumindo para o transparente */}
            <div
              className="absolute -inset-16 sm:-inset-24 lg:-inset-36 pointer-events-none select-none -z-10 bg-[url('/hero-pattern.svg')] bg-repeat"
              style={{
                backgroundSize: "24px 24px",
                maskImage: "radial-gradient(ellipse 85% 80% at 38% 45%, black 35%, transparent 82%)",
                WebkitMaskImage: "radial-gradient(ellipse 85% 80% at 38% 45%, black 35%, transparent 82%)"
              }}
            />

            <div className="space-y-6 text-center lg:text-left relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-gray-100 text-gray-900 text-xs font-bold tracking-wide">
                <span>Cantina digital IFRS</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-semi-bold tracking-tight text-gray-900 leading-[1.12]">
                  Alimente sua rotina. <br />
                  <span className="text-primary-600">Sem perder o intervalo.</span>
                </h1>
                <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Faça seu pedido online de onde estiver no campus, evite as filas e retire seu lanche pronto diretamente no balcão da cantina.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
                <Link
                  to="/cardapio"
                  className="w-full sm:w-auto pl-8 pr-6.5 py-4 rounded-full border border-primary-500 bg-primary-500 hover:bg-primary-600 text-white font-bold text-base inline-flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-98"
                >
                  <span>Ver cardápio</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#como-funciona"
                  className="bg-white w-full sm:w-auto px-8 py-4 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold text-base inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Como funciona</span>
                </a>
              </div>
            </div>
          </div>

          {/* 2. Products Section: Segundo no mobile (order-2), Coluna da Direita no desktop (lg:col-start-9 lg:col-end-13 lg:row-start-1 lg:row-span-2) */}
          <div className="order-2 lg:col-start-9 lg:col-end-13 lg:row-start-1 lg:row-span-2 grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col lg:justify-between gap-4 w-full h-full relative z-10">
            {produtosDestaque.map((produto) => (
              <div
                key={produto.id}
                className="h-56.25 sm:h-58.75 w-full relative bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between p-3 sm:p-3.5 shrink-0"
              >
                {/* Imagem preenchendo o card (object-cover sem distorção e integrada ao primary-50) */}
                <img
                  src={produto.imagem}
                  alt={produto.alt}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
                />

                {/* Top Bar: Pill translúcido com Badge (esq) e Pill translúcido com Tempo (dir) */}
                <div className="flex items-center justify-between relative z-10">
                  <span className="backdrop-blur-md bg-white/75 text-gray-900 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border border-white/80 select-none">
                    {produto.badge}
                  </span>

                  <span className="backdrop-blur-md bg-white/75 text-gray-800 text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full border border-white/80 inline-flex items-center gap-1.5 select-none">
                    <Clock className="w-3.5 h-3.5 text-primary-600" />
                    <span>{produto.tempo}</span>
                  </span>
                </div>

                {/* Bottom Bar: Barra em Glassmorphism compacta */}
                <div className="relative z-10 backdrop-blur-md bg-white/85 border border-white/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-2.5">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <h3 className="font-extrabold text-gray-900 text-xs sm:text-sm leading-tight truncate">
                      {produto.nome}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-primary-700 leading-tight">
                      {produto.preco}
                    </p>
                  </div>

                  <Link
                    to="/cardapio"
                    className="bg-gray-900 hover:bg-black text-white font-bold text-xs px-3.5 sm:px-4 py-1.5 rounded-full transition-colors inline-flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-3 text-white" />
                    <span>Pedir</span>
                  </Link>
                </div>

              </div>
            ))}
          </div>

          {/* 3. Como Funciona: Terceiro no mobile (order-3), Linha 2 alinhado na base no desktop (lg:col-span-8 lg:row-start-2 lg:self-end) */}
          <div id="como-funciona" className="order-3 lg:col-span-8 lg:row-start-2 lg:self-end w-full relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
              {passos.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="h-56.25 sm:h-58.75 bg-gray-50/80 rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 border border-gray-100 flex flex-col justify-between"
                  >
                    {/* Título e Descrição na base */}
                    <div className="px-1 pt-3 space-y-0.5">
                      <h3 className="text-lg mb-2 lg:text-lg font-bold text-gray-900 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-balance sm:text-sm text-gray-500 font-normal leading-5">
                        {item.description}
                      </p>
                    </div>
                    {/* Container cinza arredondado preenchendo a área superior */}
                    <div className="bg-white shadow-xs rounded-xl sm:rounded-2xl p-4 sm:p-4.5 flex items-center justify-between h-16.5">
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600 stroke-[1.5]" strokeWidth={1.5} />
                      <span className="text-2xl sm:text-3xl font-black text-gray-300">
                        {item.step}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}