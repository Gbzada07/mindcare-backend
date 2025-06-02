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

// Botão sair
function setupLogout() {
  const sairLink = document.querySelectorAll('.sidebar a');
  sairLink.forEach(link => {
    if (link.innerText.includes("Sair")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.href = "login.html";
      });
    }
  });
}

// Menu hambúrguer
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

// Botão interno "Especialista"
function setupEspecialistaBtn() {
  const especialistaBtn = document.getElementById("especialistaBtn");
  const autoavaliacaoCard = document.querySelector(".autoavaliacao-card");
  const cards = document.querySelector(".cards");

  if (!especialistaBtn || !autoavaliacaoCard || !cards) return;

  especialistaBtn.addEventListener("click", (e) => {
    e.preventDefault();
    autoavaliacaoCard.style.display = "block";
    cards.style.display = "none";
  });

  const voltarBtn = document.getElementById("voltarBtn");
  if (voltarBtn) {
    voltarBtn.addEventListener("click", () => {
      autoavaliacaoCard.style.display = "none";
      cards.style.display = "flex";
    });
  }
}

// Autoavaliação no menu lateral
function setupAutoavaliacaoMenu() {
  const links = document.querySelectorAll(".sidebar a");
  const main = document.querySelector(".main");

  links.forEach(link => {
    if (link.innerText.trim().includes("Autoavaliação")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const originalContent = main.innerHTML;

        main.innerHTML = `
          <div class="autoavaliacao-card">
            <h2><span>🍃</span> Autoavaliação Emocional</h2>
            <p>Responda com sinceridade para acompanhar seu bem-estar mental.</p>

            <form>
              <label>😊 Você se sente calmo e relaxado?</label>
              <select required>
                <option value="">Selecione</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
                <option value="mais-ou-menos">Mais ou menos</option>
              </select>

              <label>😴 Você tem dormido bem?</label>
              <select required>
                <option value="">Selecione</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
                <option value="variado">Variado</option>
              </select>

              <label>💪 Você se sente motivado hoje?</label>
              <select required>
                <option value="">Selecione</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
                <option value="mais-ou-menos">Mais ou menos</option>
              </select>

              <div style="margin-top: 1.5rem;">
                <button type="submit" class="button">Ver Resultado</button>
              </div>
            </form>
          </div>
        `;

        const form = main.querySelector("form");
        form.addEventListener("submit", (ev) => {
          ev.preventDefault();

          const selects = form.querySelectorAll("select");
          const respostas = Array.from(selects).map(s => s.value);

          let score = 0;
          respostas.forEach(resp => {
            if (resp === "sim") score += 2;
            else if (resp === "mais-ou-menos" || resp === "variado") score += 1;
          });

          let resultado = "";
          if (score >= 5) {
            resultado = "😊 Você está se sentindo bem hoje! Continue cuidando de você.";
          } else if (score >= 3) {
            resultado = "😐 Seu estado emocional está variando. Tire um tempo para relaxar.";
          } else {
            resultado = "😟 Você parece estar um pouco estressado. Que tal conversar com alguém de confiança?";
          }

          const historico = JSON.parse(localStorage.getItem("historico")) || [];
          historico.push({
            data: new Date().toLocaleDateString(),
            score: score,
            texto: resultado
          });
          localStorage.setItem("historico", JSON.stringify(historico));

          main.innerHTML = `
            <div class="autoavaliacao-card">
              <h2>Resultado da Autoavaliação</h2>
              <p>${resultado}</p>
              <button class="button" id="voltarBtn" style="margin-top: 1.5rem;">⬅️ Voltar à Tela Inicial</button>
            </div>
          `;

          const voltar = document.getElementById("voltarBtn");
          voltar.addEventListener("click", () => {
            main.innerHTML = originalContent;
          });
        });
      });
    }
  });
}

// Histórico
function setupHistoricoMenu() {
  const links = document.querySelectorAll(".sidebar a");
  const main = document.querySelector(".main");

  links.forEach(link => {
    if (link.innerText.trim().includes("Histórico")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const historico = JSON.parse(localStorage.getItem("historico")) || [];

        if (historico.length === 0) {
          main.innerHTML = `
            <h1>📅 Histórico</h1>
            <p>Você ainda não fez nenhuma autoavaliação.</p>
          `;
          return;
        }

        const cards = historico.slice(-5).reverse().map(item => `
          <div class="card">
            <h3>${item.data}</h3>
            <p>${item.texto}</p>
          </div>
        `).join("");

        const labels = historico.map(item => item.data);
        const dados = historico.map(item => item.score);

        main.innerHTML = `
          <h1>📅 Histórico de Autoavaliações</h1>
          <div class="cards">${cards}</div>

          <div style="margin-top: 2rem;">
            <h2 style="margin-bottom: 1rem;">📊 Evolução Emocional</h2>
            <canvas id="graficoHistorico" height="150"></canvas>
          </div>
        `;

        const ctx = document.getElementById("graficoHistorico").getContext("2d");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [{
              label: "Nível Emocional",
              data: dados,
              backgroundColor: function (context) {
                const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, "#60a5fa");
                gradient.addColorStop(1, "#38bdf8");
                return gradient;
              },
              borderRadius: 12,
              borderSkipped: false
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                labels: {
                  color: "#222",
                  font: {
                    weight: "bold"
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const index = context.dataIndex;
                    const score = context.raw;
                    const historico = JSON.parse(localStorage.getItem("historico")) || [];
                    const texto = historico[index]?.texto || "";
                    return [`Score: ${score}`, texto];
                  }
                }
              }
            },
            scales: {
              x: { ticks: { color: "#222" } },
              y: {
                beginAtZero: true,
                max: 6,
                ticks: { stepSize: 1, color: "#222" }
              }
            }
          }
        });
      });
    }
  });
}

// Especialista no menu
function setupEspecialistaMenu() {
  const links = document.querySelectorAll(".sidebar a");
  const main = document.querySelector(".main");

  links.forEach(link => {
    if (link.innerText.trim().includes("Especialista")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        main.innerHTML = `
          <div class="especialista-card">
            <img src="https://cdn-icons-png.flaticon.com/512/921/921347.png" alt="Especialista" style="width: 80px; margin: 0 auto; display: block;" />
            <h2 style="text-align: center; color: #6366f1; margin-top: 1rem;">Fale com um Especialista</h2>
            <p style="text-align: center; margin-top: 0.5rem;">Converse com um de nossos especialistas e receba orientações personalizadas para seu bem-estar emocional 💜</p>
            
            <form style="max-width: 500px; margin: 2rem auto 0;">
              <input type="text" placeholder="Assunto da mensagem" style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: none; margin-bottom: 1rem;" required />
              <textarea placeholder="Descreva o que você está sentindo ou precisa de ajuda..." rows="5" style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: none;" required></textarea>
              <button class="button" type="submit" style="margin-top: 1.5rem;">📤 Enviar Mensagem</button>
            </form>
          </div>
        `;

        const form = main.querySelector("form");
        form.addEventListener("submit", (ev) => {
          ev.preventDefault();
          alert("Mensagem enviada com sucesso! Um especialista entrará em contato.");
          form.reset();
        });
      });
    }
  });
}

// Configurações no menu
function setupConfiguracoesMenu() {
  const links = document.querySelectorAll(".sidebar a");
  const main = document.querySelector(".main");

  links.forEach(link => {
    if (link.innerText.trim().includes("Configurações")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        main.innerHTML = `
          <div class="configuracoes-card">
            <h2>⚙️ Configurações do Usuário</h2>

            <label for="tema">Tema</label>
            <select id="tema">
              <option value="claro">Claro</option>
              <option value="escuro">Escuro</option>
            </select>

            <label for="frequencia">Frequência de Alertas (em dias)</label>
            <input type="number" id="frequencia" placeholder="Ex: 7">

            <label for="limite">Limite de Pontuação de Risco</label>
            <input type="number" id="limite" placeholder="Ex: 60">

            <button class="button" id="salvarConfiguracoesBtn">💾 Salvar Configurações</button>
          </div>
        `;

        const salvarBtn = document.getElementById("salvarConfiguracoesBtn");
        salvarBtn.addEventListener("click", () => {
          const tema = document.getElementById("tema").value;
          const frequencia = document.getElementById("frequencia").value;
          const limite = document.getElementById("limite").value;

          const configuracoes = {
            tema,
            frequencia: Number(frequencia),
            limite: Number(limite),
          };

          localStorage.setItem("configuracoes", JSON.stringify(configuracoes));
          alert("Configurações salvas com sucesso!");
        });

        const salvas = JSON.parse(localStorage.getItem("configuracoes"));
        if (salvas) {
          document.getElementById("tema").value = salvas.tema || "claro";
          document.getElementById("frequencia").value = salvas.frequencia || "";
          document.getElementById("limite").value = salvas.limite || "";
        }
      });
    }
  });
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  carregarUsuario();
  setupLogout();
  setupHamburgerMenu();
  setupEspecialistaBtn();
  setupAutoavaliacaoMenu();
  setupHistoricoMenu();
  setupEspecialistaMenu();
  setupConfiguracoesMenu();
});
