import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cardapio.css";
import { listarProdutos } from "../services/produtoService";
import { listarCategorias } from "../services/categoriaService";
import {
  adicionarCarrinho,
  listarCarrinho,
} from "../services/carrinhoService";

function contarItensCarrinho() {
  return listarCarrinho().reduce(
    (total, item) => total + item.quantity,
    0
  );
}

function App() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState("Todos");
  const [quantidadeCarrinho, setQuantidadeCarrinho] =
    useState(0);

  // Carrega produtos e categorias
  useEffect(() => {
    setProdutos(listarProdutos());
    setCategorias(listarCategorias());
  }, []);

  // Atualiza o contador do carrinho
  useEffect(() => {
    setQuantidadeCarrinho(contarItensCarrinho());

    const handleAtualizacao = () => {
      setQuantidadeCarrinho(contarItensCarrinho());
    };

    window.addEventListener(
      "carrinhoAtualizado",
      handleAtualizacao
    );

    return () => {
      window.removeEventListener(
        "carrinhoAtualizado",
        handleAtualizacao
      );
    };
  }, []);

  // Atualiza os produtos quando houver alteração no estoque
  useEffect(() => {
    const handleProdutosAtualizados = () => {
      setProdutos(listarProdutos());
    };

    window.addEventListener(
      "produtosAtualizados",
      handleProdutosAtualizados
    );

    return () => {
      window.removeEventListener(
        "produtosAtualizados",
        handleProdutosAtualizados
      );
    };
  }, []);

  const nomesCategorias = useMemo(
    () => [
      "Todos",
      ...categorias.map((categoria) => categoria.nome),
    ],
    [categorias]
  );

  const produtosFiltrados = useMemo(() => {
    if (categoriaSelecionada === "Todos") {
      return produtos;
    }

    const categoriaAtual = categorias.find(
      (categoria) =>
        categoria.nome === categoriaSelecionada
    );

    if (!categoriaAtual) {
      return produtos;
    }

    return produtos.filter(
      (produto) =>
        produto.categoriaId === categoriaAtual.id
    );
  }, [
    produtos,
    categorias,
    categoriaSelecionada,
  ]);

  function handleAdicionarAoCarrinho(produto) {
    // Não permite adicionar produto sem estoque
    if (Number(produto.estoque) <= 0) {
      return;
    }

    const resultado = adicionarCarrinho(produto);

    // Se a quantidade disponível já foi atingida,
    // simplesmente não adiciona mais.
    // Não usamos alert ou modal.
    if (
      !resultado.sucesso &&
      resultado.motivo === "estoque_insuficiente"
    ) {
      return;
    }
  }

  return (
    <div className="app">
      <header className="bg-white font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6">
          <div className="space-y-3 text-center">

            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-900 text-xs font-bold tracking-wide">
              Cantina digital IFRS
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Escolha seu lanche.
              <br />

              <span className="text-primary-600">
                Sem perder o intervalo.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed mx-auto">
              Confira nosso cardápio e escolha seus produtos favoritos.
            </p>

          </div>
        </div>
      </header>

      <main className="container">

        {/* Categorias */}
        <section className="categorias">
          {nomesCategorias.map((categoria) => (
            <button
              key={categoria}
              className={
                categoriaSelecionada === categoria
                  ? "ativo"
                  : ""
              }
              onClick={() =>
                setCategoriaSelecionada(categoria)
              }
            >
              {categoria}
            </button>
          ))}
        </section>

        {/* Produtos */}
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

            {produtosFiltrados.map((produto) => {

              // Verifica se o produto está indisponível
              const indisponivel =
                Number(produto.estoque) <= 0;

              return (
                <article
                  key={produto.id}
                  className={`produto ${
                    indisponivel
                      ? "produto-indisponivel"
                      : ""
                  }`}
                >

                  {/* Imagem do produto */}
                  <div className="produto-imagem-container">

                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />

                    {/* Selo exibido quando o estoque chega a zero */}
                    {indisponivel && (
                      <span className="produto-indisponivel-badge">
                        Indisponível
                      </span>
                    )}

                  </div>

                  {/* Informações do produto */}
                  <div className="produto-info">

                    <span className="categoria">
                      {categorias.find(
                        (c) =>
                          c.id === produto.categoriaId
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
                        className={
                          indisponivel
                            ? "botao-indisponivel"
                            : ""
                        }
                        disabled={indisponivel}
                        onClick={() =>
                          handleAdicionarAoCarrinho(
                            produto
                          )
                        }
                      >
                        {indisponivel
                          ? "Indisponível"
                          : "Adicionar ao Carrinho"}
                      </button>

                    </div>
                  </div>

                </article>
              );
            })}

          </section>
        )}
      </main>
    </div>
  );
}

export default App;