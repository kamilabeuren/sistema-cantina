const CHAVE_PRODUTOS = "produtos";

// Produtos iniciais para preencher o sistema na primeira execução
const PRODUTOS_INICIAIS = [
  {
    id: "prod-1",
    nome: "Combo Pão de Queijo + Suco",
    descricao: "3 pães artesanais e suco natural",
    preco: 9.5,
    categoriaId: "cat-1",
    estoque: 10,
    imagem: "/combo-pao-queijo.jpg",
    ativo: true,
  },
  {
    id: "prod-2",
    nome: "Burger Smash Especial",
    descricao: "Blend 160g, cheddar, bacon e salada",
    preco: 17.5,
    categoriaId: "cat-1",
    estoque: 10,
    imagem: "/burger-artesanal.jpg",
    ativo: true,
  },
  {
    id: "prod-3",
    nome: "Sanduíche Natural de Frango",
    descricao: "Pão integral, frango grelhado e salada",
    preco: 12,
    categoriaId: "cat-1",
    estoque: 10,
    imagem: "/sanduiche-natural.jpg",
    ativo: true,
  },
];

// Retorna a lista de produtos
export function listarProdutos() {
  const produtos = localStorage.getItem(CHAVE_PRODUTOS);

  if (!produtos) {
    localStorage.setItem(
      CHAVE_PRODUTOS,
      JSON.stringify(PRODUTOS_INICIAIS)
    );

    return PRODUTOS_INICIAIS;
  }

  return JSON.parse(produtos);
}

// Salva a lista inteira no LocalStorage
export function salvarProdutos(produtos) {
  localStorage.setItem(
    CHAVE_PRODUTOS,
    JSON.stringify(produtos)
  );
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

// Editar produto existente
export function editarProduto(id, dadosAtualizados) {
  const produtos = listarProdutos();

  const index = produtos.findIndex(
    (p) => p.id === id
  );

  if (index !== -1) {
    produtos[index] = {
      ...produtos[index],
      ...dadosAtualizados,
    };

    salvarProdutos(produtos);
  }
}

// Excluir produto
export function excluirProduto(id) {
  const produtos = listarProdutos();

  const produtosFiltrados = produtos.filter(
    (p) => p.id !== id
  );

  salvarProdutos(produtosFiltrados);
}