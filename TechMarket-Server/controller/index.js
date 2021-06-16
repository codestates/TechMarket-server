const { user } = require("../models"); //미완성 모델
const jwt = require('jsonwebtoken'); //토큰 관련
const cookieParser = require('cookie-parser')


module.exports = {

  logInController: async (req, res) => {
    //로그인 로직 작성
  try{
    const userInfo = await user.findOne({
      where: { email : req.body.email, password: req.body.password },
    });

    if (!userInfo) { //로그인 실패
      res.status(401).send("Invalid user or Wrong password");
    }

    else {

      const token = jwt.sign({
        email: userInfo.email
      }, process.env.ACCESS_SECRET, { expiresIn: '1d' });

      let response = {  
        id: userInfo.id,
        username: userInfo.username,
        email: userInfo.email,
        password: userInfo.password,
        deal_count: userInfo.deal_count,
      }
      
      res.status(200).json({ 
        response, 
        result: { 
          access_token: token,
        }
      });
    }
  } catch(err){
    res.status(500).send(err)
  }

  },
  userInfoController: async (req, res) =>{
    try{
      //토큰이 있는지 없는지 확인한다.

      let authorization = req.headers['authorization'];
      const tokenCheck = authorization.split(' ')[1];
      const data = jwt.verify(tokenCheck, process.env.ACCESS_SECRET);

      if(!req.headers['authorization']){
        res.status(404).send("your account not exsist!!!")
      }

      const userInfo = await user.findOne({
        where: { email : data.email },
      });
  
      // console.log(Date.now());
      // console.log(data.exp * 1000);
      if(data.exp * 1000 < Date.now()){
        const token = jwt.sign({
          email: userInfo.email
        }, process.env.ACCESS_SECRET, { ignoreExpiration: true });

        let response = {  
          id: userInfo.dataValues.id,
          email: userInfo.dataValues.email,
          password: userInfo.dataValues.password,
          username: userInfo.dataValues.username,
          deal_count: userInfo.dataValues.deal_count,
          createdAt: userInfo.dataValues.created_time,
          updatedAt: userInfo.dataValues.updated_time
        }
        res.status(401).json({ 
          response,
          result: { 
            access_token: token,
          }
        });
      }
      
      else{
          let response = {  
            id: userInfo.dataValues.id,
            email: userInfo.dataValues.email,
            password: userInfo.dataValues.password,
            username: userInfo.dataValues.username,
            deal_count: userInfo.dataValues.deal_count,
            createdAt: userInfo.dataValues.created_time,
            updatedAt: userInfo.dataValues.updated_time
          }
          res.status(200).json( response )
      }
      
    }

    catch(err){
      return res.status(500).send(err);
    } 
  },
  signOutController: (req, res) => {
    //로그아웃 로직 작성
    //로그인 상태검사
    try{
      res.status(200).send("See you next time!");
    }
    catch(err){
      res.status(500).send(err);
    }
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
      
      const newUser = await user.create({ 
        username: req.body.username, 
        email : req.body.email, 
        password: req.body.password, 
        deal_count : 0 
      });

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

  updateUserinfo: async (req, res) => {
    //로그인 상태 검사
    let newname = req.body.username;
    let newpassword = req.body.password;

    const userinfo = await user.findOne({ where : { email : req.body.email } });

    if(userinfo){
      await userinfo.update({ username : newname, password : newpassword });
      res.status(200).send( userinfo );
    }
    else{
      res.status(500).send("정보 업데이트 실패")
    }
    
  },
};

