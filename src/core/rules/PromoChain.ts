import { Pedido } from '../entities/Pedido';

export interface PromoRule {
  apply(pedido: Pedido): Pedido;
}

export class DescontoProgressivoRule implements PromoRule {
  apply(pedido: Pedido): Pedido {
    const novoPedido = { ...pedido, detalhesPromo: [...(pedido.detalhesPromo || [])] };
    if (novoPedido.valorTotal >= 100) {
      const desconto = novoPedido.valorTotal * 0.10;
      novoPedido.valorTotal -= desconto;
      novoPedido.detalhesPromo.push(`Aplicado 10% de Desconto: -R$ ${desconto.toFixed(2)}`);
    }
    return novoPedido;
  }
}

export class CashbackProgressivoRule implements PromoRule {
  apply(pedido: Pedido): Pedido {
    const novoPedido = { ...pedido, detalhesPromo: [...(pedido.detalhesPromo || [])] };
    novoPedido.cashbackAcumulado = novoPedido.cashbackAcumulado || 0;
    if (novoPedido.valorTotal >= 50) {
      const cashback = novoPedido.valorTotal * 0.05;
      novoPedido.cashbackAcumulado += cashback;
      novoPedido.detalhesPromo.push(`Gerado 5% de Cashback: +R$ ${cashback.toFixed(2)}`);
    }
    return novoPedido;
  }
}