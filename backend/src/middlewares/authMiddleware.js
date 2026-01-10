import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const error = new Error("Token de acesso não fornecido.");
      error.statusCode = 401;
      throw error;
    }

    const [scheme, token] = authHeader.split(" ");

    if (!/^Bearer$/i.test(scheme) || !token) {
      const error = new Error("Formato de token inválido.");
      error.statusCode = 401;
      throw error;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        const error = new Error("Token inválido ou expirado.");
        error.statusCode = 403;
        throw error;
      }

      req.userId = decoded.id;
      req.userRole = decoded.role;
      return next();
    });
  } catch (error) {
    next(error);
  }
};
