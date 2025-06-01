// URL base da API 
const API_URL = "https://mindcare-backend-bq21.onrender.com/api";

// Função para carregar dados do usuário
async function carregarUsuario() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao buscar dados.");
    }

    // Atualizar saudação com o nome do usuário
    const saudacao = document.querySelector("main h1");
    if (saudacao) {
      saudacao.textContent = `Olá, ${data.nome}!`;
    }
  } catch (err) {
    console.error("Erro:", err);
    alert("Sessão expirada. Faça login novamente.");
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }
}

// Função de logout
function setupLogout() {
  const sairLink = document.querySelector('.sidebar a[href="#"]:last-of-type');
  if (sairLink) {
    sairLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }
}

// Ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  carregarUsuario();
  setupLogout();
});
