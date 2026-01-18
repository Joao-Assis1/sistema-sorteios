import * as db from "../config/database.js";

class UserRepository {
  // 1. Buscar usuário por E-mail (Para o Login)
  async findByEmail(email) {
    // Agora buscamos em 'lastlink_members' e juntamos com 'user_roles'
    // O 'AS role' renomeia a coluna para o seu login continuar funcionando
    const query = `
      SELECT 
        m.*, 
        r.role_name as role
      FROM lastlink_members m
      LEFT JOIN user_roles r ON m.id = r.member_id
      WHERE m.email = $1
    `;

    const { rows } = await db.query(query, [email]);
    return rows[0];
  }

  // 2. Criar novo usuário (Para o Registro)
  async create({ name, email, password, role = "member" }) {
    // password aqui já vem hasheada pelo Service
    const client = await db.pool.connect(); // Precisamos de client para transação

    try {
      await client.query("BEGIN"); // Inicia transação (segurança)

      // Passo A: Inserir em lastlink_members
      const insertMemberQuery = `
        INSERT INTO lastlink_members (name, email, password_hash, status)
        VALUES ($1, $2, $3, 'active')
        RETURNING id, name, email;
      `;
      // Nota: O banco espera 'password_hash', mas seu objeto pode ter vindo como 'password'
      const memberResult = await client.query(insertMemberQuery, [
        name,
        email,
        password,
      ]);
      const newMember = memberResult.rows[0];

      // Passo B: Inserir o cargo em user_roles
      const insertRoleQuery = `
        INSERT INTO user_roles (member_id, role_name)
        VALUES ($1, $2);
      `;
      await client.query(insertRoleQuery, [newMember.id, role]);

      await client.query("COMMIT"); // Salva tudo

      // Retorna o objeto montadinho
      return { ...newMember, role };
    } catch (error) {
      await client.query("ROLLBACK"); // Se der erro, desfaz tudo
      throw error;
    } finally {
      client.release(); // Libera a conexão
    }
  }

  // 3. Buscar por ID (se você usar em algum lugar)
  async findById(id) {
    const query = `
      SELECT m.*, r.role_name as role
      FROM lastlink_members m
      LEFT JOIN user_roles r ON m.id = r.member_id
      WHERE m.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

export default new UserRepository();
