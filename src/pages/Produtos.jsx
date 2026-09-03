import { useState, useEffect } from "react";
import { Trash2, Pencil, Package, Upload, X, AlertTriangle } from "lucide-react";
import {
  listarProdutos,
  adicionarProduto,
  editarProduto,
  excluirProduto,
} from "../services/produtoService";
import { listarCategorias } from "../services/categoriaService";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [idEditando, setIdEditando] = useState(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [imagem, setImagem] = useState("");

  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  function carregarDados() {
    const listaProds = listarProdutos();
    const listaCats = listarCategorias();

    setProdutos(listaProds);
    setCategorias(listaCats);

    if (listaCats.length > 0 && !categoriaId) {
      setCategoriaId(listaCats[0].id);
    }
  }

  function handleImagemChange(e) {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagem(reader.result);
      };

      reader.readAsDataURL(file);
    }
  }

  function limparFormulario() {
    setIdEditando(null);
    setNome("");
    setDescricao("");
    setPreco("");
    setEstoque("");
    setImagem("");
  }

  function handleSalvar(e) {
    e.preventDefault();

    if (
      !nome.trim() ||
      Number(preco) <= 0 ||
      Number(estoque) < 0 ||
      !categoriaId
    ) {
      alert("Preencha todos os campos corretamente!");
      return;
    }

    const dadosProduto = {
      nome,
      descricao,
      preco: Number(preco),
      estoque: Number(estoque),
      categoriaId,
      imagem,
    };

    if (idEditando) {
      editarProduto(idEditando, dadosProduto);
    } else {
      adicionarProduto(dadosProduto);
    }

    limparFormulario();
    carregarDados();
  }

  function handleEditar(produto) {
    setIdEditando(produto.id);
    setNome(produto.nome);
    setDescricao(produto.descricao || "");
    setPreco(produto.preco);
    setEstoque(produto.estoque);
    setCategoriaId(produto.categoriaId);
    setImagem(produto.imagem || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function abrirModalExclusao(produto) {
    setProdutoParaExcluir(produto);
  }

  function fecharModalExclusao() {
    setProdutoParaExcluir(null);
  }

  function confirmarExclusao() {
    if (!produtoParaExcluir) return;

    excluirProduto(produtoParaExcluir.id);
    carregarDados();
    fecharModalExclusao();
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
              <Package className="w-3.5 h-3.5" />
              Área administrativa
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              Gerenciar <span className="text-primary-600">produtos</span>
            </h1>

            <p className="text-gray-600">
              Cadastre, edite e gerencie os produtos disponíveis na cantina.
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSalvar}
          className="border border-gray-200 bg-white rounded-2xl p-5 sm:p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {idEditando ? "Editar Produto" : "Novo Produto"}
              </h2>

              <p className="text-sm text-gray-500">
                Preencha os dados do produto abaixo.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Nome e categoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome do Produto
                </label>

                <input
                  type="text"
                  placeholder="Nome do Produto"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoria
                </label>

                <select
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  required
                >
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição
              </label>

              <input
                type="text"
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            {/* Preço e estoque */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preço (R$)
                </label>

                <input
                  type="number"
                  placeholder="Preço (R$)"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estoque
                </label>

                <input
                  type="number"
                  placeholder="Estoque"
                  value={estoque}
                  onChange={(e) => setEstoque(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  required
                />
              </div>
            </div>

            {/* Imagem */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Imagem do Produto
              </label>

              <label
                htmlFor="imagem-produto"
                className="w-full min-h-[100px] rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 px-4 py-5 text-center"
              >
                <Upload className="w-6 h-6 text-primary-600" />

                <span className="text-sm font-semibold text-gray-700">
                  Escolher arquivo
                </span>

                <span className="text-xs text-gray-500">
                  Selecione uma imagem do produto
                </span>

                <input
                  id="imagem-produto"
                  type="file"
                  accept="image/*"
                  onChange={handleImagemChange}
                  className="hidden"
                />
              </label>

              {imagem && (
                <div className="mt-4 flex items-center gap-4">
                  <img
                    src={imagem}
                    alt="Prévia"
                    className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Imagem selecionada
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Prévia da imagem do produto.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-all"
              >
                {idEditando ? "Atualizar Produto" : "Cadastrar Produto"}
              </button>

              {idEditando && (
                <button
                  type="button"
                  onClick={limparFormulario}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold transition-all"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Produtos cadastrados */}
        <section className="border border-gray-200 bg-white rounded-2xl overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Produtos Cadastrados
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Produtos disponíveis para gerenciamento.
                </p>
              </div>

              <span className="hidden sm:inline-flex px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold">
                {produtos.length}{" "}
                {produtos.length === 1 ? "produto" : "produtos"}
              </span>
            </div>
          </div>

          {produtos.length === 0 ? (
            <div className="p-10 text-center">
              <Package className="w-8 h-8 text-gray-300 mx-auto mb-3" />

              <p className="text-gray-500">
                Nenhum produto cadastrado até o momento.
              </p>
            </div>
          ) : (
            <>
              {/* Tabela desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-5 py-4 font-semibold">Foto</th>
                      <th className="px-5 py-4 font-semibold">Nome</th>
                      <th className="px-5 py-4 font-semibold">Preço</th>
                      <th className="px-5 py-4 font-semibold">Estoque</th>
                      <th className="px-5 py-4 font-semibold">Categoria</th>
                      <th className="px-5 py-4 font-semibold text-right">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {produtos.map((p) => {
                      const cat = categorias.find(
                        (c) => c.id === p.categoriaId
                      );

                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-gray-50/60 transition-colors"
                        >
                          <td className="px-5 py-4">
                            {p.imagem ? (
                              <img
                                src={p.imagem}
                                alt={p.nome}
                                className="w-14 h-14 object-cover rounded-xl border border-gray-200"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center">
                                <Package className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span className="font-bold text-gray-900">
                              {p.nome}
                            </span>

                            {p.descricao && (
                              <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                                {p.descricao}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4 font-semibold text-gray-900">
                            R$ {Number(p.preco).toFixed(2)}
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            {p.estoque} u.
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex bg-primary-50 text-primary-700 px-2.5 py-1 rounded-md text-xs font-bold">
                              {cat ? cat.nome : "Sem Categoria"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditar(p)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-primary-600 hover:bg-primary-50 font-semibold text-sm transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={() => abrirModalExclusao(p)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Cards mobile */}
              <div className="md:hidden divide-y divide-gray-100">
                {produtos.map((p) => {
                  const cat = categorias.find(
                    (c) => c.id === p.categoriaId
                  );

                  return (
                    <div key={p.id} className="p-5">
                      <div className="flex gap-4">
                        {p.imagem ? (
                          <img
                            src={p.imagem}
                            alt={p.nome}
                            className="w-20 h-20 object-cover rounded-xl border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
                            <Package className="w-6 h-6 text-gray-300" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-gray-900">
                            {p.nome}
                          </h3>

                          {p.descricao && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {p.descricao}
                            </p>
                          )}

                          <p className="text-lg font-extrabold text-primary-600 mt-2">
                            R$ {Number(p.preco).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 mt-4">
                        <div className="flex flex-col gap-2">
                          <span className="inline-flex w-fit bg-primary-50 text-primary-700 px-2.5 py-1 rounded-md text-xs font-bold">
                            {cat ? cat.nome : "Sem Categoria"}
                          </span>

                          <span className="text-sm text-gray-500">
                            Estoque:{" "}
                            <strong className="text-gray-700">
                              {p.estoque} u.
                            </strong>
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditar(p)}
                            className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
                            aria-label={`Editar ${p.nome}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => abrirModalExclusao(p)}
                            className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            aria-label={`Excluir ${p.nome}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Modal de exclusão */}
      {produtoParaExcluir && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900">
                      Excluir produto
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Esta ação não poderá ser desfeita.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={fecharModalExclusao}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-sm text-gray-500">
                  Você está prestes a excluir:
                </p>

                <p className="font-bold text-gray-900 mt-1">
                  {produtoParaExcluir.nome}
                </p>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                Tem certeza que deseja excluir este produto?
              </p>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={fecharModalExclusao}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={confirmarExclusao}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir produto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}