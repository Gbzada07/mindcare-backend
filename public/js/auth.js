const API_URL = "https://mindcare-backend-bq21.onrender.com/api";

// CADASTRO
async function cadastrar(nome, email, senha) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Erro no cadastro");

    alert("✅ Cadastro realizado!");
    window.location.href = "login.html";
  } catch (err) {
    alert("Erro: " + err.message);
  }
}

// LOGIN
async function logar(email, senha) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Login falhou");

    localStorage.setItem("token", data.token);
    alert("✅ Login realizado!");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("Erro: " + err.message);
  }
}
