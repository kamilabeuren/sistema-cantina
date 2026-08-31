const CHAVE_PRODUTOS = "produtos";

// Produtos iniciais, no mesmo esquema que o categoriaService usa para as
// categorias. Sem isso o cardápio abre vazio em qualquer navegador novo,
// porque ele passou a ler os produtos daqui em vez de ter a lista fixa no
// código. Os categoriaId apontam para as categorias criadas pelo
// categoriaService (cat-1 Lanches, cat-2 Bebidas).
const PRODUTOS_INICIAIS = [
  {
    id: "prod-1",
    nome: "X-Burger",
    descricao: "Pão, hambúrguer, queijo e molho especial",
    preco: 22.9,
    categoriaId: "cat-1",
    estoque: 20,
    imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    ativo: true,
  },
  {
    id: "prod-2",
    nome: "X-Salada",
    descricao: "Hambúrguer, queijo, alface, tomate e molho",
    preco: 25.9,
    categoriaId: "cat-1",
    estoque: 15,
    imagem: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    ativo: true,
  },
  {
    id: "prod-3",
    nome: "Batata Frita",
    descricao: "Porção de batata frita crocante",
    preco: 10.0,
    categoriaId: "cat-1",
    estoque: 30,
    imagem: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
    ativo: true,
  },
  {
    id: "prod-4",
    nome: "Nuggets",
    descricao: "Porção com 8 nuggets crocantes",
    preco: 18.9,
    categoriaId: "cat-1",
    estoque: 25,
    imagem: "https://images.unsplash.com/photo-1562967914-608f82629710",
    ativo: true,
  },
  {
    id: "prod-5",
    nome: "Coca-Cola",
    descricao: "Refrigerante 350ml",
    preco: 6.9,
    categoriaId: "cat-2",
    estoque: 40,
    imagem: "https://images.unsplash.com/photo-1554866585-cd94860890b7",
    ativo: true,
  },
  {
    id: "prod-6",
    nome: "Suco de Laranja",
    descricao: "Suco natural de laranja",
    preco: 8.9,
    categoriaId: "cat-2",
    estoque: 30,
    imagem: "https://images.unsplash.com/photo-1600271886742-f049cd451bba",
    ativo: true,
  },
];

// Retorna a lista de produtos.
// Na primeira execução grava os produtos iniciais. Se o administrador apagar
// todos depois, a chave continua existindo e a lista fica vazia mesmo — os
// iniciais não voltam sozinhos.
export function listarProdutos() {
  const produtos = localStorage.getItem(CHAVE_PRODUTOS);

  if (!produtos) {
    localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(PRODUTOS_INICIAIS));
    return PRODUTOS_INICIAIS;
  }

  return JSON.parse(produtos);
}

// Salva a lista inteira no LocalStorage
export function salvarProdutos(produtos) {
  localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos));
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