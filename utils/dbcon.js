const mongoose = require('mongoose');

const dbUrl = 'mongodb://127.0.0.1/blog';


module.exports.connect = () => {
    mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true}) 
    .then(() => console.log('数据库连接成功'))
    .catch(err => console.log('数据库连接失败' + err))
}
