import { PRODUTOS_INICIAIS } from "../data/produtosIniciais";

const CHAVE_PRODUTOS = "produtos";

// Retorna a lista de produtos
export function listarProdutos() {
  const produtos = localStorage.getItem(CHAVE_PRODUTOS);

  if (!produtos) {
    salvarProdutos(PRODUTOS_INICIAIS);
    return PRODUTOS_INICIAIS;
  }

  try {
    return JSON.parse(produtos);
  } catch {
    salvarProdutos(PRODUTOS_INICIAIS);
    return PRODUTOS_INICIAIS;
  }
}

// Salva a lista inteira no LocalStorage
export function salvarProdutos(produtos) {
  localStorage.setItem(
    CHAVE_PRODUTOS,
    JSON.stringify(produtos)
  );

  // Atualiza telas abertas
  window.dispatchEvent(
    new Event("produtosAtualizados")
  );
}

// Baixa o estoque após a confirmação do pedido
export function baixarEstoque(itens) {
  const produtos = listarProdutos();

  itens.forEach((item) => {
    const index = produtos.findIndex(
      (produto) => produto.id === item.id
    );

    if (index !== -1) {
      const quantidadeVendida =
        Number(item.quantity) || 0;

      produtos[index] = {
        ...produtos[index],
        estoque: Math.max(
          0,
          Number(produtos[index].estoque) -
            quantidadeVendida
        ),
      };
    }
  });

  salvarProdutos(produtos);
}

// Adiciona um novo produto
export function adicionarProduto(produto) {
  const produtos = listarProdutos();

  const novoProduto = {
    id: crypto.randomUUID(),
    nome: produto.nome,
    descricao: produto.descricao || "",
    preco: Number(produto.preco),
    categoriaId: produto.categoriaId,
    estoque: Number(produto.estoque),
    imagem: produto.imagem || "",
    ativo: true,
  };

  produtos.push(novoProduto);

  salvarProdutos(produtos);

  return novoProduto;
}

// Edita produto existente
export function editarProduto(
  id,
  dadosAtualizados
) {
  const produtos = listarProdutos();

  const index = produtos.findIndex(
    (produto) => produto.id === id
  );

  if (index !== -1) {
    produtos[index] = {
      ...produtos[index],
      ...dadosAtualizados,
    };

    salvarProdutos(produtos);
  }
}

// Exclui produto
export function excluirProduto(id) {
  const produtos = listarProdutos();

  const produtosFiltrados = produtos.filter(
    (produto) => produto.id !== id
  );

  salvarProdutos(produtosFiltrados);
}