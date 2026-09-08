import { PRODUTOS_INICIAIS } from "../data/produtosIniciais";
const CHAVE_PRODUTOS = "produtos";

// Retorna a lista de produtos
export function listarProdutos() {
  const produtos = localStorage.getItem(CHAVE_PRODUTOS);

  if (!produtos) {
    salvarProdutos(PRODUTOS_INICIAIS);
    return PRODUTOS_INICIAIS;
  }

  return JSON.parse(produtos);
}

// Salva a lista inteira no LocalStorage
export function salvarProdutos(produtos) {
  localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos));
}

// Baixa do estoque após a confirmação de um pedido
export function baixarEstoque(itens) {
  const produtos = listarProdutos();

  itens.forEach((item) => {
    const index = produtos.findIndex((produto) => produto.id === item.id);

    if (index !== -1) {
      const quantidadeVendida = Number(item.quantity) || 0;

      produtos[index] = {
        ...produtos[index],
        estoque: Math.max(
          0,
          Number(produtos[index].estoque) - quantidadeVendida
        ),
      };
    }
  });

  salvarProdutos(produtos);
}

// Adiciona um novo produto (Com suporte a Imagem)
export function adicionarProduto(produto) {
  const produtos = listarProdutos();
  const novoProduto = {
    id: crypto.randomUUID(),
    nome: produto.nome,
    descricao: produto.descricao || "",
    preco: Number(produto.preco),
    categoriaId: produto.categoriaId,
    estoque: Number(produto.estoque),
    imagem: produto.imagem || "", // Salva a imagem em Base64 ou URL
    ativo: true,
  };
  produtos.push(novoProduto);
  salvarProdutos(produtos);
  return novoProduto;
}

// Editar produto existente
export function editarProduto(id, dadosAtualizados) {
  const produtos = listarProdutos();
  const index = produtos.findIndex((p) => p.id === id);
  if (index !== -1) {
    produtos[index] = { ...produtos[index], ...dadosAtualizados };
    salvarProdutos(produtos);
  }
}

// Excluir produto
export function excluirProduto(id) {
  const produtos = listarProdutos();
  const produtosFiltrados = produtos.filter((p) => p.id !== id);
  salvarProdutos(produtosFiltrados);
}