import { useMemo, useState } from "react";
import "./Cardapio.css";

const produtos = [
  {
    id: 1,
    nome: "pão com hambúrguer",
    descricao: "Pão, hambúrguer",
    preco: 12.0,
    categoria: "Hambúrgueres",
    imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },
  {
    id: 2,
    nome: "Pão,presunto,queijo",
    descricao: "Pão, presunto, queijo",
    preco: 10.0,
    categoria: "Sanduíches",
    imagem: "https://images.unsplash.com/photo-1550547660-d9450f859349",
  },
  {
    id: 3,
    nome: "pão de queijo",
    descricao: "pão de queijo",
    preco: 10.0,
    categoria: "Salgados",
    imagem: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
  },
  {
    id: 4,
    nome: "Nuggets",
    descricao: "Porção com 8 nuggets crocantes",
    preco: 18.9,
    categoria: "Porções",
    imagem: "https://images.unsplash.com/photo-1562967914-608f82629710",
  },
  {
    id: 5,
    nome: "Coca-Cola",
    descricao: "Refrigerante 350ml",
    preco: 6.9,
    categoria: "Bebidas",
    imagem: "https://images.unsplash.com/photo-1554866585-cd94860890b7",
  },
  {
    id: 6,
    nome: "Suco de Laranja",
    descricao: "Suco natural de laranja",
    preco: 8.9,
    categoria: "Bebidas",
    imagem: "https://images.unsplash.com/photo-1600271886742-f049cd451bba",
  },
];

const categorias = [
  "Todos",
  ...new Set(produtos.map((produto) => produto.categoria)),
];

function App() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  const produtosFiltrados = useMemo(
    () =>
      categoriaSelecionada === "Todos"
        ? produtos
        : produtos.filter(
            (produto) => produto.categoria === categoriaSelecionada
          ),
    [categoriaSelecionada]
  );

  function adicionarAoCarrinho(produto) {
    setCarrinho((carrinhoAtual) => {
      const produtoExistente = carrinhoAtual.find(
        (item) => item.id === produto.id
      );

      if (produtoExistente) {
        return carrinhoAtual.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...carrinhoAtual, { ...produto, quantidade: 1 }];
    });
  }

  function removerDoCarrinho(id) {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual
        .map((item) =>
          item.id === id
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  }

  const quantidadeTotal = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  const valorTotal = carrinho.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>🍔 Meu Cardápio</h1>
          <p>Escolha seus produtos favoritos</p>
        </div>

        <button
          className="cart-button"
          onClick={() => setCarrinhoAberto(true)}
        >
          🛒 Carrinho
          <span>{quantidadeTotal}</span>
        </button>
      </header>

      <main className="container">
        <section className="categorias">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              className={categoriaSelecionada === categoria ? "ativo" : ""}
              onClick={() => setCategoriaSelecionada(categoria)}
            >
              {categoria}
            </button>
          ))}
        </section>

        <section className="produtos">
          {produtosFiltrados.map((produto) => (
            <article className="produto" key={produto.id}>
              <img src={produto.imagem} alt={produto.nome} />

              <div className="produto-info">
                <span className="categoria">{produto.categoria}</span>

                <h2>{produto.nome}</h2>

                <p>{produto.descricao}</p>

                <div className="produto-footer">
                  <strong>
                    R$ {produto.preco.toFixed(2).replace(".", ",")}
                  </strong>

                  <button onClick={() => adicionarAoCarrinho(produto)}>
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      {carrinhoAberto && (
        <div className="overlay">
          <aside className="carrinho">
            <div className="carrinho-header">
              <h2>🛒 Seu Carrinho</h2>

              <button
                className="fechar"
                onClick={() => setCarrinhoAberto(false)}
              >
                ✕
              </button>
            </div>

            {carrinho.length === 0 ? (
              <div className="carrinho-vazio">
                <span>🛒</span>
                <p>Seu carrinho está vazio.</p>
              </div>
            ) : (
              <>
                <div className="itens-carrinho">
                  {carrinho.map((item) => (
                    <div className="item-carrinho" key={item.id}>
                      <div>
                        <h3>{item.nome}</h3>

                        <p>
                          R${" "}
                          {item.preco.toFixed(2).replace(".", ",")}
                        </p>
                      </div>

                      <div className="quantidade">
                        <button onClick={() => removerDoCarrinho(item.id)}>
                          −
                        </button>

                        <span>{item.quantidade}</span>

                        <button onClick={() => adicionarAoCarrinho(item)}>
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="total">
                  <span>Total</span>

                  <strong>
                    R$ {valorTotal.toFixed(2).replace(".", ",")}
                  </strong>
                </div>

                <button className="finalizar">Finalizar Pedido</button>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;