const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: 'uploadedFiles/'});

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const https = require('https');
const http = require('http');
//const { authToken } = require('./middleware/token');
//const db = require('./db/connection');

const controllers = require("./controller");
const boardcontroller = require("./controller/boardcontroller")
const imagecontroller = require("./controller/imagecontroller")
const searchcontroller = require("./controller/searchcontroller")

require("./models");

const app = express();
app.use(express.json());
const port = 8080;

app.set('view engine', 'ejs');

app.use(express.static('uploadedFiles'));
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

//유저 정보 관련 - 토큰인증후 보완해야 함
app.post("/user/login", controllers.logInController);     //로그인
app.post("/user/signup", controllers.signUpController);   //회원가입
app.post("/user/signout", controllers.signOutController); //로그아웃. 이름 바꾸는 것도 고려
app.post("/user/modify", controllers.updateUserinfo);     //회원 정보 수정
app.post("/user/deal", controllers.dealController);     //거래횟수 증가 

//게시글 관련
//app.post("/mypage/upload", boardcontroller.uploadController); //게시물 작성 아래 uploadImage에 통합
app.post("/mypage/deletecontent", boardcontroller.deleteController); //게시물 삭제 
app.post("/mypage/upload", upload.array('photos') , imagecontroller.uploadImage); //게시물 업로드(이미지 함께)
app.post("/comment/create", boardcontroller.createComment);    //댓글 작성하기
app.post("/comment/delete", boardcontroller.deleteComment);    //댓글 삭제하기


app.get("/search", searchcontroller.searchController ); //글 검색
app.get("/products", searchcontroller.showAllboard);    //전체 글 목록 불러오기(사진 제외)
app.get("/board", searchcontroller.showOneboard);       //게시물 하나 조회
app.get("/email", searchcontroller.emailSearch ); //이메일로 글 검색
app.get("/category", searchcontroller.categorySearch ); //이메일로 글 검색


app.get("/user/info", controllers.userInfoController);

app.get('/', (req, res) => {
  res.status(201).send('Hello World 🇰🇷');
});

app.listen(port, () => {
  console.log(`서버가 ${port}번에서 작동중입니다.`);
});