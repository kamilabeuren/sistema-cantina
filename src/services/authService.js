const USERS_KEY = "cantina_users";
const SESSION_KEY = "cantina_current_user";

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function register({ nome, email, senha }) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const exists = users.some((user) => user.email === normalizedEmail);

  if (exists) {
    throw new Error("Já existe uma conta cadastrada com este e-mail.");
  }

  const newUser = {
    id: crypto.randomUUID(),
    nome: nome.trim(),
    email: normalizedEmail,
    senha,
    role: "cliente",
  };

  saveUsers([...users, newUser]);
}

export function login({ email, senha }) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = getUsers().find(
    (item) => item.email === normalizedEmail && item.senha === senha
  );

  if (!user) {
    throw new Error("E-mail ou senha inválidos.");
  }

  // Não guarda a senha na sessão.
  const currentUser = {
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));

  return currentUser;
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(SESSION_KEY));
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function changePassword({ email, novaSenha }) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const userIndex = users.findIndex(
    (user) => user.email === normalizedEmail
  );

  if (userIndex === -1) {
    throw new Error("Nenhuma conta foi encontrada com este e-mail.");
  }

  users[userIndex].senha = novaSenha;
  saveUsers(users);
}

export function ensureDefaultAdmin() {
  const users = getUsers();

  const adminAlreadyExists = users.some(
    (user) => user.email === "admin@cantina.com"
  );

  const alunoAlreadyExists = users.some(
    (user) => user.email === "aluno@cantina.com"
  );

  const newUsers = [...users];

  // Cria o administrador de teste caso ainda não exista
  if (!adminAlreadyExists) {
    newUsers.push({
      id: crypto.randomUUID(),
      nome: "Administrador",
      email: "admin@cantina.com",
      senha: "1234",
      role: "admin",
    });
  }

  // Cria o aluno de teste caso ainda não exista
  if (!alunoAlreadyExists) {
    newUsers.push({
      id: crypto.randomUUID(),
      nome: "Aluno Teste",
      email: "aluno@cantina.com",
      senha: "1234",
      role: "cliente",
    });
  }

  saveUsers(newUsers);
}