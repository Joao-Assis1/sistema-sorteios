import authService from "../services/authService.js";

export const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) throw new Error("Email e senha são obrigatórios.");

    const data = await authService.login(email, senha);
    res.status(200).json({ status: "success", data });
  } catch (error) {
    if (error.message === "Credenciais inválidas.") {
      error.statusCode = 401;
    }
    next(error);
  }
};
