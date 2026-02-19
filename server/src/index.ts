import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes  from './modules/users/users.route';
import ordersRouter from './modules/orders/orders.route';
import customersRouter from './modules/customers/customers.route';


dotenv.config();

const app = express();
app.use(cors());

const port = 8080;
app.use(express.json());

app.get('/', (req, res) => {
  res.send({'message': 'TypeScript + Node.js + Express!'});
});

app.get('/ping', (req, res) => {
  res.send("pong");
});

// Orders Routes
app.use('/api/orders', ordersRouter);

// Customers Routes
app.use('/api/customers', customersRouter);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});