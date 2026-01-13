import { z } from "zod";

// Higher-Order Function: Uma função que retorna outra função (middleware do Express)
export const validate = (schema) => (req, res, next) => {
  try {
    // O método .parse() do Zod valida e lança erro se falhar.
    // Validamos body, query e params de uma vez só.
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    next(); // Dados válidos! Passa para o Controller.
  } catch (err) {
    // Se for erro do Zod (validação), formatamos para ficar bonito no retorno
    if (err instanceof z.ZodError) {
      const errors = err.errors.map((e) => ({
        campo: e.path[1], // Pega o nome do campo (ex: 'email')
        mensagem: e.message, // A mensagem que definimos no schema
      }));

      return res.status(400).json({
        status: "fail",
        message: "Dados de entrada inválidos",
        errors: errors,
      });
    }

    // Se for outro erro qualquer, passa para o Global Error Handler
    next(err);
  }
};
