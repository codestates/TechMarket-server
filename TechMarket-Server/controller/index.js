const { user } = require("../models"); //미완성 모델
const jwt = require('jsonwebtoken'); //토큰 관련
const cookieParser = require('cookie-parser')
const { Op } = require("sequelize");



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
  
      //JWT(access, refresh)를 생성
      const token = jwt.sign({
        email: userInfo.email
      }, process.env.ACCESS_SECRET, { expiresIn: '1m' });

      const refreshToken = jwt.sign({
        email: userInfo.email
      }, process.env.REFRESH_SECRET, { expiresIn: '1d' });

      //console.log(token);
      //console.log(refreshToken);

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
          access_token: token
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
      //console.log(req.cookies.tech_auth)
      //const tokenCheck = req.cookies.split(' ')[1];
      console.log(req.cookies);
      const tokenCheck = req.cookies.tech_auth;
      // let authorization = req.headers['authorization'];
      // console.log(authorization);
      if(!tokenCheck){
        res.status(404).send("your account not exsist!!!")
      }
      // if(!req.headers['authorization']){
      //   res.status(404).send("your account not exsist!!!")
      // }
      
      //let tokenCheck = req.headers.cookie.split('=')[1];
      //console.log(tokenCheck);
      //받는 값 프론트분들과 얘기하면서 정하기
      else {
        //const tokenCheck = authorization.split(' ')[1];
        const data = jwt.verify(tokenCheck, process.env.ACCESS_SECRET);
        //const data = jwt.decode(tokenCheck);
        console.log(data);

        const userInfo = await user.findOne({
          where: { email : data.email },
        });
        console.log(userInfo.dataValues);

        if(!userInfo){
          //오류 json send 특정 값으로 보낼건지? 400번대 에러로 처리를 해야할지?
          res.json({result: "토큰 값이 변경되었습니다."})
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
    }
    catch(err){
      return res.status(500).send(err);
    } 
  },
  signOutController: (req, res) => {
    //로그아웃 로직 작성
    //로그인 상태검사

    //api문서 수정  = > 굳이 로그인 여부와 상관없이 
    // 클라이언트 측에서 로그인하였을시에만 로그아웃 버튼이 보여지기때문에
    // 그냥 바로 처리하기로함.
    try{
      res.status(200).json({result: { access_token: "" }}).send("See you next time!");
    }
    catch(err){

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
    
    const userInfo = await user.findOne({
      where: {
        [Op.or] : [
          {
            email: req.body.email
          },
          {
            username : req.body.username
          }
        ]
      }
    });

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
  dealController: async (req, res ) => {  //거래횟수
    try {
      const userInfo = await user.findOne({
        where: { username : req.body.writerid },
      });
      const deal_count = userInfo.deal_count;
      let update_deal_count = Number(deal_count)
      update_deal_count++;

      const updateUserInfo = await user.update({
        deal_count : update_deal_count
      },{
        where : {username: req.body.writerid}
      })
      res.status(200).send(updateUserInfo)
    } catch(err){
      res.status(500).send(err)
  }
  },
};

