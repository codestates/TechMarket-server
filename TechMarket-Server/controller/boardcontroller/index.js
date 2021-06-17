const { board } = require("../../models"); 
const { comment } = require("../../models")
const { photo } = require("../../models")

const fs = require('fs');


module.exports = {
  uploadController: async (req, res) => {
    //글 업로드 로직 작성
    //로그인 되어 있는지 검사 필요
    //registday 날짜바꾸기
    
    if(req.body){

      const newContent = await board.create({ writerid: req.body.writerid, category : req.body.category, title: req.body.title, content : req.body.content,
      registday : req.body.registday, hit : 0 });
      
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
      }
      res.status(201).json( response );
    }
    else{
      res.status(500).send( "err" );
    }
  },
  deleteController: async (req, res) => {
    //글 삭제하는 로직 작성
    //로그인후 writerid가 맞다면 삭제가능
    //글 번호으로 db에서 글을 찾아 삭제합니다.
    if(req.body.id){
      const boardcontent = await board.findOne({
        where: { id : req.body.id },
      });
      const photocontent = await photo.findAll({
        where: { boardid : id }
      })
      const commentcontent = await comment.findAll({
        where : { boardid : id }
      })

      if(photocontent){ //서버 컴퓨터의 사진데이터 삭제
        for(let i = 0; i<photocontent.length; i++){
          fs.unlink(`../../${photocontent[i].filepath}`)
        }
        photocontent.destroy(); //photo 데이터 베이스 삭제
      }

      if(commentcontent){
        commentcontent.destroy(); //댓글 데이터 베이스 삭제
      }

      if(boardcontent){
        boardcontent.destroy();
        res.status(200).send("삭제 완료");
      }
      else{
        res.status(403).send( "바디를 한 번 더 확인하세요" );
      }
    }
    else{
      res.status(400).send( "body에 게시물번호가 없습니다" );
    }
  },
  createComment: async (req, res) => {
    //댓글 만들기
    //req로 아이디, 작성시 비밀번호, 내용, 게시물 아이디를 받아온다.
    
    const boardcontent = await board.findOne({
      where : { id : req.body.boardid }
    })
    if(!boardcontent){
      res.status(500).send("없는 게시물입니다. 잘못된 요청")
    }

    else{
      const newComment = await comment.create({ username: req.body.username, password : req.body.password, content: req.body.content, boardid : req.body.boardid});
      res.status(200).send(newComment);
      console.log(newComment)
    }
  },

  deleteComment: async (req, res) => {
    //댓글 지우기 
    const commentcontent = await comment.findOne({ where : { id : req.body.id } });
    if(!commentcontent){
      res.status(500).send("잘못된 댓글 아이디/없는 아이디입니다.")
    }
    else{
      commentcontent.destroy();
      res.status(200).send("정상적으로 댓글이 삭제되었습니다.");
    }
  },

};

