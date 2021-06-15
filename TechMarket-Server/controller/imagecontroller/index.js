const multer = require('multer');
const fs = require('fs');

const { board } = require("../../models"); 
const { photo } = require("../../models")

//const jwt = require('jsonwebtoken'); //토큰 관련
//const refreshToken = jwt.sign({}, process.env.REFRESH_SECRET, { expiresIn: '14d', issuer: 'cotak' }); //토큰관련

//const upload = multer({ dest: 'uploadedFiles/', limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = {
  uploadImage: async (req, res) => {
    //사진 업로드 로직 작성
    //로그인 되어 있는지 검사 필요
    //***중요 key가 photos이어야 함.

    console.log(req.body);
    console.log(req.files);

    //디렉토리 생성
    var dir = './uploadedFiles'
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    //글 업로드 로직 작성
    //로그인 되어 있는지 검사 필요
    //registday 날짜바꾸기
    
    if(req.body.writerid){

      const newContent = await board.create({ writerid: req.body.writerid, category : req.body.category, title: req.body.title, content : req.body.content,
      registday : req.body.registday, hit : 0, email : req.body.email });
      
      /*
      let response = {  
        id: newContent.id,
        writerid: newContent.writerid,
        category: newContent.category,
        title: newContent.title,
        content: newContent.content,
        registday: newContent.registday,
        hit : newContent.hit,
        createdAt: newContent.created_time,
        updatedAt: newContent.updated_time
      }*/

      if(req.files){

        for(let i = 0; i<req.files.length; i++){
          let tempimage = await photo.create({ boardid: newContent.id, imagename : req.files[i].originalname, filepath : req.files[i].path});
          console.log(tempimage);
        }
        res.status(201).send("게시글과 이미지 저장 완료")
      }
      else{
        console.log("이미지가 없습니다.(게시글은 저장)")
        res.status(201).send("이미지가 없습니다.(게시글은 저장)")
      }
    }

    else{
      if(req.files){
        console.log("no body")
        for(let i = 0; i<req.files.length; i++){
          let tempimage = await photo.create({ boardid: '0', imagename : req.files[i].originalname, filepath : req.files[i].path});
          console.log(tempimage);
        }
        res.status(201).send("게시글이 없습니다.(이미지는 저장)")
      }
      else{
        res.status(202).send("게시글과 이미지 모두 없습니다.")
      }
    }

    //res.render('confirmation', { file: null, files:req.files} );

  },
};

