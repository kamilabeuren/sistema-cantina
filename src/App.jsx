import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Pagamento from "./pages/Pagamento";
import Carrinho from "./pages/Carrinho";
import Cardapio from "./pages/Cardapio";
import AcompanhamentoPedido from "./pages/AcompanhamentoPedido";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { ensureDefaultAdmin, getCurrentUser } from "./services/authService";

function App() {
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    ensureDefaultAdmin();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans antialiased">
      <Navbar cartCount={3} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
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
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
