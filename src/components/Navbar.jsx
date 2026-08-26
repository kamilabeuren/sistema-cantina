import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ShoppingBag,
  Home as HomeIcon,
  BookOpen,
  ClipboardList,
  User,
  Menu,
  X,
  LayoutDashboard,
  Package,
} from "lucide-react";

export default function Navbar({ cartCount = 2, user = null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const itensCliente = [
    { label: "Início", path: "/", icon: HomeIcon },
    { label: "Cardápio", path: "/cardapio", icon: BookOpen },
    { label: "Meus Pedidos", path: "/pedidos", icon: ClipboardList },
  ];

  // O administrador enxerga os atalhos da área administrativa.
  const itensAdmin = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Pedidos", path: "/admin/pedidos", icon: ClipboardList },
    { label: "Produtos", path: "/admin/produtos", icon: Package },
  ];

  const navItems = user?.role === "admin" ? itensAdmin : itensCliente;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-xl p-1 transition-all"
          >
            <div className="h-10 sm:h-12 flex items-center group-hover:scale-105 transition-transform">
              <img
                src="/ifrs-logo.svg"
                alt="Instituto Federal Rio Grande do Sul - Logo"
                className="h-full w-auto object-contain"
              />
            </div>

            <div className="flex flex-col border-l border-gray-200 pl-3">
              <span className="font-bold text-base sm:text-lg leading-tight text-gray-900 group-hover:text-primary-600 transition-colors">
                Cantina <span className="text-primary-600">IFRS</span>
              </span>
              <span className="text-[10px] tracking-wider font-semibold uppercase text-gray-400">
                Sabor & Praticidade
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-gray-50/80 p-1.5 rounded-full border border-gray-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? "bg-white text-primary-700 shadow-xs font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            
            <Link
              to="/carrinho"
              aria-label="Carrinho de compras"
              className="relative p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium transition-all flex items-center gap-2 border border-primary-100 group"
            >
              <ShoppingBag className="w-5 h-5 text-primary-600 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-sm font-semibold">Carrinho</span>
              
              {cartCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-accent-500 rounded-full shadow-xs animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="hidden sm:block h-6 w-px bg-gray-200" />

            {user ? (
              <Link
                to="/perfil"
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                  {user.nome ? user.nome[0].toUpperCase() : "U"}
                </div>
                <span className="hidden lg:inline text-sm font-medium text-gray-700">
                  {user.nome}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-900 text-white hover:bg-primary-600 text-sm font-medium shadow-xs transition-all hover:shadow-md"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Entrar</span>
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Abrir menu principal"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="w-5 h-5 text-primary-600" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-2 border-t border-gray-100 mt-2">
            <Link
              to="/carrinho"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary-50 text-primary-700 font-semibold"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <span>Ver Carrinho</span>
              </div>
              {cartCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold text-white bg-accent-500 rounded-full">
                  {cartCount} itens
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
