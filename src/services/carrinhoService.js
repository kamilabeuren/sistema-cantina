const CHAVE_CARRINHO = "cart";

// Retorna os itens no carrinho
export function listarCarrinho() {
  const carrinho = localStorage.getItem(CHAVE_CARRINHO);
  return carrinho ? JSON.parse(carrinho) : [];
}

// Salva o carrinho no LocalStorage
export function salvarCarrinho (carrinho) {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
  window.dispatchEvent(new Event("carrinhoAtualizado"));
}

// Adiciona um novo produto ao carrinho/aumenta quantidade se já estiver no carrinho
export function adicionarCarrinho(produto) {
  const carrinho = listarCarrinho();

  const indexExistente = carrinho.findIndex((item) => item.id === produto.id)
  
  if (indexExistente !== -1) {
    carrinho[indexExistente].quantity += 1;
  } else {
    const novoItem = {
        id: produto.id,
        name: produto.nome,
        price: Number(produto.preco),
        image: produto.imagem || "",
        quantity: 1,
        note: "",
    };
    carrinho.push(novoItem);
  }

  salvarCarrinho(carrinho);
  return carrinho;
}

// Editar produtos no carrinho
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
