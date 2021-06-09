const express = require('express');
const cors = require('cors');
//const jwt = require('jsonwebtoken');
//const { authToken } = require('./middleware/token');
//const db = require('./db/connection');

const app = express();
app.use(express.json());
const port = 80;

//테스트용 주석

app.use(
  cors({
    origin: true,
    credentials: true
  })
);


app.get('/', (req, res) => {
  res.status(201).send('Hello World');
});

app.listen(port, () => {
  console.log(`서버가 ${port}번에서 작동중입니다.`);
});
