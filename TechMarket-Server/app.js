const express = require('express');
const cors = require('cors');
//const jwt = require('jsonwebtoken');
//const { authToken } = require('./middleware/token');
//const db = require('./db/connection');

const controllers = require("./controller");
const boardcontroller = require("./controller/boardcontroller")
require("./models");



const app = express();
app.use(express.json());
const port = 8080;


app.use(
  cors({
    origin: true,
    credentials: true
  })
);


app.post("/user/login", controllers.logInController);
app.post("/user/signup", controllers.signUpController);
app.post("/user/signout", controllers.signOutController);

app.post("/mypage/upload", boardcontroller.uploadController);
app.post("/mypage/deletecontent", boardcontroller.deleteController);


app.get('/', (req, res) => {
  res.status(201).send('Hello World');
});

app.listen(port, () => {
  console.log(`서버가 ${port}번에서 작동중입니다.`);
});

//06.10 ec2 - rds 연결확인
