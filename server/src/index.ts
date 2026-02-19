import express from 'express';

const app = express();

const port = 8080;

app.get('/', (req, res) => {
  res.send({'message': 'TypeScript + Node.js + Express!'});
});

app.get('/ping', (req, res) => {
  res.send("pong");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});