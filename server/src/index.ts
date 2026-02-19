import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ordersRouter from './modules/orders/orders.route';


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



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});