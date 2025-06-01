const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rotas públicas
router.post("/register", register);
router.post("/login", login);

// Rota protegida: retorna dados do usuário autenticado
router.get("/user", authMiddleware, (req, res) => {
  const { id, nome, email } = req.user;
  res.json({ id, nome, email });
});

module.exports = router;
