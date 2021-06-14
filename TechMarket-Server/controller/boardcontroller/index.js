const { board } = require("../../models"); 
const { comment } = require("../../models")

//const jwt = require('jsonwebtoken'); //토큰 관련
//const refreshToken = jwt.sign({}, process.env.REFRESH_SECRET, { expiresIn: '14d', issuer: 'cotak' }); //토큰관련


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

      if(boardcontent){
        //여기서 조건문으로 비밀번호나 토큰과 같은 검사가 필요함.
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
    }
  },
  deleteComment: async (req, res) => {
    //댓글 지우기
    //댓글의 id를 받아와 password가 맞는지 확인하고 지운다.
    
    const commentcontent = await comment.findOne({ where : { id : req.body.id } });
    if(!commentcontent){
      res.status(500).send("잘못된 댓글 아이디/없는 아이디입니다.")
    }
    else{
      if(commentcontent.password === req.body.password){
        commentcontent.delete();
        res.status(200).send("정상적으로 댓글이 삭제되었습니다.");
      }
      else{
        res.status(304).send("비밀번호가 다릅니다.");
      }
    }
  },


};

