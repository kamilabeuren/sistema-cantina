import { useState } from "react";
import { register } from "../../services/authService";

export default function RegisterForm({ onBackToLogin }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setSucesso("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      register({ nome, email, senha });
      setSucesso("Conta criada com sucesso. Agora você já pode entrar.");
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900">Criar conta</h1>

      <p className="mt-2 text-gray-600">
        Faça seu cadastro para pedir pela cantina digital.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        {erro && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
        {sucesso && <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{sucesso}</p>}

        <input
          type="text"
          required
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          placeholder="Nome completo"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-primary-500"
        />

        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="E-mail"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-primary-500"
        />

        <input
          type="password"
          required
          minLength="4"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          placeholder="Crie uma senha"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-primary-500"
        />

        <input
          type="password"
          required
          minLength="4"
          value={confirmarSenha}
          onChange={(event) => setConfirmarSenha(event.target.value)}
          placeholder="Confirme sua senha"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-primary-500"
        />

        <button
          type="submit"
          className="w-full rounded-full bg-primary-500 px-6 py-4 font-bold text-white hover:bg-primary-600"
        >
          Criar conta
        </button>
      </form>

      <button
        type="button"
        onClick={onBackToLogin}
        className="mt-6 w-full text-sm font-bold text-primary-600"
      >
        Já tenho uma conta
      </button>
    </>
  );
}