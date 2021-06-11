const multer = require('multer');
const fs = require('fs');
const { Op } = require("sequelize");

const { board } = require("../../models"); 
const { photo } = require("../../models")

//const jwt = require('jsonwebtoken'); //토큰 관련
//const refreshToken = jwt.sign({}, process.env.REFRESH_SECRET, { expiresIn: '14d', issuer: 'cotak' }); //토큰관련

//사진!!! 같이 보내야함!!!!

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
          for(let j = 0; j<filepath.length; j++){
            result[i].dataValues.filepath = filepath[j].dataValues.filepath;
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
};

