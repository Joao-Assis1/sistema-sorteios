import authService from "../services/authService.js";

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const user = await authService.register(name, email, password);
      res.status(201).json(user);
    } catch (error) {
      if (error.message === "User already exists") {
        return res.status(409).json({ error: error.message });
      }
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const data = await authService.login(email, password);
      res.status(200).json(data);
    } catch (error) {
      if (error.message === "Invalid credentials") {
        return res.status(401).json({ error: error.message });
      }
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new AuthController();
