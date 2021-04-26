const joi = require('@hapi/joi');
// const joi = require('joi');
const name = joi.string().required();
const alias = joi.string().alphanum().required();
// 添加文章类别的数据校验规则
exports.add_cate_schema = {
    body: {
        name,
        alias
    }
}

const id = joi.number().integer().min(1).required();
// 删除文章类别 id 的校验规则
exports.delete_getCateForId_schema = {
    params: {
        id
    }
}
// 修改文章类别的数据校验规则
exports.update_cate_schema = {
    body: {
        id,
        name,
        alias
    }
}