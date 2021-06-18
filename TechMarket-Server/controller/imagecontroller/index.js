const fs = require('fs');
const { user } = require("../../models")
const { board } = require("../../models"); 
const { photo } = require("../../models")

module.exports = {
  uploadImage: async (req, res) => {
    var dir = './uploadedFiles'
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    if(req.body.writerid){
      const userinfo = await user.findOne({
        where: {
          username : req.body.writerid
        }
      })
      const newContent = await board.create({ writerid: req.body.writerid, category : req.body.category, title: req.body.title, content : req.body.content,
      registday : req.body.registday, hit : 0, email : userinfo.email });
      if(req.files){
        for(let i = 0; i<req.files.length; i++){
          let tempimage = await photo.create({ boardid: newContent.id, imagename : req.files[i].originalname, filepath : req.files[i].path});
          console.log(tempimage);
        }
        res.status(201).send("게시글과 이미지 저장 완료")
      }
      else{
        console.log("이미지가 없습니다.(게시글은 저장)")
        res.status(201).send(newContent)
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
  },
};

