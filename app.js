require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path"); // ✅ IMPORTANTE

const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ SERVE OS ARQUIVOS DA PASTA "public"
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", authRoutes);

// Porta dinâmica para funcionar no Render
const PORT = process.env.PORT || 3001;

sequelize.authenticate()
  .then(() => {
    console.log("✅ Conectado ao banco com sucesso!");
    return sequelize.sync();
  })
  .then(() => {
    console.log("📦 Banco sincronizado com sucesso.");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar com o banco:", err);
  });
