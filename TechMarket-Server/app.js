require("dotenv").config();
const express = require('express');
const cors = require('cors');
//const jwt = require('jsonwebtoken');
//const { authToken } = require('./middleware/token');
//const db = require('./db/connection');

const controllers = require("./controllers");


const app = express();
app.use(express.json());
const port = 80;


app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.post("/user/login", controllers.logInController);

app.get('/', (req, res) => {
  res.status(201).send('Hello! Welcome to Cmarket 👩🏼‍💻 🧑🏻‍💻 👨🏼‍💻 👨🏼‍💻');
});

app.listen(port, () => {
  console.log(`🌈 서버가 ${port}번에서 작동중입니다. 🌈`);
});

