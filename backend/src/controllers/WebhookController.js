import subscriptionService from "../services/subscriptionService.js";

class WebhookController {
  async handleLastlink(req, res) {
    try {
      // 1. Segurança: Verificar Secret
      const webhookSecret = req.headers["x-webhook-secret"];
      if (webhookSecret !== process.env.WEBHOOK_SECRET) {
        return res.status(403).json({ error: "Forbidden: Invalid Secret" });
      }

      // 2. Extrair dados
      const { email, lastlink_id, nome, status } = req.body;

      // 3. Processar apenas se pago
      if (status === "paid") {
        await subscriptionService.handlePaymentSuccess({
          email,
          lastlinkId: lastlink_id,
          nome,
        });
        return res
          .status(200)
          .json({ status: "success", message: "Processed" });
      }

      // Se não for 'paid' (ex: 'pending', 'canceled'), apenas ignoramos ou logamos
      // Retornar 200 para a Lastlink não ficar tentando reenviar
      return res
        .status(200)
        .json({ status: "ignored", message: `Status ${status} ignored` });
    } catch (error) {
      console.error("Webhook Error:", error);
      // Retornar 500 pode fazer a Lastlink retentar, o que é bom em caso de erro no banco
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new WebhookController();
