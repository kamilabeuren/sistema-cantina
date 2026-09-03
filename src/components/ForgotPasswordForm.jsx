import { useState } from "react";
import { changePassword } from "../services/authService";
import { Mail, CheckCircle2, LockKeyhole, ArrowLeft } from "lucide-react";

export default function ForgotPasswordForm({ onBackToLogin }) {
  const [etapa, setEtapa] = useState("email");

  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");

  function handleEnviarEmail(event) {
    event.preventDefault();
    setErro("");

    const emailInformado = email.trim().toLowerCase();

    if (!emailInformado) {
      setErro("Informe seu e-mail.");
      return;
    }

    /*
     * Simulação do envio do e-mail.
     *
     * O link não é realmente enviado.
     * Apenas avançamos para a tela que simula
     * o e-mail recebido pelo usuário.
     */
    setEtapa("emailEnviado");
  }

  function handleAbrirLink() {
    setErro("");
    setEtapa("novaSenha");
  }

  function handleAlterarSenha(event) {
    event.preventDefault();
    setErro("");

    if (novaSenha.length < 4) {
      setErro("A senha deve ter pelo menos 4 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      changePassword({
        email,
        novaSenha,
      });

      setEtapa("sucesso");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error) {
      setErro(error.message);
    }
  }

  function voltarParaEmail() {
    setErro("");
    setEtapa("email");
  }

  // ETAPA 1 — INFORMAR E-MAIL
  if (etapa === "email") {
    return (
      <>
        <button
          type="button"
          onClick={onBackToLogin}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao login
        </button>

        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
          <Mail className="w-6 h-6 text-primary-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Esqueceu sua senha?
        </h1>

        <p className="mt-2 text-gray-600">
          Informe o e-mail cadastrado para receber o link de recuperação.
        </p>

        <form onSubmit={handleEnviarEmail} className="mt-7 space-y-4">
          {erro && (
            <p className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">
              {erro}
            </p>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              E-mail
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Digite seu e-mail"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-primary-500 px-6 py-4 font-bold text-white hover:bg-primary-600 transition-colors"
          >
            Enviar link de recuperação
          </button>
        </form>
      </>
    );
  }

  // ETAPA 2 — E-MAIL ENVIADO
  if (etapa === "emailEnviado") {
    return (
      <>
        <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-7 h-7 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          E-mail enviado!
        </h1>

        <p className="mt-3 text-gray-600 leading-relaxed">
          Enviamos um e-mail para{" "}
          <strong className="text-gray-900">{email}</strong> com um link para
          redefinir sua senha.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Verifique sua caixa de entrada e clique no link para continuar.
        </p>

        {/* Simulação do e-mail recebido */}
        <div className="mt-7 rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary-600" />

              <div>
                <p className="text-sm font-bold text-gray-900">
                  Cantina do Campus
                </p>

                <p className="text-xs text-gray-500">
                  Recuperação de senha
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <p className="text-sm text-gray-700">
              Olá! Recebemos uma solicitação para redefinir sua senha.
            </p>

            <p className="text-sm text-gray-600 mt-3">
              Clique no botão abaixo para criar uma nova senha:
            </p>

            <button
              type="button"
              onClick={handleAbrirLink}
              className="mt-5 w-full rounded-xl bg-primary-500 hover:bg-primary-600 px-5 py-3 text-sm font-bold text-white transition-colors"
            >
              Redefinir minha senha
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              Simulação de e-mail para demonstração do sistema.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToLogin}
          className="mt-6 w-full text-sm font-bold text-primary-600 hover:text-primary-700"
        >
          Voltar ao login
        </button>
      </>
    );
  }

  // ETAPA 3 — NOVA SENHA
  if (etapa === "novaSenha") {
    return (
      <>
        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
          <LockKeyhole className="w-6 h-6 text-primary-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Criar nova senha
        </h1>

        <p className="mt-2 text-gray-600">
          Digite sua nova senha para recuperar o acesso à sua conta.
        </p>

        <form onSubmit={handleAlterarSenha} className="mt-7 space-y-4">
          {erro && (
            <p className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">
              {erro}
            </p>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nova senha
            </label>

            <input
              type="password"
              required
              minLength="4"
              value={novaSenha}
              onChange={(event) => setNovaSenha(event.target.value)}
              placeholder="Digite sua nova senha"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirmar nova senha
            </label>

            <input
              type="password"
              required
              minLength="4"
              value={confirmarSenha}
              onChange={(event) => setConfirmarSenha(event.target.value)}
              placeholder="Digite novamente sua nova senha"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-primary-500 px-6 py-4 font-bold text-white hover:bg-primary-600 transition-colors"
          >
            Redefinir senha
          </button>
        </form>

        <button
          type="button"
          onClick={voltarParaEmail}
          className="mt-6 w-full text-sm font-bold text-primary-600 hover:text-primary-700"
        >
          Voltar
        </button>
      </>
    );
  }

  // ETAPA 4 — SUCESSO
  return (
    <>
      <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
        <CheckCircle2 className="w-7 h-7 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900">
        Senha alterada!
      </h1>

      <p className="mt-3 text-gray-600 leading-relaxed">
        Sua senha foi alterada com sucesso.
      </p>

      <p className="mt-2 text-sm text-gray-500">
        Agora você já pode entrar na sua conta utilizando a nova senha.
      </p>

      <button
        type="button"
        onClick={onBackToLogin}
        className="mt-7 w-full rounded-full bg-primary-500 px-6 py-4 font-bold text-white hover:bg-primary-600 transition-colors"
      >
        Voltar ao login
      </button>
    </>
  );
}