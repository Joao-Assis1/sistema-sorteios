import { createClient } from "@supabase/supabase-js";

// Inicializa o cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "⚠️  SUPABASE_URL ou SUPABASE_KEY não definidos. Middleware de auth não funcionará.",
  );
}

const supabase = createClient(supabaseUrl || "", supabaseKey || "");

/**
 * Middleware de autenticação via Supabase Auth
 * Valida o JWT enviado no header Authorization
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // 1. Pegar o token do Header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Token de acesso não fornecido.",
        code: "MISSING_TOKEN",
      });
    }

    // 2. Extrair o token do formato "Bearer [TOKEN]"
    const [scheme, token] = authHeader.split(" ");

    if (!/^Bearer$/i.test(scheme) || !token) {
      return res.status(401).json({
        error: "Formato de token inválido. Use: Bearer [TOKEN]",
        code: "INVALID_FORMAT",
      });
    }

    // 3. Validar o token com Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error("Supabase Auth Error:", error?.message || "No user found");
      return res.status(403).json({
        error: "Token inválido ou expirado.",
        code: "INVALID_TOKEN",
      });
    }

    // 4. Anexar usuário à requisição e continuar
    req.user = user;
    req.userId = user.id;
    req.userEmail = user.email;

    return next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      error: "Erro interno na autenticação.",
      code: "AUTH_ERROR",
    });
  }
};

// Alias para compatibilidade com código existente
export const verifyToken = authMiddleware;

export default authMiddleware;
