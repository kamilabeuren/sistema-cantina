// src/hooks/useVersaoPedidos.js
// Hook de apoio para as telas que dependem dos pedidos.
//
// Guardar uma cópia da lista no estado obriga a sincronizar tudo na mão.
// Aqui a gente guarda apenas um contador: ele muda sempre que algum pedido
// é criado ou tem o status alterado (nesta aba ou em outra aba do navegador).
// A tela usa esse número como dependência de um useMemo e recalcula os dados
// direto do LocalStorage, sempre atualizados.

import { useEffect, useState } from "react";
import { observarPedidos } from "../services/pedidoService";

export function useVersaoPedidos() {
  const [versao, setVersao] = useState(0);

  useEffect(() => observarPedidos(() => setVersao((atual) => atual + 1)), []);

  return versao;
}
