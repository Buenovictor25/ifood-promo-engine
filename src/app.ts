import express from 'express';
import { CheckoutController } from './infrastructure/controllers/CheckoutController';

const app = express();
app.use(express.json());

const controller = new CheckoutController();
app.post('/api/checkout', controller.processarCheckout);

app.listen(3000, () => console.log('🚀 iFood Promo Engine rodando na porta 3000'));