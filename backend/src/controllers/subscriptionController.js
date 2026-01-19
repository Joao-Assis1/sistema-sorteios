import subscriptionService from "../services/subscriptionService.js";

export const createSubscription = async (req, res, next) => {
  try {
    const { nome, email, telefone, lastlink_id, inicio, fim } = req.body;

    const result = await subscriptionService.registerUserWithSubscription(
      { nome, email, telefone },
      { lastlink_id, data_inicio: inicio, data_fim: fim },
    );
    res.status(201).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

export const checkStatus = async (req, res, next) => {
  try {
    const { email } = req.query;
    const status = await subscriptionService.checkParticipation(email);

    if (!status) {
      return res
        .status(404)
        .json({ status: "fail", message: "Usuário não encontrado" });
    }
    res.status(200).json({ status: "success", data: status });
  } catch (error) {
    next(error);
  }
};
