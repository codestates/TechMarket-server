const { user } = require("../models");
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

module.exports = {
  logInController: async (req, res) => {
  try{
    const userInfo = await user.findOne({
      where: { email : req.body.email, password: req.body.password },
    });
    if (!userInfo) {
      res.status(401).send("Invalid user or Wrong password");
    }
    else {
      const token = jwt.sign({
        email: userInfo.email
      }, process.env.ACCESS_SECRET, { expiresIn: '1m' });
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
  userInfoController: async (req, res) => {
    try{
      let authorization = req.headers['authorization'];
      const tokenCheck = authorization.split(' ')[1];
      const data = jwt.verify(tokenCheck, process.env.ACCESS_SECRET, {ignoreExpiration: true});
      if(!req.headers['authorization']){
        res.status(404).send("your account not exsist!!!")
      }
      const userInfo = await user.findOne({
        where: { email : data.email },
      });
      if(data.exp * 1000 < Date.now()){
        const token = jwt.sign({
          email: userInfo.email
        }, process.env.ACCESS_SECRET, { expiresIn: '1m' });
        let response = {  
          id: userInfo.dataValues.id,
          email: userInfo.dataValues.email,
          password: userInfo.dataValues.password,
          username: userInfo.dataValues.username,
          deal_count: userInfo.dataValues.deal_count,
          createdAt: userInfo.dataValues.created_time,
          updatedAt: userInfo.dataValues.updated_time
        }
        res.status(200).json({ 
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
    try{
      res.status(200).send("See you next time!");
    }
    catch(err){
    }
  },
  signUpController: async (req, res) => {
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
    if(userInfo === null){
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
    else{
      res.status(409).send('your account already exist');
    }
  },
  updateUserinfo: async (req, res) => {
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
  dealController: async (req, res ) => {
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

