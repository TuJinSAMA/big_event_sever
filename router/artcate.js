const express = require('express');
const router = express.Router();
// 导入路由对应的处理函数
const { getArticleCates, addArticleCate, removeArticleCate, getArticleCateForId, updateArticleCateForId } = require('./../router_handler/artcate');
// 导入各路由校验数据格式的中间件
const expressJoi = require('@escook/express-joi');
const { add_cate_schema, delete_getCateForId_schema, update_cate_schema } = require('./../schema/artcate')

// 获取文章类别
router.get('/cates', getArticleCates);
// 新增文章类别
router.post('/addcates', expressJoi(add_cate_schema), addArticleCate);
// 通过id删除文章类别
router.get('/deletecate/:id', expressJoi(delete_getCateForId_schema), removeArticleCate);
//  通过id获取文章类别
router.get('/cates/:id', expressJoi(delete_getCateForId_schema), getArticleCateForId);
//  通过id修改文章类别
router.post('/updatecate', expressJoi(update_cate_schema), updateArticleCateForId);
module.exports = router;