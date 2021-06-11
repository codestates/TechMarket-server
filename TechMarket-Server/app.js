const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
//const jwt = require('jsonwebtoken');
//const { authToken } = require('./middleware/token');
//const db = require('./db/connection');

const upload = multer({ dest: 'uploadedFiles/'});

const controllers = require("./controller");
const boardcontroller = require("./controller/boardcontroller")
const imagecontroller = require("./controller/imagecontroller")
const searchcontroller = require("./controller/searchcontroller")

require("./models");



const app = express();
app.use(express.json());
const port = 8080;

app.set('view engine', 'ejs');

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

//게시글 관련
//app.post("/mypage/upload", boardcontroller.uploadController); //게시물 작성 아래 uploadImage에 통합
app.post("/mypage/deletecontent", boardcontroller.deleteController); //게시물 삭제 
app.post("/mypage/upload", upload.array('photos') , imagecontroller.uploadImage); //게시물 업로드(이미지 함께)

//
app.get("/search", searchcontroller.searchController ); //글 검색
app.get("/products", searchcontroller.showAllboard);    //전체 글 목록 불러오기(사진 제외)
app.get("/board", searchcontroller.showOneboard);       //게시물 하나 조회


app.get('/', (req, res) => {
  res.status(201).send('Hello World');
});

app.listen(port, () => {
  console.log(`서버가 ${port}번에서 작동중입니다.`);
});

//06.10 ec2 - rds 연결확인
//0611 파일 업로드 확인
//0611 검색기능 완료
//0611 전체 글 목록 시작
//0611 전체 글목록 , 글 하나 조회 완료