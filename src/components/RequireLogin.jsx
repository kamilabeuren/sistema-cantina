// src/components/RequireLogin.jsx
// Exige que o usuário esteja logado (Admin ou usuário padrão), sem restringir por categoria.
// Usado para telas como o checkout, onde não pode existir pedido sem identificação.
import { Navigate, useLocation } from "react-router-dom";

export default function RequireLogin({ user, children }) {
  const location = useLocation();

  if (!user) {
    // Guarda de onde a pessoa veio, para o login poder trazê-la de volta depois
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}