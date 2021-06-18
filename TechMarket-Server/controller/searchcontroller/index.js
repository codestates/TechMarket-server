const multer = require('multer');
const { Op } = require("sequelize");
const { board } = require("../../models"); 
const { photo } = require("../../models");
const { comment } = require("../../models")

module.exports = {
  searchController: async (req, res) => {
    const word = req.query.search_word;
    let result = await board.findAll({
      where: {
        [Op.or] : [
          {
            title: {
              [Op.like]: `%${word}%`
            }
          },
          {
            content : {
              [Op.like]: `%${word}%`
            }
          }
        ]
      }
    })

    if(result.length == 0){
      res.status(202).send("검색 결과가 없거나 검색에 실패하였습니다.")
    }
    else{
      for(let i=0; i<result.length; i++){
        let filepath = await photo.findAll({
          where: {
            boardid : result[i].id
          }
        })
        if(filepath.length === 0){
          console.log("이미지가 없습니다. 기본 이미지를 썸네일로 정합니다.");
          result[i].dataValues.thumbnail = "defaultimage"
        }
        else{
          console.log('이미지 찾는중')
          result[i].dataValues.thumbnail = filepath[0].dataValues.filepath.substring(14,);
        }
      }
      try {
        res.status(200).send({
            message: "검색결과",
            status: 'success',
            data: {
                word,
                result,
            }
        });
    } catch (err) {
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
      for(let i=0; i<allboard.length; i++){
        let filepath = await photo.findAll({
          where: {
            boardid : allboard[i].id
          }
        })
        if(filepath.length === 0){
          console.log("이미지가 없습니다. 기본 이미지를 썸네일로 정합니다.");
          allboard[i].dataValues.thumbnail = "defaultimage"
        }
        else{
          console.log('이미지 찾는중')
          allboard[i].dataValues.thumbnail = filepath[0].dataValues.filepath.substring(14,);
        }
      }
      try {
        res.status(200).send( allboard );
    } catch (err) { 
        res.send({
            message: "ERROR",
            status: 'fail'
        })
    }
    }
    else{
      res.status(500).send("불러오기 실패");
    }
  },
  showOneboard: async (req, res) => {
    if(req.query.id){
      const oneboard = await board.findOne({ where : { id: req.query.id } });
      if(oneboard){

        let comments = await comment.findAll({
          where: {
            boardid : oneboard.id
          }
        })
        oneboard.dataValues.comments = [];
        if(comments.length === 0){
          console.log("댓글이 없습니다.")
        }
        else{
          for(let j = 0; j<comments.length; j++){
            oneboard.dataValues.comments.push(comments[j]);
          }
        }

        let filepath = await photo.findAll({
          where: {
            boardid : oneboard.id
          }
        })
        if(filepath.length === 0){
          console.log("이미지가 없습니다.")
          oneboard.dataValues.filename = [];
          oneboard.dataValues.filename.push("defaultimage");

          let hits = Number(oneboard.hit);
          hits+=1;
          oneboard.update({hit: String(hits) });

          res.status(200).send(oneboard);
        }
        else{
          console.log('이미지 찾는중')
          oneboard.dataValues.filename = [];
          for(let j = 0; j<filepath.length; j++){
            oneboard.dataValues.filename.push(filepath[j].dataValues.filepath.substring(14,));
          }
          let hits = Number(oneboard.hit);
          hits+=1;
          oneboard.update({hit: String(hits) });

          res.status(200).send(oneboard);
        }
    }
      else{
        res.status(400).send("없는 게시물")
      }
    }
    else{
      res.status(500).send("게시물 조회 실패")
    }
  },

  emailSearch: async (req, res) => {
    const email = req.query.email;
    let result = await board.findAll({
      where: { email : req.query.email }
    })

    if(result.length == 0){
      res.status(202).send("검색 결과가 없거나 검색에 실패하였습니다.")
    }
    else{
      for(let i=0; i<result.length; i++){
        let filepath = await photo.findAll({
          where: {
            boardid : result[i].id
          }
        })
        if(filepath.length === 0){
          console.log("이미지가 없습니다. 기본 이미지를 썸네일로 정합니다.");
          result[i].dataValues.thumbnail = "defaultimage"
        }
        else{
          console.log('이미지 찾는중')
          result[i].dataValues.thumbnail = filepath[0].dataValues.filepath.substring(14,);
        }
      }
      try {
        res.status(200).send({
            message: "검색결과",
            status: 'success',
            data: {
                email,
                result,
            }
        });
    } catch (err) {
        res.send({
            message: "ERROR",
            status: 'fail'
        })
    }
    }
  },
  categorySearch: async (req, res) => {
    const category = req.query.category;
    let result = await board.findAll({
      where: {
        category : category
      }
    })
    if(result.length == 0){
      res.status(202).send("검색 결과가 없거나 검색에 실패하였습니다.")
    }
    else{
      for(let i=0; i<result.length; i++){
        let filepath = await photo.findAll({
          where: {
            boardid : result[i].id
          }
        })
        if(filepath.length === 0){
          console.log("이미지가 없습니다. 기본 이미지를 썸네일로 정합니다.");
          result[i].dataValues.thumbnail = "defaultimage"
        }
        else{
          console.log('이미지 찾는중')
          result[i].dataValues.thumbnail = filepath[0].dataValues.filepath.substring(14,);
        }
      }
      try {
        res.status(200).send({
            message: "검색결과",
            status: 'success',
            data: {
                category,
                result,
            }
        });
    } catch (err) {
        res.send({
            message: "ERROR",
            status: 'fail'
        })
    }
    }
  },
};

