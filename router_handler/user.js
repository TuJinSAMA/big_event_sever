//导入数据库对象
const db = require('./../db/index');
//导入密码加密的第三方模块
const bcrypt = require('bcryptjs');
//导入生成token的第三方模块
const jwt = require('jsonwebtoken');
// 导入密钥字符串和token有效期
const { jwtSecretKey, expiresIn } = require('./../config');
// 注册接口的处理函数
exports.reguser = (req, res) => {
    const userInfo = req.body;
    const sqlStr = 'SELECT * FROM ev_users WHERE username=?';
    // 检查用户名是否重复
    db.query(sqlStr, userInfo.username, (err, result) => {
        if (err) return res.cc(err);
        if (result.length > 0) return res.cc('用户名已存在！');
        // 将密码加密
        userInfo.password = bcrypt.hashSync(userInfo.password, 10);
        const insertSql = 'INSERT INTO ev_users SET ?';
        // 将注册好的用户数据插入到数据库
        db.query(insertSql, userInfo, (err, result) => {
            if (err) return res.cc(err);
            if (result.affectedRows !== 1) return res.cc('注册失败！');
            res.cc('注册成功！', 0);
        });
    });
}
// 登录接口的处理函数
exports.login = (req, res) => {
    const { body } = req;
    const sqlStr = 'SELECT * FROM ev_users WHERE username=?';
    db.query(sqlStr, body.username, (err, result) => {
        if (err) return res.cc(err);
        if (result.length !== 1) return res.cc('登录失败！');
        // 对比用户输入的密码和数据库加密的密码是否相同
        const isSame = bcrypt.compareSync(body.password, result[0].password);
        if (!isSame) return res.cc('登陆失败！密码错误！');
        // 响应给客户端的用户信息 不应该带隐私信息
        const user = { ...result[0], password: '', user_pic: '' };
        // 创建一个token字符串  不要将密码等信息放入
        const tokenStr = jwt.sign(user, jwtSecretKey, { expiresIn });
        // 将token返回给前端
        res.cc('登录成功！', 0, { token: `Bearer ${tokenStr}` });
    });
}