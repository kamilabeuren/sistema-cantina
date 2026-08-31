import { useState, useRef, useEffect } from "react";
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
  LogOut,
  ChevronDown,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

export default function Navbar({ cartCount = 0, user = null, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Fecha o dropdown de usuário ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

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
  const isEstudante = user && user.role !== "admin";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-xl p-0.5 sm:p-1 transition-all shrink-0"
          >
            <div className="h-8 sm:h-12 flex items-center group-hover:scale-105 transition-transform">
              <img
                src="/ifrs-logo.svg"
                alt="Instituto Federal Rio Grande do Sul - Logo"
                className="h-full w-auto object-contain"
              />
            </div>

            <div className="flex flex-col border-l border-gray-200 pl-2 sm:pl-3">
              <span className="font-bold text-sm sm:text-lg leading-tight text-gray-900 group-hover:text-primary-600 transition-colors">
                Cantina <span className="text-primary-600">IFRS</span>
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-wider font-semibold uppercase text-gray-400 hidden xs:inline">
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
              <div className="relative" ref={userMenuRef}>
                <div className="flex items-center bg-gray-50/90 hover:bg-gray-100/80 p-1 pl-1.5 pr-2 rounded-full border border-gray-200/80 shadow-2xs transition-all">
                  
                  {/* Botão de Perfil que abre o dropdown */}
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 py-0.5 px-1 rounded-full hover:opacity-90 transition-opacity focus:outline-none cursor-pointer"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-full ${
                        isEstudante
                          ? "bg-gradient-to-tr from-primary-700 via-emerald-600 to-teal-500"
                          : "bg-gradient-to-tr from-amber-600 via-emerald-600 to-teal-600"
                      } text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-primary-500/20`}>
                        {user.nome ? user.nome[0].toUpperCase() : "U"}
                      </div>
                      {user.role === "admin" ? (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white" title="Admin" />
                      ) : (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-400/40" title="Estudante ativo" />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-left">
                      <span className="text-xs sm:text-sm font-semibold text-gray-800 max-w-[90px] sm:max-w-[110px] truncate">
                        {user.nome}
                      </span>
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-amber-800 bg-amber-100/90 rounded-full border border-amber-200/80">
                          <ShieldCheck className="w-3 h-3 text-amber-700" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-primary-700 bg-primary-100/90 rounded-full border border-primary-200/80">
                          <GraduationCap className="w-3 h-3 text-primary-600" /> Estudante
                        </span>
                      )}
                    </div>

                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180 text-primary-600" : ""}`} />
                  </button>

                  {/* Divisor vertical suave */}
                  <div className="h-4 w-px bg-gray-200 mx-1.5" />

                  {/* Botão rápido de Logout */}
                  <button
                    type="button"
                    onClick={onLogout}
                    title="Sair da conta"
                    aria-label="Sair da conta"
                    className="flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-white transition-all cursor-pointer shadow-2xs group"
                  >
                    <LogOut className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-600 transition-colors" />
                    <span className="hidden xl:inline">Sair</span>
                  </button>
                </div>

                {/* Dropdown Menu suspenso */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-gray-100">
                    
                    {/* Header do Dropdown */}
                    <div className="px-4 py-3 flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-full ${
                        isEstudante
                          ? "bg-gradient-to-tr from-primary-700 via-emerald-600 to-teal-500"
                          : "bg-gradient-to-tr from-amber-600 via-emerald-600 to-teal-600"
                      } text-white flex items-center justify-center font-bold text-base shadow-xs ring-2 ring-primary-500/20 shrink-0`}>
                        {user.nome ? user.nome[0].toUpperCase() : "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.nome}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email || (user.role === "admin" ? "admin@cantina.com" : "estudante@ifrs.edu.br")}</p>
                        <div className="mt-1">
                          {user.role === "admin" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 bg-amber-50 rounded-md border border-amber-200">
                              <ShieldCheck className="w-3 h-3 text-amber-600" /> Administrador da Cantina
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold text-primary-700 bg-primary-50 rounded-md border border-primary-100">
                              <GraduationCap className="w-3.5 h-3.5 text-primary-600" /> Estudante IFRS
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Atalhos Rápidos */}
                    <div className="py-2 px-1.5 space-y-0.5">
                      {user.role === "admin" ? (
                        <>
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-gray-400" />
                            <span>Painel Geral</span>
                          </Link>
                          <Link
                            to="/admin/produtos"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
                          >
                            <Package className="w-4 h-4 text-gray-400" />
                            <span>Gerenciar Produtos</span>
                          </Link>
                          <Link
                            to="/admin/pedidos"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
                          >
                            <ClipboardList className="w-4 h-4 text-gray-400" />
                            <span>Fila de Pedidos</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/cardapio"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
                          >
                            <BookOpen className="w-4 h-4 text-gray-400" />
                            <span>Cardápio Digital</span>
                          </Link>
                          <Link
                            to="/carrinho"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <ShoppingBag className="w-4 h-4 text-gray-400" />
                              <span>Meu Carrinho</span>
                            </div>
                            {cartCount > 0 && (
                              <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-accent-500 rounded-full">
                                {cartCount}
                              </span>
                            )}
                          </Link>
                          <Link
                            to="/pedidos"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
                          >
                            <ClipboardList className="w-4 h-4 text-gray-400" />
                            <span>Meus Pedidos</span>
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Botão de Logout no Dropdown */}
                    <div className="pt-1.5 px-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          onLogout?.();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sair da conta</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
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

          <div className="pt-2 border-t border-gray-100 mt-2 space-y-2">
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
                  {cartCount} {cartCount === 1 ? "item" : "itens"}
                </span>
              )}
            </Link>

            {user ? (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-emerald-50/30 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-600 to-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-primary-500/20">
                      {user.nome ? user.nome[0].toUpperCase() : "U"}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900">{user.nome}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">
                        {user.email || (user.role === "admin" ? "admin@cantina.com" : "Estudante")}
                      </p>
                    </div>
                  </div>
                  {user.role === "admin" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 rounded-full border border-amber-200/80">
                      <ShieldCheck className="w-3 h-3 text-amber-700" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-primary-100 rounded-full border border-primary-200/80">
                      <GraduationCap className="w-3 h-3 text-primary-600" /> Estudante
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair da conta</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-900 text-white font-semibold text-sm shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>Entrar na conta</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
