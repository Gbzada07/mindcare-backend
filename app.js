require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);

sequelize.authenticate()
  .then(() => {
    console.log("✅ Conectado ao banco com sucesso!");
    return sequelize.sync();
  })
  .then(() => {
    console.log("📦 Banco sincronizado com sucesso.");
    app.listen(3001, () => {
      console.log("🚀 Servidor rodando na porta 3001");
    });
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar com o banco:", err);
  });
