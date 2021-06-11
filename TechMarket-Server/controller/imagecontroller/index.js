const multer = require('multer');
const fs = require('fs');

//const { board } = require("../../models"); 

//const jwt = require('jsonwebtoken'); //토큰 관련
//const refreshToken = jwt.sign({}, process.env.REFRESH_SECRET, { expiresIn: '14d', issuer: 'cotak' }); //토큰관련

//const upload = multer({ dest: 'uploadedFiles/', limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = {
  uploadImage: async (req, res) => {
    //사진 업로드 로직 작성
    //로그인 되어 있는지 검사 필요
    var dir = './uploadedFiles'
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    console.log(req.file);
    res.render('confirmation', { file: null, files:req.files} );

  },
};

