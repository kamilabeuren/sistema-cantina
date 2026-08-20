import { useState } from "react";
import { changePassword } from "../../services/authService";

export default function ForgotPasswordForm({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setSucesso("");

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      changePassword({ email, novaSenha });
      setSucesso("Senha alterada com sucesso.");
      setEmail("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900">Trocar senha</h1>

      <p className="mt-2 text-gray-600">
        Informe seu e-mail e escolha uma nova senha.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        {erro && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
        {sucesso && <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{sucesso}</p>}

        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="E-mail cadastrado"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-primary-500"
        />

        <input
          type="password"
          required
          minLength="4"
          value={novaSenha}
          onChange={(event) => setNovaSenha(event.target.value)}
          placeholder="Nova senha"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-primary-500"
        />

        <input
          type="password"
          required
          minLength="4"
          value={confirmarSenha}
          onChange={(event) => setConfirmarSenha(event.target.value)}
          placeholder="Confirme a nova senha"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-primary-500"
        />

        <button
          type="submit"
          className="w-full rounded-full bg-primary-500 px-6 py-4 font-bold text-white hover:bg-primary-600"
        >
          Alterar senha
        </button>
      </form>

      <button
        type="button"
        onClick={onBackToLogin}
        className="mt-6 w-full text-sm font-bold text-primary-600"
      >
        Voltar ao login
      </button>
    </>
  );
}