const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const register = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const existente = await User.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ error: "E-mail já está em uso" });
    }

    const senha_hash = await bcrypt.hash(senha, 10);
    await User.create({ nome, email, senha_hash });

    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    res.status(500).json({
      error: "Erro no cadastro",
      details: error.message
    });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await User.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    // Garante que o token tenha id, nome, email
    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login realizado com sucesso",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro no login",
      details: error.message
    });
  }
};

module.exports = { register, login };
