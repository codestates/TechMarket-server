const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const https = require('https');
const fs = require('fs');
//const { authToken } = require('./middleware/token');
//const db = require('./db/connection');
const bodyParser = require("body-parser");
const controllers = require("./controller");
require("./models");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
const port = 80;

app.use(
  cors({
    origin: true,
    credentials: true
  })
);


app.get("/user/info", controllers.userInfoController)
app.post("/user/login", controllers.logInController);
app.post("/user/signup", controllers.signUpController);
app.post("/user/signout", controllers.signOutController);


app.get('/', (req, res) => {
  res.status(201).send('Hello World 🇰🇷');
});


app.listen(port, ()=>{
  console.log(`🔥 server listen in ${port} 🔥`);
})
//이걸로도 https 프로토콜 전송이 안되면 다시 변경
/*
let server;

if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
  server = https.createServer(
      {
        key: fs.readFileSync(__dirname + `/` + 'key.pem', 'utf-8'),
        cert: fs.readFileSync(__dirname + `/` + 'cert.pem', 'utf-8'),
      },
      app
    )
    .listen(port);
} else {
  server = app.listen(port, ()=>{
    console.log(`🔥 server listen in ${port} 🔥`);
  })
}
*/
