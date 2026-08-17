import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Carrinho from "./pages/Carrinho.jsx";
import Pagamento from "./pages/Pagamento.jsx";
import Cardapio from "./pages/Cardapio.jsx";
import AcompanhamentoPedido from "./pages/AcompanhamentoPedido";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans antialiased">
      <Navbar cartCount={3} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/produtos" element={<Produtos />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="/pedido/:id" element={<AcompanhamentoPedido />} />
          <Route path="/cardapio" element={<Cardapio />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;