import { Pedido } from '../entities/Pedido';

export interface PromoRule {
  apply(pedido: Pedido): Pedido;
}

export class DescontoProgressivoRule implements PromoRule {
  apply(pedido: Pedido): Pedido {
    const novoPedido = { ...pedido, detalhesPromo: [...(pedido.detalhesPromo || [])] };
    if (novoPedido.valorTotal >= 100) {
      // Calcula o desconto e trava em 2 casas decimais
      const desconto = Number((novoPedido.valorTotal * 0.10).toFixed(2));
      novoPedido.valorTotal = Number((novoPedido.valorTotal - desconto).toFixed(2));
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
      // Calcula o cashback e trava em 2 casas decimais
      const cashback = Number((novoPedido.valorTotal * 0.05).toFixed(2));
      novoPedido.cashbackAcumulado = Number((novoPedido.cashbackAcumulado + cashback).toFixed(2));
      novoPedido.detalhesPromo.push(`Gerado 5% de Cashback: +R$ ${cashback.toFixed(2)}`);
    }
    return novoPedido;
  }
}