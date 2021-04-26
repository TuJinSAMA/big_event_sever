const express = require('express');
const router = express.Router();
//导入路由对应的处理函数
const { getUserInfo, updateUserInfo, updatePassword, updateUserAvatar } = require('./../router_handler/userinfo');
// 导入校验数据的第三方插件
const expressJoi = require('@escook/express-joi');
const { update_userInfo_schema, update_password_schema, update_avatar_schema } = require('./../schema/user');
// 获取用户信息
router.get('/userinfo', getUserInfo);
// 修改用户信息
router.post('/userinfo', expressJoi(update_userInfo_schema), updateUserInfo);
// 修改密码
router.post('/updatepwd', expressJoi(update_password_schema), updatePassword);
// 更换头像
router.post('/update/avatar', expressJoi(update_avatar_schema), updateUserAvatar);

module.exports = router;