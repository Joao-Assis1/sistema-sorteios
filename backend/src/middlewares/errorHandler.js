export const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === "23505") {
    return res.status(409).json({
      status: "error",
      message: "Dados já cadastrados (Email ou ID duplicado).",
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Erro interno do servidor";

  res.status(statusCode).json({
    status: "error",
    message: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
