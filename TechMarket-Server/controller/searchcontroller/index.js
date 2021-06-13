const multer = require('multer');
const fs = require('fs');
const { Op } = require("sequelize");

const { board } = require("../../models"); 
const { photo } = require("../../models")

//const jwt = require('jsonwebtoken'); //토큰 관련
//const refreshToken = jwt.sign({}, process.env.REFRESH_SECRET, { expiresIn: '14d', issuer: 'cotak' }); //토큰관련

module.exports = {
  searchController: async (req, res) => {

    //검색 로직 작성
    
    //검색어를 받아와 제목에서 검색.
    console.log("검색어");
    console.log(req.body);
    //body의 search_word로 온다.

    const word = req.body.search_word;

    let result = await board.findAll({
      where: {
          title: { //제목에 검색어가 포함됐나?
              [Op.like]: `%${word}%`
          },
      }
    })


    if(result.length == 0){
      res.status(200).send("검색 결과가 없거나 검색에 실패하였습니다.")
    }
    else{
      //파일 경로 붙이기
      for(let i=0; i<result.length; i++){
        let filepath = await photo.findAll({
          where: {
            boardid : result[i].id
          }
        })
        if(filepath.length === 0){
          console.log("이미지가 없습니다.")
        }
        else{
          console.log('이미지 찾는중')
          console.log(filepath);
          result[i].dataValues.filename = [];
          for(let j = 0; j<filepath.length; j++){
            result[i].dataValues.filename.push(filepath[j].dataValues.filepath.substring(14,));
            console.log(result[i]);

            
          }
        }
      }
      try {
        res.send({ //정보 넘김
            message: "검색결과",
            status: 'success',
            data: {
                word,
                result,
            }
        });
    } catch (err) { //무언가 문제가 생김
        res.send({
            message: "ERROR",
            status: 'fail'
        })
    }
    }
  },

  showAllboard: async (req, res) => {
    const allboard = await board.findAll();
    if(allboard){
      res.status(200).send(allboard);
    }
    else{
      res.status(500).send("불러오기 실패");
    }
  },
  showOneboard: async (req, res) => {
    //게시글 클릭시 조회 하는 기능
    if(req.body.id){
      const oneboard = await board.findOne({ where : { id: req.body.id } });
      if(oneboard){

        let filepath = await photo.findAll({
          where: {
            boardid : oneboard.id
          }
        })
        if(filepath.length === 0){
          console.log("이미지가 없습니다.")
        }
        else{
          console.log('이미지 찾는중')
          oneboard.dataValues.filepath = [];
          oneboard.dataValues.fileinfo = [];
          for(let j = 0; j<filepath.length; j++){
            oneboard.dataValues.filepath.push(filepath[j].dataValues.filepath);
            //console.log(allboard);

            fs.readFile(filepath[j].dataValues.filepath, function(err, data){
              oneboard.dataValues.fileinfo.push(data);
            })
          }

        res.status(200).send(oneboard);
      }
    }
      else{
        res.status(200).send("없는 게시물")
      }
    }
    else{
      res.status(500).send("게시물 조회 실패")
    }
  },
/*
  showImage: async (req, res) => {
    if(req.body.id){
      const oneboard = await board.findOne({ where : { id: req.body.id } });
      if(oneboard){

        let filepath = await photo.findAll({
          where: {
            boardid : oneboard.id
          }
        })
        if(filepath.length === 0){
          console.log("이미지가 없습니다.")
        }
        else{
          console.log('이미지 찾는중')
          oneboard.dataValues.filepath = [];
          oneboard.dataValues.fileinfo = [];
          const fileinfo = [];
          for(let j = 0; j<filepath.length; j++){
            oneboard.dataValues.filepath.push(filepath[j].dataValues.filepath);
            //console.log(allboard);

            fs.readFile(filepath[j].dataValues.filepath, function (err, data) {
              
              res.send(data);   //본문을 만들고s
            })
          }
          //res.end();
        //res.status(200).send(fileinfo);
      }
    }
      else{
        res.status(200).send("없는 게시물")
      }
    }
    else{
      res.status(500).send("게시물 조회 실패")
    }
  },
  */ //완전 개편

};

