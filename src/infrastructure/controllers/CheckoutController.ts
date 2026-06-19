import { Request, Response } from 'express';
import { DescontoProgressivoRule, CashbackProgressivoRule } from '../../core/rules/PromoChain';
import { Pedido } from '../../core/entities/Pedido';
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
      let pedido: Pedido = req.body;

      // -------------------------------------------------------------------
      // CÁLCULO AUTOMÁTICO (E SEGURANÇA):
      // Ignora o valorTotal enviado pelo cliente e recalcula baseado nos itens
      // -------------------------------------------------------------------
      const totalCalculado = pedido.itens.reduce((acumulador, item) => {
        return acumulador + (item.preco * item.quantidade);
      }, 0);
      
      pedido.valorTotal = Number(totalCalculado.toFixed(2));
      
      pedido.cashbackAcumulado = pedido.cashbackAcumulado || 0;
      pedido.detalhesPromo = pedido.detalhesPromo || [];

      logger.info({ message: "Iniciando processamento", payloadInicial: pedido });

      const regras = [new DescontoProgressivoRule(), new CashbackProgressivoRule()];
      for (const regra of regras) {
        pedido = regra.apply(pedido);
      }

      logger.info({ message: "Sucesso", payloadFinal: pedido });
      res.status(200).json(pedido);
    } catch (error: any) {
      logger.error({ message: "Erro", error: error.message });
      res.status(500).json({ error: "Erro interno" });
    }
  }
}