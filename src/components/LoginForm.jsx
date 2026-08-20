import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";
import { login } from "../services/authService";

export default function LoginForm({
  onLogin,
  onCreateAccount,
  onForgotPassword,
}) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setErro("");

    try {
      const user = login({ email, senha });
      onLogin(user);

      if (user.role === "admin") {
        navigate("/admin/produtos");
      } else {
        navigate("/");
      }
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <>
      <span className="inline-flex rounded-full bg-primary-100 px-3 py-2 text-xs font-bold text-primary-700">
        Cantina digital IFRS
      </span>

      <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900">
        Que bom ter você de volta.
      </h1>

      <p className="mt-2 text-gray-600">
        Entre para pedir seu lanche sem enfrentar filas.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        {erro && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {erro}
          </p>
        )}

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700">
            E-mail
          </span>

          <span className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 focus-within:border-primary-500">
            <Mail className="h-5 w-5 text-primary-600" />
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-transparent outline-none"
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700">
            Senha
          </span>

          <span className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 focus-within:border-primary-500">
            <LockKeyhole className="h-5 w-5 text-primary-600" />
            <input
              type="password"
              required
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Sua senha"
              className="w-full bg-transparent outline-none"
            />
          </span>
        </label>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            Esqueci minha senha
          </button>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-primary-500 px-6 py-4 font-bold text-white transition-colors hover:bg-primary-600"
        >
          Entrar
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Ainda não possui conta?{" "}
        <button
          type="button"
          onClick={onCreateAccount}
          className="font-bold text-primary-600 hover:text-primary-700"
        >
          Criar uma conta
        </button>
      </p>
    </>
  );
}
