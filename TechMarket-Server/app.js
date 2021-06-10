const express = require('express');
const cors = require('cors');
//const jwt = require('jsonwebtoken');
//const { authToken } = require('./middleware/token');
//const db = require('./db/connection');

const controllers = require("./controller");
require("./models");



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
app.post("/user/signup", controllers.signUpController);
app.post("/user/signout", controllers.signOutController);


app.get('/', (req, res) => {
  res.status(201).send('Hello World');
});

app.listen(port, () => {
  console.log(`서버가 ${port}번에서 작동중입니다.`);
});

//06.10 ec2 - rds 연결확인
