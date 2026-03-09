import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './modules/users/users.route';
import authRoutes from './modules/auth/auth.route';
import orderRoutes from './modules/orders/orders.route';
import productRoutes from './modules/products/products.route';
import customerRoutes from './modules/customers/customers.route';
import reportRoutes from './modules/reports/reports.route';

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

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reports', reportRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});