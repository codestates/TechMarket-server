const { user } = require("../models"); //미완성 모델

//const jwt = require('jsonwebtoken'); //토큰 관련
//const refreshToken = jwt.sign({}, process.env.REFRESH_SECRET, { expiresIn: '14d', issuer: 'cotak' }); //토큰관련


module.exports = {
  logInController: async (req, res) => {
    //로그인 로직 작성
    if(!user){
      res.status(401).send("오류");
    }
    if(req.body.email === undefined){
      console.log(req.body)
      res.status(401).send("이메일오류");
    }
    
      const userInfo = await user.findOne({
        where: { email : req.body.email, password: req.body.password },
      });

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
    //로그인 상태검사
    res.status(200).send("See you next time!");
  },
  signUpController: async (req, res) => {
    //회원가입 로직 및 유저 생성 로직
    //이미 가입된 회원
    /*
    if(!(req.body.name && req.body.email && req.body.password)){
      res.status(409).send('your account already exist');
    }
    */
    
    const userInfo = await user.findOne({ where: { email: req.body.email} });

    if(userInfo === null){ //생성가능
      
      const newUser = await user.create({ username: req.body.username, email : req.body.email, password: req.body.password, deal_count : 0 });
      let response = {  
        id: newUser.id,
        email: newUser.email,
        password: newUser.password,
        username: newUser.username,
        deal_count: newUser.deal_count,
        createdAt: newUser.created_time,
        updatedAt: newUser.updated_time
      }
      res.status(201).json( response );

    }
    else{ //생성불가능
      res.status(409).send('your account already exist');
    }
  },
};

