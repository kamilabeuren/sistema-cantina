import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cardapio.css";
import { listarProdutos } from "../services/produtoService";
import { listarCategorias } from "../services/categoriaService";
import { adicionarCarrinho, listarCarrinho } from "../services/carrinhoService";

function contarItensCarrinho() {
  return listarCarrinho().reduce((total, item) => total + item.quantity, 0);
}

function App() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [quantidadeCarrinho, setQuantidadeCarrinho] = useState(0);

  useEffect(() => {
    setProdutos(listarProdutos());
    setCategorias(listarCategorias());
  }, []);

  useEffect(() => {
    setQuantidadeCarrinho(contarItensCarrinho());

    const handleAtualizacao = () =>
      setQuantidadeCarrinho(contarItensCarrinho());

    window.addEventListener("carrinhoAtualizado", handleAtualizacao);

    return () => {
      window.removeEventListener("carrinhoAtualizado", handleAtualizacao);
    };
  }, []);

  const nomesCategorias = useMemo(
    () => ["Todos", ...categorias.map((categoria) => categoria.nome)],
    [categorias]
  );

  const produtosFiltrados = useMemo(() => {
    if (categoriaSelecionada === "Todos") return produtos;

    const categoriaAtual = categorias.find(
      (categoria) => categoria.nome === categoriaSelecionada
    );

    if (!categoriaAtual) return produtos;

    return produtos.filter(
      (produto) => produto.categoriaId === categoriaAtual.id
    );
  }, [produtos, categorias, categoriaSelecionada]);

  function handleAdicionarAoCarrinho(produto) {
    adicionarCarrinho(produto);
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>🍔 Meu Cardápio</h1>
          <p>Escolha seus produtos favoritos</p>
        </div>
      </header>

      <main className="container">
        <section className="categorias">
          {nomesCategorias.map((categoria) => (
            <button
              key={categoria}
              className={
                categoriaSelecionada === categoria ? "ativo" : ""
              }
              onClick={() => setCategoriaSelecionada(categoria)}
            >
              {categoria}
            </button>
          ))}
        </section>

        {produtosFiltrados.length === 0 ? (
          <p style={{ color: "#475569" }}>
            Nenhum produto cadastrado{" "}
            {categoriaSelecionada !== "Todos"
              ? "nessa categoria"
              : "ainda"}
            .
          </p>
        ) : (
          <section className="produtos">
            {produtosFiltrados.map((produto) => (
              <article className="produto" key={produto.id}>

                {/* IMAGEM DO PRODUTO */}
                {produto.imagem ? (
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    Sem imagem
                  </div>
                )}

                <div className="produto-info">
                  <span className="categoria">
                    {categorias.find(
                      (c) => c.id === produto.categoriaId
                    )?.nome ?? "Sem categoria"}
                  </span>

                  <h2>{produto.nome}</h2>

                  <p>{produto.descricao}</p>

                  <div className="produto-footer">
                    <strong>
                      R${" "}
                      {Number(produto.preco)
                        .toFixed(2)
                        .replace(".", ",")}
                    </strong>

                    <button
                      onClick={() =>
                        handleAdicionarAoCarrinho(produto)
                      }
                    >
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;