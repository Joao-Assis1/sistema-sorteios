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
      const { email, nome, status } = req.body;

      // 3. Processar pagamento confirmado
      if (status === "paid") {
        await subscriptionService.handlePaymentSuccess({
          email,
          nome,
        });
        return res
          .status(200)
          .json({ status: "success", message: "Payment processed" });
      }

      // 4. Processar cancelamentos (canceled, refunded, chargeback)
      if (["canceled", "refunded", "chargeback"].includes(status)) {
        await subscriptionService.deactivateUser(email);
        console.log(`User ${email} deactivated due to status: ${status}`);
        return res
          .status(200)
          .json({ status: "success", message: "User deactivated" });
      }

      // 5. Qualquer outro status: apenas logar e retornar 200 OK
      console.log(`Webhook received with unhandled status: ${status}`);
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
