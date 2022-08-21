const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Collection = require('../models/collection');
const { respondMsg } = require('../utils/response');

//收藏
router.post('/collect', (req, res) => {
    let obj = req.body;
    // console.log(obj)
    Collection.findOne({userID: obj.userID, blogID: obj.blogID})
        .then(collection => {
            if(collection) {
                respondMsg(res, 1, '此题已收藏');
                return;
            }
            else {
                Collection.create({userID: obj.userID, blogID: obj.blogID})
                    .then(() => {
                        respondMsg(res, 0, '成功收藏此题');
                        return;
                    }).catch(err => {
                        respondMsg(res, 1, '操作失败');
                        console.log(err);
                        return;
                    });
            }
        }).catch(err => {
            respondMsg(res, 1, '操作失败');
            console.log(err);
            return;
        });
});

//取消收藏
router.post('/cancelCollection', (req, res) => {
    let obj = req.body;
    Collection.findOne({userID: obj.userID, blogID: obj.blogID})
        .then(collection => {
            if(!collection) {
                respondMsg(res, 1, '此题未收藏过');
                return;
            }
            else {
                Collection.deleteOne({userID: obj.userID, blogID: obj.blogID})
                    .then(() => {
                        respondMsg(res, 0, '成功取消收藏');
                        return;
                    }).catch(err => {
                        respondMsg(res, 1, '操作失败');
                        console.log(err);
                        return;
                    });
            }
        }).catch(err => {
            respondMsg(res, 1, '操作失败');
            console.log(err);
            return;
        });
});

//某题是否收藏
router.post('/isCollected', (req, res) => {
    let obj = req.body;
    Collection.findOne({userID: obj.userID, blogID: obj.blogID})
        .then(collection => {
            if(collection) {
                respondMsg(res, 0, '查询成功', {
                    isCollected: true
                });
            }
            else {
                respondMsg(res, 0, '查询成功', {
                    isCollected: false
                });
            }
        }).catch(err => {
            respondMsg(res, 1, '操作失败');
            console.log(err);
            return;
        })
})

module.exports = router;