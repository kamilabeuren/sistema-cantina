import { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

export default function Login({ onLogin }) {
  const [view, setView] = useState("login");

  return (
    <section className="flex-1 flex flex-col justify-center bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-md w-full px-4">
        
        {/* Logo do Instituto Federal como link para a Home */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <Link
            to="/"
            title="Ir para a página inicial"
            aria-label="Ir para a página inicial da Cantina IFRS"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-2xl p-1.5 transition-all hover:scale-105"
          >
            <div className="h-12 sm:h-14 flex items-center">
              <img
                src="/ifrs-logo.svg"
                alt="Instituto Federal Rio Grande do Sul - Logo"
                className="h-full w-auto object-contain"
              />
            </div>

            <div className="flex flex-col border-l border-gray-200 pl-3">
              <span className="font-bold text-lg sm:text-xl leading-tight text-gray-900 group-hover:text-primary-600 transition-colors">
                Cantina <span className="text-primary-600">IFRS</span>
              </span>
              <span className="text-[10px] sm:text-[11px] tracking-wider font-semibold uppercase text-gray-400">
                Sabor & Praticidade
              </span>
            </div>
          </Link>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 shadow-sm sm:p-8">
          {view === "login" && (
            <LoginForm
              onLogin={onLogin}
              onCreateAccount={() => setView("register")}
              onForgotPassword={() => setView("forgot")}
            />
          )}

          {view === "register" && (
            <RegisterForm onBackToLogin={() => setView("login")} />
          )}

          {view === "forgot" && (
            <ForgotPasswordForm onBackToLogin={() => setView("login")} />
          )}
        </div>

        {view === "login" && (
          <p className="mt-4 text-center text-xs text-gray-500">
            <span className="font-semibold text-gray-700">
              Admin:
            </span>{" "}
            admin@cantina.com
            {" · senha: "}
            <span className="font-semibold text-gray-700">
              1234
            </span>

            <br />

            <span className="font-semibold text-gray-700">
              Aluno:
            </span>{" "}
            aluno@cantina.com
            {" · senha: "}
            <span className="font-semibold text-gray-700">
              1234
            </span>
          </p>
        )}
      </div>
    </section>
  );
}