import express from "express";
import apiRoutes from "./routes/api.routes.js";
import drawRoutes from "./routes/drawRoutes.js";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1", apiRoutes);
app.use("/admin", drawRoutes);

// 404 Handler
app.use((req, res, next) => {
  const error = new Error("Endpoint não encontrado");
  error.statusCode = 404;
  next(error);
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
