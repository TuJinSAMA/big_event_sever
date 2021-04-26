const db = require('./../db/index');

// 获取文章分类列表的处理函数
exports.getArticleCates = (req, res) => {
    const sqlStr = 'SELECT * FROM ev_article_cate WHERE is_delete=0 ORDER BY id;';
    db.query(sqlStr, (err, result) => {
        if (err) return res.cc(err);
        if (result.length < 1) return res.cc('获取分类列表失败!');
        res.cc('获取分类列表成功！', 0, { data: result });
    })
}

// 新增文章分类的处理函数
exports.addArticleCate = (req, res) => {
    const sqlStr = 'INSERT INTO ev_article_cate SET ?';
    db.query(sqlStr, req.body, (err, result) => {
        if (err) return res.cc(err);
        if (result.affectedRows !== 1) return res.cc('新增文章分类失败！');
        res.cc('新增文章分类成功！', 0);
    });
}
// 根据id删除文章分类的处理函数
exports.removeArticleCate = (req, res) => {
    const { id } = req.params;
    const sqlStr = 'UPDATE ev_article_cate SET is_delete=1 WHERE id=?;';
    db.query(sqlStr, id, (err, result) => {
        if (err) return res.cc(err);
        if (result.affectedRows !== 1) return res.cc('删除文章分类失败！');
        res.cc('删除文章分类成功！', 0);
    });
}
// 根据id获取文章分类的处理函数
exports.getArticleCateForId = (req, res) => {
    const { id } = req.params;
    const sqlStr = 'SELECT * FROM ev_article_cate WHERE is_delete=0 AND id=?;';
    db.query(sqlStr, id, (err, result) => {
        if (err) return res.cc(err);
        if (result.length !== 1) return res.cc('获取文章分类失败！');
        res.cc('获取文章分类成功！', 0, { data: result[0] });
    });
}
// 根据id更新文章分类的处理函数
exports.updateArticleCateForId = (req, res) => {
    const sqlStr = 'UPDATE ev_article_cate SET ? WHERE id=?';
    db.query(sqlStr, [req.body, req.body.id], (err, result) => {
        if (err) {
            // 判断用户修改的文章类别名称是否重复
            if (new RegExp(/name_UNIQUE/g).test(err.message)) return res.cc('分类名称重复！请更换后再试！');
            if (new RegExp(/alias_UNIQUE/g).test(err.message)) return res.cc('分类别名重复！请更换后再试！');
            return res.cc(res);
        };
        if (result.affectedRows !== 1) return res.cc('更新分类信息失败！');
        res.cc('更新分类信息成功！', 0);
    });
}