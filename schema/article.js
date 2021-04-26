const joi = require('@hapi/joi');


const title = joi.string().required();
const cate_id = joi.number().integer().min(1).required();
const content = joi.string().required().allow('');
const state = joi.string().valid('已发布', '草稿').required();

// 发布文章对应的数据校验规则
exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state
    }
}

const pagenum = joi.number().integer().min(1).required();
const pagesize = joi.number().integer().min(1).required();
const get_cate_id = joi.string().allow('');
const get_state = joi.string().valid('已发布', '草稿').allow('');
// 获取文章列表对应的数据校验规则
exports.get_article_schema = {
    query: {
        pagenum,
        pagesize,
        cate_id: get_cate_id,
        state: get_state

    }
}

const id = joi.number().integer().min(1).required();
// 通过id获取文章 id的校验规则
exports.article_handleForId_schema = {
    params: {
        id
    }
}

// 修改文章的数据校验规则
exports.edit_article_schema = {
    body: {
        id,
        title,
        cate_id,
        content,
        state
    }
}