export interface Item {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
}

export interface Pedido {
  id: string;
  clienteId: string;
  itens: Item[];
  valorTotal: number;
  cashbackAcumulado: number;
  detalhesPromo: string[];
}