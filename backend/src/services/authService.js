import { query } from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {
  async login(email, senhaTextoPlano) {
    const sql = "SELECT * FROM administradores WHERE email = $1";
    const result = await query(sql, [email]);
    const admin = result.rows[0];

    if (!admin) throw new Error("Credenciais inválidas.");

    const senhaValida = await bcrypt.compare(senhaTextoPlano, admin.senha_hash);
    if (!senhaValida) throw new Error("Credenciais inválidas.");

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "ADMIN" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, admin: { id: admin.id, email: admin.email } };
  }
}

export default new AuthService();
