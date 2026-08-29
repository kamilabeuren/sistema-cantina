import { useState, useEffect } from "react";
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

    if (!nome.trim() || Number(preco) <= 0 || Number(estoque) < 0 || !categoriaId) {
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
  }

  function handleExcluir(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      excluirProduto(id);
      carregarDados();
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gerenciar Produtos</h2>

      {/* Formulário */}
      <form onSubmit={handleSalvar} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          {idEditando ? "Editar Produto" : "Novo Produto"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nome do Produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          />

          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          >
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Preço (R$)"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            step="0.01"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          />

          <input
            type="number"
            placeholder="Estoque"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          />
        </div>

        {/* Campo de Upload de Imagem */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Imagem do Produto</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImagemChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
          {imagem && (
            <div className="mt-2">
              <img
                src={imagem}
                alt="Prévia"
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {idEditando ? "Atualizar Produto" : "Cadastrar Produto"}
          </button>
          {idEditando && (
            <button
              type="button"
              onClick={limparFormulario}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabela de Produtos */}
      <h3 className="text-xl font-bold mb-4 text-gray-800">Produtos Cadastrados</h3>
      
      {produtos.length === 0 ? (
        <p className="text-gray-500">Nenhum produto cadastrado até o momento.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="p-4">Foto</th>
                <th className="p-4">Nome</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Estoque</th>
                <th className="p-4">Categoria</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {produtos.map((p) => {
                const cat = categorias.find((c) => c.id === p.categoriaId);
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      {p.imagem ? (
                        <img
                          src={p.imagem}
                          alt={p.nome}
                          className="w-12 h-12 object-cover rounded-md border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">
                          Sem foto
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium text-gray-800">{p.nome}</td>
                    <td className="p-4 text-gray-600">R$ {Number(p.preco).toFixed(2)}</td>
                    <td className="p-4 text-gray-600">{p.estoque} u.</td>
                    <td className="p-4 text-gray-600">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium">
                        {cat ? cat.nome : "Sem Categoria"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditar(p)}
                        className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleExcluir(p.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}