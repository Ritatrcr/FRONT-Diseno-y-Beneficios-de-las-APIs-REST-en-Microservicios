// src/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  rest.get('http://localhost:3000/payments', (req, res, ctx) => {
    return res(ctx.json([{ payment_id: 1, amount: 1000, description: 'Test', status: 'Aprobado' }]));
  }),
];
