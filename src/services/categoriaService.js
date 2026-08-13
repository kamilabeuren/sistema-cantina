const CHAVE_CATEGORIAS = "categorias";

// Categorias iniciais para preencher o sistema na primeira execução
const CATEGORIAS_INICIAIS = [
  { id: "cat-1", nome: "Lanches" },
  { id: "cat-2", nome: "Bebidas" },
  { id: "cat-3", nome: "Sobremesas" },
];

export function listarCategorias() {
  const categorias = localStorage.getItem(CHAVE_CATEGORIAS);
  if (!categorias) {
    localStorage.setItem(CHAVE_CATEGORIAS, JSON.stringify(CATEGORIAS_INICIAIS));
    return CATEGORIAS_INICIAIS;
  }
  return JSON.parse(categorias);
}

export function adicionarCategoria(nome) {
  const categorias = listarCategorias();
  const novaCategoria = {
    id: crypto.randomUUID(),
    nome: nome,
  };
  categorias.push(novaCategoria);
  localStorage.setItem(CHAVE_CATEGORIAS, JSON.stringify(categorias));
  return novaCategoria;
}