import { listarProdutos } from "./produtoService";

const CHAVE_CARRINHO = "cart";

// Retorna os itens no carrinho
export function listarCarrinho() {
  const carrinho = localStorage.getItem(CHAVE_CARRINHO);
  return carrinho ? JSON.parse(carrinho) : [];
}

// Salva o carrinho no LocalStorage
export function salvarCarrinho(carrinho) {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
  window.dispatchEvent(new Event("carrinhoAtualizado"));
}

// Busca o estoque atual de um produto pelo id (usado para travar quantidade)
function obterEstoqueDoProduto(produtoId) {
  const produto = listarProdutos().find((p) => p.id === produtoId);
  return produto ? produto.estoque : undefined;
}

// Adiciona um novo produto ao carrinho/aumenta quantidade se já estiver no carrinho e retorna { sucesso, motivo?, estoqueDisponivel? } para a checagem de estoque.
export function adicionarCarrinho(produto) {
  const carrinho = listarCarrinho();
  const indexExistente = carrinho.findIndex((item) => item.id === produto.id);
  const quantidadeAtual = indexExistente !== -1 ? carrinho[indexExistente].quantity : 0;
  const quantidadeDesejada = quantidadeAtual + 1;

  const estoqueDisponivel = produto.estoque;
  if (estoqueDisponivel !== undefined && quantidadeDesejada > estoqueDisponivel) {
    return { sucesso: false, motivo: "estoque_insuficiente", estoqueDisponivel };
  }

  if (indexExistente !== -1) {
    carrinho[indexExistente].quantity = quantidadeDesejada;
  } else {
    carrinho.push({
      id: produto.id,
      name: produto.nome,
      price: Number(produto.preco),
      image: produto.imagem || "",
      quantity: 1,
      note: "",
    });
  }

  salvarCarrinho(carrinho);
  return { sucesso: true, carrinho };
}

// Aumenta a quantidade de um item já existente no carrinho (botão "+"),com check de estoque atual do produto.
export function incrementarQuantidade(id) {
  const carrinho = listarCarrinho();
  const index = carrinho.findIndex((item) => item.id === id);
  if (index === -1) return { sucesso: false, motivo: "item_nao_encontrado" };

  const estoqueDisponivel = obterEstoqueDoProduto(id);
  const quantidadeDesejada = carrinho[index].quantity + 1;

  if (estoqueDisponivel !== undefined && quantidadeDesejada > estoqueDisponivel) {
    return { sucesso: false, motivo: "estoque_insuficiente", estoqueDisponivel };
  }

  carrinho[index].quantity = quantidadeDesejada;
  salvarCarrinho(carrinho);
  return { sucesso: true };
}

// Editar itens do carrinho (quantidade ou observação). Não faz verificação de estoque, só reduz ou salva obs.
export function alterarQuantidade(id, dadosAtualizados) {
  // Se a nova quantidade for menor ou igual a zero, remove o item
  if (dadosAtualizados.quantity !== undefined && dadosAtualizados.quantity <= 0) {
    excluirCarrinho(id);
    return;
  }

  const carrinho = listarCarrinho();
  const index = carrinho.findIndex((p) => p.id === id);
  if (index !== -1) {
    carrinho[index] = { ...carrinho[index], ...dadosAtualizados };
    salvarCarrinho(carrinho);
  }
}

// Excluir produto do carrinho
export function excluirCarrinho(id) {
  const carrinho = listarCarrinho();
  const carrinhoFiltrados = carrinho.filter((p) => p.id !== id);
  salvarCarrinho(carrinhoFiltrados);
}