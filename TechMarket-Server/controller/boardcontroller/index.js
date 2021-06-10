const { board } = require("../../models"); 

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
    //글 제목으로 db에서 글을 찾아 삭제합니다.
    //글 번호를 이용하는 방법 고려.
    if(req.body.writerid){
      const boardcontent = await board.findOne({
        where: { writerid : req.body.writerid, title: req.body.title },
      });

      if(boardcontent){
        boardcontent.destroy();
        res.status(200).send("삭제 완료");
      }
      else{
        res.status(500).send( "바디를 한 번 더 확인하세요" );
      }
    }
    else{
      res.status(500).send( "body에 writerid가 없습니다" );
    }
  }
};

