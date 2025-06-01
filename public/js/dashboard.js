const API_URL = "https://mindcare-backend-bq21.onrender.com/api";

// Carrega os dados do usuário autenticado
async function carregarUsuario() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
    return;
  }

  try {
    console.log("Token encontrado no localStorage:", token);

    const response = await fetch(`${API_URL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("Resposta recebida da API:", data);

    if (!response.ok) {
      throw new Error(data.message || "Erro ao buscar dados.");
    }

    // Atualiza saudação com o nome, se disponível
    const saudacao = document.querySelector("main h1");
    if (saudacao && data.nome) {
      saudacao.textContent = `Olá, ${data.nome}!`;
    }

  } catch (err) {
    console.error("Erro ao carregar usuário:", err);
    alert("Sessão expirada ou inválida. Faça login novamente.");
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }
}

// Configura botão de sair
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

// Configura comportamento do menu hambúrguer
function setupHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.querySelector(".sidebar");
  const topbar = document.querySelector(".topbar");

  if (hamburger && sidebar && topbar) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      sidebar.classList.toggle("active");

      if (sidebar.classList.contains("active")) {
        topbar.classList.add("fixed");
      } else {
        topbar.classList.remove("fixed");
      }
    });
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  carregarUsuario();
  setupLogout();
  setupHamburgerMenu();
});
