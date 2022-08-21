const express = require('express');
const router = express.Router();
const md5 = require('md5');
const User = require('../models/user');
const { respondMsg } = require('../utils/response');
const {randomCode,sendCode}=require("../utils/getMessage");

//获取验证码
router.get("/getCode",(req,res)=>{
    let code=randomCode(6);//生成6位数字随机验证码
    sendCode("18858329701",code,function(success){
        if(success){
            respondMsg(res, 0, '验证码发送成功', {
                code: code
            });
        }else{
            res.send("短信验证码发送失败");
        }
    })
})

//判断手机号是否已经注册
router.post('/judgePhone', (req, res) => {
    let obj = req.body;
    User.findOne({phone: obj.phone})
        .then(user => {
            if(user) {
                respondMsg(res, 1, '该手机号已被注册');
            }
        })
        .catch(err => {
            respondMsg(res, 1, '注册失败');
            console.log(err);
            return;
        })
})


//用户注册
router.post('/register', (req, res) => {
    let obj = req.body;
    User.findOne({phone: obj.phone})
        .then(user => {
            if(user) {
                respondMsg(res, 1, '该手机号已被注册');
            }
            else {
                User.create({phone: obj.phone, nickname: obj.nickname, password: md5(obj.password)})
                    .then(resObj => {
                        respondMsg(res, 0, '注册成功');
                    })
                    .catch(err => {
                        respondMsg(res, 1, '注册失败');
                        console.log(err);
                    })
            }
        })
        .catch(err => {
            respondMsg(res, 1, '注册失败');
            console.log(err);
            return;
        })
})

//登录验证
router.post('/login', (req, res) => {
    let obj = req.body;
    User.findOne({phone: obj.phone})
        .then(user => {
            if(!user) {
                respondMsg(res, 1, '此手机号未注册');
            }
            else {
                if(md5(obj.password) == user.password) {
                    respondMsg(res, 0, '登陆成功');
                }
                else {
                    respondMsg(res, 1, '密码错误');
                }
            }
        })
        .catch(err => {
            respondMsg(res, 1, '查询失败');
            console.log(err);
            return;
        })
})

//获取用户信息
router.get('/getUserInfo', (req, res) => {
    let obj = req.query;
    User.findOne({phone: obj.phone})
        .then(user => {
            if(user) {
                respondMsg(res, 0, '查询成功', {
                    userID: user._id,
                    phone: user.phone,
                    nickname: user.nickname,
                    avatarUrl: user.avatarUrl
                });
            }
            else {
                respondMsg(res, 1, '用户不存在');
            }
        })
        .catch(err => {
            respondMsg(res, 1, '查询失败');
            console.log(err);
            return;
        })
})

// 更新用户头像昵称
router.post('/saveUserInfo', (req, res) => {
    let obj = req.body;
    User.findOne({phone: obj.phone})
        .then(user => {
            if(user) {
                User.updateOne({phone: obj.phone}, {
                    avatarUrl: obj.avatarUrl,
                    nickname: obj.nickname
                }).then(resObj => {
                    respondMsg(res, 0, '更新成功');
                }).catch(err => {
                    respondMsg(res, 1, '查询失败');
                    console.log(err);
                })
            }
            else {
                respondMsg(res, 1, '用户不存在');
            }
        })
        .catch(err => {
            respondMsg(res, 1, '查询失败');
            console.log(err);
            return;
        })
})




module.exports = router;