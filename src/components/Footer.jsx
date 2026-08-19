import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-200/80 text-gray-600 text-sm mt-auto pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Brand & Slogan */}
          <div className="md:col-span-6 lg:col-span-7 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/ifrs-logo.svg"
                alt="IFRS Logo"
                className="h-10 w-auto object-contain"
              />
              <div className="flex flex-col border-l border-gray-200 pl-3">
                <span className="font-bold text-lg text-gray-900 leading-tight">
                  Cantina <span className="text-primary-600">IFRS</span>
                </span>
                <span className="text-[10px] tracking-wider font-semibold uppercase text-gray-400">
                  Campus Farroupilha
                </span>
              </div>
            </Link>
            
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Desenvolvido para facilitar o intervalo de estudantes e servidores — peça online, evite filas e retire com facilidade.
            </p>
          </div>

          {/* Links / Sitemap */}
          <div className="md:col-span-3 lg:col-span-2 space-y-3">
            <h4 className="font-semibold text-gray-900 text-sm tracking-tight">Navegação</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link to="/" className="hover:text-primary-600 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/cardapio" className="hover:text-primary-600 transition-colors">
                  Cardápio
                </Link>
              </li>
              <li>
                <Link to="/pedidos" className="hover:text-primary-600 transition-colors">
                  Meus Pedidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Atendimento & Informações */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3">
            <h4 className="font-semibold text-gray-900 text-sm tracking-tight">Atendimento</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                <span>Seg a Sex: 07h30 às 21h30</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <span>Prédio Central - Convivência</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            © {currentYear} Cantina IFRS. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-1.5">
            <span>Siga-nos:</span>
            <a
              href="https://www.instagram.com/ifrscaxias?igsi=MXZxamtzcG9jaGk4bQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-full text-gray-500 hover:text-primary-600 hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              aria-label="Instagram do IFRS"
            >
              <svg 
                className="w-4 h-4" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
