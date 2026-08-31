import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

export default function Login({ onLogin }) {
  const [view, setView] = useState("login");

  return (
    <section className="flex-1 bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-md px-4">
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