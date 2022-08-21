const express = require('express');
const bodyParser = require('body-parser');
const db = require('./utils/dbcon')
const user = require('./routes/user')
const blog = require('./routes/blog');
const comment = require('./routes/comment');
const collection = require('./routes/collection');
const app = express();

app.use(bodyParser.json({limit: '1mb'}));//解析json数据格式
app.use(bodyParser.urlencoded({limit: '1mb', extended: true}));//解析表单数据

//连接数据库
db.connect();

//设置跨域访问
app.all('*', (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Access-Token");
    res.setHeader("Access-Control-Expose-Headers", "*");

    if (req.method == "OPTIONS") {
        res.sendStatus(200);
        return;
    }
    next();
})


//挂载路由
app.use('/user', user);
app.use('/blog', blog);
app.use('/comment', comment);
app.use('/collection', collection);

app.listen(3000, () => {
    console.log('服务器运行在localhost:3000');
})

// const httpServer = http.createServer(app);

// httpServer.listen(3000, () => {
//     console.log('服务器运行在localhost:3000');
// })