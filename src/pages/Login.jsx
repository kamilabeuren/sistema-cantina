import { Link } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";

export default function Login() {
  function handleSubmit(event) {
    event.preventDefault();
    // Depois você conecta aqui com a autenticação.
  }

  return (
    <section className="bg-white py-10 sm:py-16">
      <div className="max-w-md mx-auto px-4">
        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 sm:p-8 shadow-sm">
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
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-700">
                E-mail
              </span>
              <span className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 focus-within:border-primary-500">
                <Mail className="h-5 w-5 text-primary-600" />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full outline-none"
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
                  placeholder="Sua senha"
                  className="w-full outline-none"
                />
              </span>
            </label>

            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="accent-primary-600" />
                Lembrar de mim
              </label>

              <a href="#" className="font-semibold text-primary-600 hover:text-primary-700">
                Esqueci minha senha
              </a>
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
            <Link to="/cadastro" className="font-bold text-primary-600">
              Criar uma conta
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}