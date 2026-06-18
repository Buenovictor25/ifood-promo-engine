# iFood Promo Engine Simulator 🚀

Microserviço backend desenvolvido em **Node.js + TypeScript** focado em alta disponibilidade, resiliência e processamento de regras de negócios complexas (Promoções e Cashback).

## 🎯 Arquitetura e Padrões Implementados

Este projeto foi desenhado para simular um ambiente de alta escala, focado em resolver problemas comuns de sistemas distribuídos:

* **Idempotência:** Implementação de `x-idempotency-key` via Headers para evitar processamento duplicado (ex: cliente clica duas vezes em "Finalizar Pedido" em uma rede lenta). Evita cobranças duplas.
* **Design Pattern (Chain of Responsibility):** O motor de promoções (`PromoChain.ts`) aplica regras isoladas de forma sequencial e imutável. Isso permite plugar novas regras de negócio (ex: Frete Grátis) sem alterar o core do sistema, respeitando o princípio Open/Closed (SOLID).
* **Structured Logging para Observabilidade:** Utilização do `Winston` para gerar logs em formato JSON. Em um ambiente produtivo (Datadog/Elasticsearch), isso permite agilidade na análise de causa raiz (RCA) e monitoramento de falhas.
* **Clean Architecture:** Separação clara entre Domínio (`core/entities` e `core/rules`) e Infraestrutura (`controllers`), facilitando testes unitários e manutenção.

## 🚀 Como testar localmente

1. Clone o repositório e instale as dependências: `npm install`
2. Inicie o servidor: `npm run dev`
3. Envie um POST para `http://localhost:3000/api/checkout` contendo os headers de idempotência e o payload do carrinho.
