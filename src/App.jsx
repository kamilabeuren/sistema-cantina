import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Pagamento from "./pages/Pagamento";
import Carrinho from "./pages/Carrinho";
import Cardapio from "./pages/Cardapio";
import AcompanhamentoPedido from "./pages/AcompanhamentoPedido";
import Login from "./pages/Login";
import MeusPedidos from "./pages/MeusPedidos";
import AdminPedidos from "./pages/AdminPedidos";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { listarCarrinho } from "./services/carrinhoService";
import { ensureDefaultAdmin, getCurrentUser, logout } from "./services/authService";

function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState(getCurrentUser());
  const [cartCount, setCartCount] = useState(() => {
    return listarCarrinho().reduce(
      (soma, item) => soma + Number(item.quantity || 0),
      0
    );
  });
  
  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    ensureDefaultAdmin();
  }, []);

  // Mantém o contador da Navbar sempre igual ao carrinho salvo no LocalStorage.
  useEffect(() => {
    const atualizarContador = () => {
      const total = listarCarrinho().reduce(
        (soma, item) => soma + Number(item.quantity || 0),
        0
      );
      setCartCount(total);
    };

    atualizarContador();
    window.addEventListener("carrinhoAtualizado", atualizarContador);
    window.addEventListener("storage", atualizarContador);

    return () => {
      window.removeEventListener("carrinhoAtualizado", atualizarContador);
      window.removeEventListener("storage", atualizarContador);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans antialiased">
      <Navbar
        cartCount={cartCount}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              user?.role === "admin"
                ? <Navigate to="/admin/dashboard" replace />
                : <Home />
            }
          />
          <Route
            path="/admin/produtos"
            element={
              <ProtectedRoute user={user}>
                <Produtos />
              </ProtectedRoute>
            }
          />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="/pedido/:id" element={<AcompanhamentoPedido />} />
          <Route path="/cardapio" element={<Cardapio />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/pedidos" element={<MeusPedidos />} />
          <Route
            path="/admin/pedidos"
            element={
              <ProtectedRoute user={user}>
                <AdminPedidos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
