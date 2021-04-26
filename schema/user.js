const joi = require('@hapi/joi');

const username = joi.string().alphanum().min(1).max(10).required();
const password = joi.string().pattern(/^[\S]{6,12}$/).required();
// 登录注册接口的数据校验规则
exports.reg_login_schema = {
    body: {
        username,
        password
    }
}
const id = joi.number().integer().min(1).required();
const nickname = joi.string().required();
const email = joi.string().email().required();
// 校验用户信息的规则
exports.update_userInfo_schema = {
    body: {
        id,
        username,
        nickname,
        email
    }
}
// 校验修改密码数据的规则
exports.update_password_schema = {
    body: {
        oldPwd: password,
        newPwd: joi.not(joi.ref('oldPwd')).concat(password)
    }
}
// 校验头像文件的规则
const avatar = joi.string().dataUri().required();
exports.update_avatar_schema = {
    body: {
        avatar
    }
}