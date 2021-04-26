const express = require('express');
const router = express.Router();
const { publishArticle, deleteArticleForId, getArticleForId, editArticle, getArticles } = require('./../router_handler/article');
// 校验formdata数据格式的模块
const multer = require('multer');
const path = require('path');
// 初始化一个路径用来存放客户端上传的文件
const upload = multer({ dest: path.join(__dirname, '../uploads') });

const expressJoi = require('@escook/express-joi');
const { add_article_schema, article_handleForId_schema, edit_article_schema, get_article_schema } = require('./../schema/article');

//发布文章的路由           校验formdata中的图片文件
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), publishArticle);

//获取文章列表
router.get('/list', expressJoi(get_article_schema), getArticles);

//根据id删除文章的路由
router.get('/delete/:id', expressJoi(article_handleForId_schema), deleteArticleForId);

//根据id获取文章详情
router.get('/:id', expressJoi(article_handleForId_schema), getArticleForId);

//根据id更新文章内容
router.post('/edit', upload.single('cover_img'), expressJoi(edit_article_schema), editArticle);


module.exports = router;