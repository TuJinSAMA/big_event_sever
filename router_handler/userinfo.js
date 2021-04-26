// 导入连接好的数据库实例对象
const db = require('./../db/index');
// 导入用户密码加密的 bcrypt 模块
const bcrypt = require('bcryptjs');
// 获取用户信息接口的处理函数
exports.getUserInfo = (req, res) => {
    const { id } = req.user;
    const sqlStr = 'SELECT id,username,nickname,email,user_pic FROM ev_users WHERE id=?;';
    db.query(sqlStr, id, (err, result) => {
        if (err) return res.cc(err);
        if (result.length !== 1) return res.cc('获取用户信息失败！');
        res.cc('获取成功！', 0, { data: result[0] });
    });
}
// 修改用户信息接口的处理函数
exports.updateUserInfo = (req, res) => {
    const userInfo = req.body;
    const sqlStr = 'UPDATE ev_users SET ? WHERE id=?;';
    db.query(sqlStr, [userInfo, userInfo.id], (err, result) => {
        if (err) return res.cc(err);
        if (result.affectedRows !== 1) return res.cc('更新用户信息失败！');
        res.cc('更新用户信息成功！', 0);
    });
}
// 修改密码接口的处理函数
exports.updatePassword = (req, res) => {
    const { id } = req.user;
    const { oldPwd, newPwd } = req.body;
    const sqlStr = 'SELECT password FROM ev_users WHERE id=?';
    db.query(sqlStr, id, (err, result) => {
        if (err) return res.cc(err);
        // 判断用户输入的旧密码是否与数据库存储的密码相同
        const isSame = bcrypt.compareSync(oldPwd, result[0].password);
        if (!isSame) return res.cc('更新用户密码失败！原密码不正确！');
        // 将新密码加密后存入数据库
        const data = { password: bcrypt.hashSync(newPwd, 10) };
        const sqlStr = 'UPDATE ev_users SET ? WHERE id=?;';
        db.query(sqlStr, [data, id], (err, result) => {
            if (err) return res.cc(err);
            if (result.affectedRows !== 1) return res.cc('更新用户密码失败！');
            res.cc('更新用户密码成功！', 0);
        })
    })

}
//更换头像接口对应的处理函数
exports.updateUserAvatar = (req, res) => {
    const { id } = req.user;
    const data = { user_pic: req.body.avatar };
    const sqlStr = 'UPDATE ev_users SET ? WHERE id=?;';
    db.query(sqlStr, [data, id], (err, result) => {
        if (err) return res.cc(err);
        if (result.affectedRows !== 1) res.cc('更新头像失败！');
        res.cc('更新头像成功', 0);
    });
}