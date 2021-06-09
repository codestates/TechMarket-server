const { user } = require("../models"); //미완성 모델

//const jwt = require('jsonwebtoken'); //토큰 관련
//const refreshToken = jwt.sign({}, process.env.REFRESH_SECRET, { expiresIn: '14d', issuer: 'cotak' }); //토큰관련


module.exports = {
  logInController: async (req, res) => {
    //로그인 로직 작성
    // if(!user){
    //   res.status(401).send("오류");
    // }
    // if(req.body.email === undefined){
    //   console.log(req.body)
    //   res.status(401).send("이메일오류");
    // }
    
      const userInfo = await user.findOne({
        where: { email : req.body.email, password: req.body.password },
      }).catch((err)=>{
        res.status(500).send(err);
      })

      if (!userInfo) { //로그인 실패
        res.status(401).send("Invalid user or Wrong password");
      }

      else {
        /*
        토큰 사용시 
        const token = jwt.sign({
        id:userInfo.id,
        userId : userInfo.userId,
        //password: Users.password,
        email : userInfo.email,
        createdAt:userInfo.createdAt,
        updatedAt:userInfo.updatedAt,
        }, process.env.ACCESS_SECRET,
        {expiresIn:"2hr"});

        res.cookie('refreshToken', refreshToken);
        res.send({ data: { accessToken: token}, message: 'ok' });
        */
        let response = {  
          id: userInfo.id,
          username: userInfo.username,
          email: userInfo.email,
          password: userInfo.password,
          deal_count: userInfo.deal_count,
          //createdAt: userInfo.created_time,
          //updatedAt: userInfo.updated_time
        }
        res.status(200).json( response );
      }
      
      
      
      //res.status(201).send("Invalid user or Wrong password");
  },
  signOutController: (req, res) => {
    //로그아웃 로직 작성
    //로그인 상태검사 = boolean 값을 주고 판단을 해야할 것인가?
    //아니면 express-session(req.session.userid)으로 판단할 것인가 상의하기 *
    // if(로그인 false일경우 or other way){
    //  res.status(400).send("You need to login first!" );
    //}
    
    res.status(200).send("See you next time!")
    .catch((err)=>{
      res.status(500).send(err);
    })  
  },
};

