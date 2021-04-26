const express = require('express');
const router = express.Router();
// 导入路由对应的处理函数
const { reguser, login } = require('./../router_handler/user');
// 导入数据格式校验的模块
const expressJoi = require('@escook/express-joi');
// 导入数据校验的规则
const { reg_login_schema } = require('./../schema/user');
//注册
router.post('/reguser', expressJoi(reg_login_schema), reguser);
// 登录
router.post('/login', expressJoi(reg_login_schema), login);

module.exports = router;