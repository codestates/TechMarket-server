const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploadedFiles/'});
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const https = require('https');
const http = require('http');
const controllers = require("./controller");
const boardcontroller = require("./controller/boardcontroller")
const imagecontroller = require("./controller/imagecontroller")
const searchcontroller = require("./controller/searchcontroller")
require("./models");
const app = express();

app.use(express.json());
const port = 80;
app.use(express.static('uploadedFiles'));
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.post("/user/login", controllers.logInController);
app.post("/user/signup", controllers.signUpController);
app.post("/user/signout", controllers.signOutController);
app.post("/user/modify", controllers.updateUserinfo);
app.post("/user/deal", controllers.dealController);

app.post("/mypage/deletecontent", boardcontroller.deleteController);
app.post("/mypage/upload", upload.array('photos') , imagecontroller.uploadImage);
app.post("/comment/create", boardcontroller.createComment);
app.post("/comment/delete", boardcontroller.deleteComment);

//
app.get("/search", searchcontroller.searchController );
app.get("/products", searchcontroller.showAllboard);
app.get("/board", searchcontroller.showOneboard);
app.get("/email", searchcontroller.emailSearch );
app.get("/category", searchcontroller.categorySearch );
app.get("/user/info", controllers.userInfoController);

app.get('/', (req, res) => {
  res.status(201).send('Hello World 🇰🇷');
});
app.listen(port, () => {
  console.log(`서버가 ${port}번에서 작동중입니다.`);
});