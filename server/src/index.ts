import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes  from './modules/users/users.route';
<<<<<<< HEAD
import ordersRouter from './modules/orders/orders.route';
import customersRouter from './modules/customers/customers.route';

import productRoutes from './modules/products/products.route';
import categoryRoutes from './modules/category/category.route';
=======
import authRoutes from './modules/auth/auth.route';
>>>>>>> 30a903bcc0186c212a45ecc9f4bacb549a93c489

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
app.use('/api/users', userRoutes);
<<<<<<< HEAD
app.use('/api/products', productRoutes);
app.use('/api/category', categoryRoutes);
=======
app.use('/api/auth', authRoutes);
>>>>>>> 30a903bcc0186c212a45ecc9f4bacb549a93c489


// Customers Routes
app.use('/api/customers', customersRouter);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});