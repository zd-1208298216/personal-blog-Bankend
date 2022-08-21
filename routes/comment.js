const express = require('express');
const moment = require('moment');
const Comment = require('../models/comment');
const { respondMsg } = require('../utils/response')
const router = express.Router();

router.post('/saveComment', (req, res) => { 
    let obj = req.body;
    
    Comment.create({
        nickname: obj.nickname.length == 0? '路人': obj.nickname,
        email: obj.email,
        content: obj.content,
    }).then(() => {
        respondMsg(res, 0, '发表成功');
    }).catch(err => {
        respondMsg(res, 1, '操作失败');
        console.log(err);
        return;
    })
});

router.get('/getComments', (req, res) => {
    Comment.find({}).then(comments => {
        let data = [];
        comments.forEach(item => {
            data.push({
                nickname: item.nickname,
                content: item.content,
                createTime: moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
            });
        })
        respondMsg(res, 0, '查询成功', data);
    }).catch(err => {
        respondMsg(res, 1, '查询失败');
        console.log(err);
        return;
    })
})

module.exports = router;