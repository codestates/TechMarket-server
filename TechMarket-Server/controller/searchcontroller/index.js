const multer = require('multer');
const { Op } = require("sequelize");

const { board } = require("../../models"); 
const { photo } = require("../../models")

module.exports = {
  searchController: async (req, res) => {
    //검색 로직 작성
    //검색어를 받아와 제목에서 검색.
    console.log("검색어");
    //body의 search_word로 온다.
    const word = req.query.search_word;
    let result = await board.findAll({
      where: {
        [Op.or] : [
          {
            title: { //제목에 검색어가 포함됐나?
              [Op.like]: `%${word}%`
            }
          },
          {
            content : { //내용에도 검색어가 포함 되었는지
              [Op.like]: `%${word}%`
            }
          }
        ]
      }
    })

    if(result.length == 0){
      res.status(200).send("검색 결과가 없거나 검색에 실패하였습니다.")
    }
    else{
      //파일 이름 붙이기
      for(let i=0; i<result.length; i++){
        let filepath = await photo.findAll({ //filepath = 게시물에 해당하는 이미지들
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
          result[i].dataValues.thumbnail = filepath[0].dataValues.filepath.substring(14,); //첫 번째 사진이 썸네일
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
      //파일 이름 붙이기
      for(let i=0; i<allboard.length; i++){
        let filepath = await photo.findAll({ //filepath = 게시물에 해당하는 이미지들
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
          allboard[i].dataValues.thumbnail = filepath[0].dataValues.filepath.substring(14,); //첫 번째 사진이 썸네일
        }
      }
      try {
        res.send( allboard );
    } catch (err) { //무언가 문제가 생김
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
    //게시글 클릭시 조회 하는 기능
    if(req.query.id){
      const oneboard = await board.findOne({ where : { id: req.query.id } });
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
          oneboard.dataValues.filename = [];
          for(let j = 0; j<filepath.length; j++){
            oneboard.dataValues.filename.push(filepath[j].dataValues.filepath.substring(14,));
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
};

