const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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
  res.status(201).send('Hello World 🇰🇷');
});

const server = https.createServer({
      key: fs.readFileSync(__dirname + "/key.pem"),
      cert: fs.readFileSync(__dirname + "/cert.pem"),
    }, app)
  .listen(port, () => {
    console.log(`🔥 server listen in ${port} 🔥`);
});

