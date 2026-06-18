import { Request, Response } from 'express';
import { DescontoProgressivoRule, CashbackProgressivoRule } from '../../core/rules/PromoChain';
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

const idempotencyKeys = new Set<string>();

export class CheckoutController {
  public processarCheckout = (req: Request, res: Response): void => {
    const key = req.headers['x-idempotency-key'] as string;

    if (key && idempotencyKeys.has(key)) {
      logger.warn({ message: "Requisição duplicada", idempotencyKey: key });
      res.status(409).json({ error: "Pedido já processado." });
      return;
    }
    if (key) idempotencyKeys.add(key);

    try {
      let pedido = req.body;
      logger.info({ message: "Iniciando processamento", payload: pedido });

      const regras = [new DescontoProgressivoRule(), new CashbackProgressivoRule()];
      for (const regra of regras) {
        pedido = regra.apply(pedido);
      }

      logger.info({ message: "Sucesso", payloadFinal: pedido });
      res.status(200).json(pedido);
    } catch (error) {
      res.status(500).json({ error: "Erro interno" });
    }
  }
}
