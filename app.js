const express = require('express');
const app = express();
const PORT = 80;

// 封装一个全局可用的res.cc函数
app.use((req, res, next) => {
    res.cc = (err, status = 1, args = {}) => {
        res.send({ status, message: (err.message || err), ...args })
    };
    next();
});
// 导入密钥字符串
const { jwtSecretKey } = require('./config');
// 导入解析token的插件
const expressJWT = require('express-jwt');
// 设置解析token的中间件   注意：如果express-jwt的版本为6.0  则需要设置jwt的算法为HS256  
app.use(expressJWT({ secret: jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//, /^\/uploads\//] }));
// 导入跨域中间件
const cors = require('cors');
app.use(cors());
// 设置解析POST请求数据的中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//导入用户登录注册相关接口的路由
const userRouter = require('./router/user');
app.use('/api', userRouter);
//导入用户信息相关接口的路由
const userInfoRouter = require('./router/userinfo');
app.use('/my', userInfoRouter);
//导入文章类别管理相关接口的路由
const articleCateRouter = require('./router/artcate');
app.use('/my/article', articleCateRouter);
//导入文章管理相关接口的路由
const articleRouter = require('./router/article');
app.use('/my/article', articleRouter);
//托管静态资源 存放着用户上传的封面头像等文件
app.use('/uploads', express.static('./uploads'));
// 错误级别的中间件
app.use((err, req, res, next) => {
    // 判断错误是否是因为token校验抛出的
    if (err.name === 'UnauthorizedError') return res.cc('身份验证失败！');
    res.cc(err);
})
app.listen(PORT, () => {
    console.log('running...');
});