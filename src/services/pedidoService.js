// src/services/pedidoService.js
// Camada de acesso ao LocalStorage para os pedidos da cantina.
// Nenhuma página deve ler ou escrever a chave "orders" diretamente:
// tudo passa por estas funções, para o formato do pedido ficar sempre igual.

const CHAVE_PEDIDOS = "orders";

// Status oficiais do pedido, na ordem do fluxo (documento do projeto).
export const STATUS_PEDIDO = [
  "Recebido",
  "Em preparo",
  "Pronto para retirada",
  "Entregue",
];

// Status fora do fluxo normal.
export const STATUS_CANCELADO = "Cancelado";

// Todos os status possíveis, útil para montar filtros.
export const TODOS_STATUS = [...STATUS_PEDIDO, STATUS_CANCELADO];

// Cores de cada status, para os selos das telas.
export const CORES_STATUS = {
  Recebido: "bg-gray-100 text-gray-700 border-gray-200",
  "Em preparo": "bg-amber-50 text-amber-700 border-amber-200",
  "Pronto para retirada": "bg-primary-50 text-primary-700 border-primary-200",
  Entregue: "bg-blue-50 text-blue-700 border-blue-200",
  Cancelado: "bg-accent-50 text-accent-700 border-accent-200",
};

// Avisa as telas abertas que a lista de pedidos mudou.
function avisarAtualizacao() {
  window.dispatchEvent(new Event("pedidosAtualizados"));
}

// Permite que uma tela reaja a mudanças feitas nela mesma ou em outra aba.
// Retorna a função de limpeza, para usar direto no useEffect.
export function observarPedidos(callback) {
  const aoMudarNaMesmaAba = () => callback();
  const aoMudarEmOutraAba = (evento) => {
    if (evento.key === CHAVE_PEDIDOS) callback();
  };

  window.addEventListener("pedidosAtualizados", aoMudarNaMesmaAba);
  window.addEventListener("storage", aoMudarEmOutraAba);

  return () => {
    window.removeEventListener("pedidosAtualizados", aoMudarNaMesmaAba);
    window.removeEventListener("storage", aoMudarEmOutraAba);
  };
}

// Retorna a lista completa de pedidos, do mais novo para o mais antigo.
export function listarPedidos() {
  const pedidos = localStorage.getItem(CHAVE_PEDIDOS);
  if (!pedidos) return [];

  try {
    const lista = JSON.parse(pedidos);
    if (!Array.isArray(lista)) return [];
    return [...lista].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch {
    // Se o LocalStorage estiver corrompido, não derruba a aplicação.
    return [];
  }
}

// Salva a lista inteira no LocalStorage.
export function salvarPedidos(pedidos) {
  localStorage.setItem(CHAVE_PEDIDOS, JSON.stringify(pedidos));
  avisarAtualizacao();
}

// Busca um pedido pelo número.
// O número vem como texto quando chega pela URL, por isso a comparação solta.
export function buscarPedidoPorNumero(numero) {
  return listarPedidos().find((pedido) => String(pedido.number) === String(numero)) || null;
}

// Gera o próximo número de pedido, sempre maior que todos os já existentes.
export function gerarNumeroPedido() {
  const pedidos = listarPedidos();
  if (pedidos.length === 0) return 1001;

  const maiorNumero = pedidos.reduce(
    (maior, pedido) => Math.max(maior, Number(pedido.number) || 0),
    0
  );
  return maiorNumero + 1;
}

// Cria e salva um novo pedido a partir dos dados do checkout.
export function criarPedido({
  items,
  customerName,
  paymentMethod,
  subtotal,
  taxa,
  total,
  userId = null,
}) {
  const agora = new Date().toISOString();

  const novoPedido = {
    number: gerarNumeroPedido(),
    customerName: customerName.trim(),
    paymentMethod,
    items,
    subtotal,
    taxa,
    total,
    status: STATUS_PEDIDO[0],
    userId,
    createdAt: agora,
    updatedAt: agora,
    // Linha do tempo do pedido, usada na tela de acompanhamento.
    historicoStatus: [{ status: STATUS_PEDIDO[0], em: agora }],
  };

  const pedidos = listarPedidos();
  pedidos.push(novoPedido);
  salvarPedidos(pedidos);

  return novoPedido;
}

// Altera o status de um pedido e registra a mudança no histórico.
export function alterarStatusPedido(numero, novoStatus) {
  if (!TODOS_STATUS.includes(novoStatus)) {
    throw new Error(`Status invalido: ${novoStatus}`);
  }

  const pedidos = listarPedidos();
  const index = pedidos.findIndex((p) => String(p.number) === String(numero));
  if (index === -1) return null;

  const agora = new Date().toISOString();
  const historicoAtual = pedidos[index].historicoStatus || [];

  pedidos[index] = {
    ...pedidos[index],
    status: novoStatus,
    updatedAt: agora,
    historicoStatus: [...historicoAtual, { status: novoStatus, em: agora }],
  };

  salvarPedidos(pedidos);
  return pedidos[index];
}

// Devolve o próximo status do fluxo, ou null se o pedido já terminou.
export function proximoStatus(statusAtual) {
  const posicao = STATUS_PEDIDO.indexOf(statusAtual);
  if (posicao === -1 || posicao === STATUS_PEDIDO.length - 1) return null;
  return STATUS_PEDIDO[posicao + 1];
}

// Avança o pedido para a próxima etapa do fluxo.
export function avancarStatusPedido(numero) {
  const pedido = buscarPedidoPorNumero(numero);
  if (!pedido) return null;

  const proximo = proximoStatus(pedido.status);
  if (!proximo) return pedido;

  return alterarStatusPedido(numero, proximo);
}

// Cancela um pedido.
export function cancelarPedido(numero) {
  return alterarStatusPedido(numero, STATUS_CANCELADO);
}

// Histórico de pedidos de um cliente.
// Sem usuário logado, mostra os pedidos feitos como visitante neste dispositivo.
export function listarPedidosDoUsuario(userId) {
  const pedidos = listarPedidos();
  if (!userId) return pedidos.filter((pedido) => !pedido.userId);
  return pedidos.filter((pedido) => pedido.userId === userId);
}

// Filtra pedidos por status e por texto (número ou nome do cliente).
export function filtrarPedidos({ status = "Todos", busca = "" } = {}) {
  const termo = busca.trim().toLowerCase();

  return listarPedidos().filter((pedido) => {
    const combinaStatus = status === "Todos" || pedido.status === status;
    const combinaBusca =
      termo === "" ||
      String(pedido.number).includes(termo) ||
      (pedido.customerName || "").toLowerCase().includes(termo);

    return combinaStatus && combinaBusca;
  });
}

// Números gerais para o dashboard.
export function obterMetricas() {
  const pedidos = listarPedidos();
  const validos = pedidos.filter((p) => p.status !== STATUS_CANCELADO);

  const faturamento = validos.reduce((soma, p) => soma + Number(p.total || 0), 0);

  const porStatus = TODOS_STATUS.reduce((acumulado, status) => {
    acumulado[status] = pedidos.filter((p) => p.status === status).length;
    return acumulado;
  }, {});

  // Produtos mais vendidos, considerando a quantidade de cada item.
  const contagemProdutos = {};
  validos.forEach((pedido) => {
    (pedido.items || []).forEach((item) => {
      const nome = item.name || "Sem nome";
      contagemProdutos[nome] = (contagemProdutos[nome] || 0) + Number(item.quantity || 0);
    });
  });

  const maisVendidos = Object.entries(contagemProdutos)
    .map(([nome, quantidade]) => ({ nome, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5);

  return {
    totalPedidos: pedidos.length,
    pedidosEmAberto: pedidos.filter(
      (p) => p.status !== "Entregue" && p.status !== STATUS_CANCELADO
    ).length,
    pedidosEntregues: porStatus["Entregue"] || 0,
    pedidosCancelados: porStatus[STATUS_CANCELADO] || 0,
    faturamento,
    ticketMedio: validos.length > 0 ? faturamento / validos.length : 0,
    porStatus,
    maisVendidos,
  };
}

// Formata um número como moeda brasileira.
export function formatarBRL(valor) {
  return `R$ ${Number(valor || 0).toFixed(2).replace(".", ",")}`;
}

// Formata uma data ISO no padrão brasileiro.
export function formatarDataHora(dataISO) {
  if (!dataISO) return "-";
  const data = new Date(dataISO);
  if (Number.isNaN(data.getTime())) return "-";
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
