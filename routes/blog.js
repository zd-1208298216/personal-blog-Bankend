const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const User = require('../models/user');
const Blog = require('../models/blog');
const Collection = require('../models/collection');
const { respondMsg } = require('../utils/response');
const { LABELS } = require('../consts/const');
const router = express.Router();

//新增博客
router.post('/addBlog', (req, res) => {
    let obj = req.body;
    let userID = mongoose.Types.ObjectId(obj.userID);
    //是否有此用户
    User.findOne({_id: userID})
        .then(user => {
            //存在此用户
            if(user) {
                Blog.create({
                    userID: userID,
                    title: obj.title,
                    content: obj.content,
                    kind: obj.kind,
                    labels: obj.labels,
                }).then(resObj => {
                    respondMsg(res, 0, '成功添加博客');
                }).catch(err => {
                    respondMsg(res, 1, '查询失败');
                    console.log(err);
                })
            }
            else {
                respondMsg(res, 1, '此用户不存在');
            }
        }).catch(err => {
            respondMsg(res, 1, '查询失败');
            console.log(err);
            return;
        })
})

//修改博客
router.post('/updateBlog', (req, res) => {
    let obj = req.body;
    let userID = mongoose.Types.ObjectId(obj.userID);
    //是否有此用户
    User.findOne({_id: userID})
        .then(user => {
            //存在此用户
            if(user) {
                Blog.updateOne({
                    userID: userID,
                    title: obj.title,
                    content: obj.content,
                    kind: obj.kind,
                    labels: obj.labels,
                }).then(resObj => {
                    respondMsg(res, 0, '成功修改博客');
                }).catch(err => {
                    respondMsg(res, 1, '修改失败');
                    console.log(err);
                })
            }
            else {
                respondMsg(res, 1, '此用户不存在');
            }
        }).catch(err => {
            respondMsg(res, 1, '修改失败');
            console.log(err);
            return;
        })
})

//删除博客
router.post('/removeBlog', (req, res) => {
    let obj = req.body;
    let userID = mongoose.Types.ObjectId(obj.userID);
    //是否有此用户
    User.findOne({_id: userID})
        .then(user => {
            //存在此用户
            if(user) {
                Blog.deleteOne({
                    userID: userID,
                    title: obj.title,
                    content: obj.content,
                    kind: obj.kind,
                    labels: obj.labels,
                }).then(resObj => {
                    respondMsg(res, 0, '成功删除博客');
                }).catch(err => {
                    respondMsg(res, 1, '删除失败');
                    console.log(err);
                })
            }
            else {
                respondMsg(res, 1, '此用户不存在');
            }
        }).catch(err => {
            respondMsg(res, 1, '删除失败');
            console.log(err);
            return;
        })
})

//获取用户的所有博客
router.post('/getBlogs', (req, res) => {
    let obj = req.body;
    let userID = mongoose.Types.ObjectId(obj.userID);
    User.findOne({_id: userID})
        .then(user => {
            if(user) {
                Blog.find({userID: userID}).sort({updated: 1})
                    .then(blogs => {
                        let data = [];
                        blogs.forEach(item => {
                            data.push({
                                blogID: item._id,
                                title: item.title,
                                content: item.content,
                                kind: item.kind,
                                labels: item.labels,
                                created: moment(item.created).format('YYYY-MM-DD HH:mm'),
                                updated: moment(item.updated).format('YYYY-MM-DD HH:mm')
                            })
                        });
                        respondMsg(res, 0, '查询成功', data);
                    })
            }
            else {
                respondMsg(res, 1, '此用户不存在');
            }
        }).catch(err => {
            respondMsg(res, 1, '查询失败');
            console.log(err);
        })
})

//获取所有用户的所有博客
router.get('/getAllBlogs', (req, res) => {
    Blog.find({}).then(blogs => {
        let data = [];
        blogs.forEach(item => {
            data.push({
                blogID: item._id,
                title: item.title,
                content: item.content,
                kind: item.kind,
                labels: item.labels,
                created: moment(item.created).format('YYYY-MM-DD HH:mm'),
                updated: moment(item.updated).format('YYYY-MM-DD HH:mm')
            })
        });
        respondMsg(res, 0, '查询成功', data);
    }).catch(err => {
        respondMsg(res, 1, '查询失败');
        console.log(err);
        return;
    })
})

//获取拥有某标签的所有博客
router.get('/getBlogsByLabel', (req, res) => {
    let obj = req.query;
    if(!obj.label) {
        respondMsg(res, 1, '未传递label');
        return;
    }
    Blog.find({labels: obj.label})
        .then(blogs => {
            let data = [];
            blogs.forEach(item => {
                data.push({
                    blogID: item._id,
                    title: item.title,
                    content: item.content,
                    kind: item.kind,
                    labels: item.labels,
                    created: moment(item.created).format('YYYY-MM-DD HH:mm'),
                    updated: moment(item.updated).format('YYYY-MM-DD HH:mm')
                })
            });
            respondMsg(res, 0, '查询成功', data);
        }).catch(err => {
            respondMsg(res, 1, '查询失败');
            console.log(err);
            return;
        })
})

//获取所有标签和对应博客个数
router.get('/getAllLabels', (req, res) => {
    let data = [];
    for(let i = 0; i < LABELS.length; i++){
        Blog.find({labels: LABELS[i]})
            .then(blogs => {
                let num = 0;
                blogs.forEach(item => {
                    num++;
                });
                data.push({
                    name: LABELS[i],
                    num: num
                });
                if(i == LABELS.length - 1) {
                    respondMsg(res, 0, '查询成功', data);
                }
            }).catch(err => {
                respondMsg(res, 1, '查询失败');
                console.log(err);
                return;
            });
    }
    
})

//获取某类型的所有博客
router.get('/getBlogsByKind', (req, res) => {
    let obj = req.query;
    if(!obj.kind) {
        respondMsg(res, 1, '未传递kind');
        return;
    }
    Blog.find({kind: obj.kind})
        .then(blogs => {
            let data = [];
            blogs.forEach(item => {
                data.push({
                blogID: item._id,
                title: item.title,
                content: item.content,
                kind: item.kind,
                labels: item.labels,
                created: moment(item.created).format('YYYY-MM-DD HH:mm'),
                updated: moment(item.updated).format('YYYY-MM-DD HH:mm')
                })
            })
            respondMsg(res, 0, '查询成功', data);
        }).catch(err => {
            respondMsg(res, 1, '查询失败');
            console.log(err);
            return;
        })
});

//获取某博客所有信息
router.get('/getBlog', (req, res) => {
    let obj = req.query;
    if(!obj.id) {
        respondMsg(res, 1, '未传递id');
        return;
    }
    Blog.findOne({_id: mongoose.Types.ObjectId(obj.id)})
        .then(blog => {
            respondMsg(res, 0, '查询成功', {
                blogID: blog._id,
                title: blog.title,
                content: blog.content,
                kind: blog.kind,
                labels: blog.labels,
                created: moment(blog.created).format('YYYY-MM-DD HH:mm'),
                updated: moment(blog.updated).format('YYYY-MM-DD HH:mm')
            });
        }).catch(err => {
            respondMsg(res, 1, '查询失败');
            console.log(err);
            return;
        })
})

//搜索 
router.get('/search', (req, res) => {
    let obj = req.query;
    Blog.find({content: {$regex: obj.content}})
        .then(blogs => {
            let data = [];
            blogs.forEach(item => {
                data.push({
                blogID: item._id,
                title: item.title,
                content: item.content,
                kind: item.kind,
                labels: item.labels,
                created: moment(item.created).format('YYYY-MM-DD HH:mm'),
                updated: moment(item.updated).format('YYYY-MM-DD HH:mm')
                })
            })
            respondMsg(res, 0, '查询成功', data);
        }).catch(err => {
            respondMsg(res, 1, '查询失败');
            console.log(err);
            return;
        });
})

//获取所有收藏过的题目
router.post('/getCollectedBlogs', (req, res) => {
    let obj = req.body;
    Blog.find({userID: obj.userID})
        .then(blogs => {
            let data = [];
            blogs.forEach((blog, index) => {
                Collection.findOne({userID: obj.userID, blogID: blog._id})
                    .then(collection => {
                        if(collection) {
                            data.push({
                                blogID: blog._id,
                                title: blog.title,
                                content: blog.content,
                                kind: blog.kind,
                                labels: blog.labels,
                                created: moment(blog.created).format('YYYY-MM-DD HH:mm'),
                                updated: moment(blog.updated).format('YYYY-MM-DD HH:mm')
                            });
                        }
                        if(index == blogs.length - 1) {
                            respondMsg(res, 0, '查询成功', data);
                            return;
                        }
                    }).catch(err => {
                        respondMsg(res, 1, '查询失败');
                        console.log(err);
                        return;
                    });
            });
            
        }).catch(err => {
            respondMsg(res, 1, '查询失败');
            console.log(err);
            return;
        });
})

module.exports = router;