const db = require('./../db/index');
const path = require('path');
// 发布文章的处理函数
exports.publishArticle = (req, res) => {
    if (!(req.file && req.file.fieldname === 'cover_img')) return res.cc('文章封面是必选参数！');
    // 补全发布文章的其他信息
    const data = {
        ...req.body,
        cover_img: path.join('./uploads', req.file.filename),
        author_id: req.user.id,
        pub_date: new Date()
    }
    const sqlStr = 'INSERT INTO ev_articles SET ?';
    db.query(sqlStr, data, (err, result) => {
        if (err) return res.cc(err);
        if (result.affectedRows !== 1) return res.cc('发布文章失败！');
        res.cc('发布文章成功！', 0);
    });
}
// 获取文章列表的处理函数
exports.getArticles = (req, res) => {
    const { id } = req.user;
    Promise.allSettled([getArticleTotal(req.query, id), getArticleForNum(req.query, id)]).then(value => {
        const total = value[0].value;
        const result = value[1].value;
        res.cc('获取文章列表成功！', 0, { data: result || [], total: total || 0 });
    })
}
// 根据id删除文章的处理函数
exports.deleteArticleForId = (req, res) => {
    const sqlStr = 'UPDATE ev_articles SET is_delete=1 WHERE id=?;';
    db.query(sqlStr, req.params.id, (err, result) => {
        if (err) return res.cc(err);
        if (result.affectedRows !== 1) return res.cc('删除文章失败！');
        res.cc('删除成功！', 0);
    })
}
// 根据id获取文章的处理函数
exports.getArticleForId = (req, res) => {
    const sqlStr = 'SELECT * FROM ev_articles WHERE is_delete=0 AND id=?;';
    db.query(sqlStr, req.params.id, (err, result) => {
        if (err) return res.cc(err);
        if (result.length !== 1) return res.cc('获取文章内容失败！');
        res.cc('获取文章成功！', 0, { data: result[0] });
    })
}
// 根据id修改文章的处理函数
exports.editArticle = (req, res) => {
    if (!(req.file && req.file.fieldname === 'cover_img')) return res.cc('文章封面是必选参数！');
    console.log(req.body);
    // 补全修改文章的其他信息
    const data = {
        ...req.body,
        cover_img: path.join('./uploads', req.file.filename),
        author_id: req.user.id
    }
    const sqlStr = 'UPDATE ev_articles SET ? WHERE id=?;';
    db.query(sqlStr, [data, data.id], (err, result) => {
        if (err) return res.cc(err);
        if (result.affectedRows !== 1) return res.cc('修改文章内容失败！');
        res.cc('修改文章成功！', 0);
    });
}

// 获取文章总数的函数
function getArticleTotal(query, userId) {
    return new Promise((resolve, reject) => {
        const { cate_id, state } = query;
        let sql = {
            str: 'SELECT * FROM ev_articles WHERE is_delete=0 AND author_id=?;',
            data: [userId]
        };
        if (cate_id) {
            sql.str = 'SELECT * FROM ev_articles WHERE is_delete=0 AND author_id=? AND cate_id=?;';
            sql.data = [userId, cate_id];
        }
        if (state) {
            sql.str = 'SELECT * FROM ev_articles WHERE is_delete=0 AND author_id=? AND state=?;';
            sql.data = [userId, state];
        }
        if (cate_id && state) {
            sql.str = 'SELECT * FROM ev_articles WHERE is_delete=0 AND author_id=? AND cate_id=? AND state=?;';
            sql.data = [userId, cate_id, state];
        }
        db.query(sql.str, sql.data, (err, result) => {
            if (err) return reject(err.message);
            if (result.length < 1) return reject('获取文章总数失败!');
            const total = result.length; // 数据总数
            // const total = Number.parseInt(((result.length + pagesize - 1) / pagesize)); //计算有多少页 如果要计算需要把pagesize也解构
            resolve(total);
        });
    })
}

// 获取当页文章的数据
function getArticleForNum(query, userId) {
    return new Promise((resolve, reject) => {
        const { pagenum, pagesize, cate_id, state } = query;
        const sqlPagenum = (pagenum - 1) * pagesize;
        let sql = {
            str: 'SELECT id,title,pub_date,state,cate_id FROM ev_articles WHERE is_delete=0 AND author_id=? ORDER BY id LIMIT ?,?;',
            data: [userId, sqlPagenum, pagesize]
        };
        if (cate_id) {
            sql.str = 'SELECT id,title,pub_date,state,cate_id FROM ev_articles WHERE is_delete=0 AND author_id=? AND cate_id=? ORDER BY id LIMIT ?,?;';
            sql.data = [userId, cate_id, sqlPagenum, pagesize];
        }
        if (state) {
            sql.str = 'SELECT id,title,pub_date,state,cate_id FROM ev_articles WHERE is_delete=0 AND author_id=? AND state=? ORDER BY id LIMIT ?,?;';
            sql.data = [userId, state, sqlPagenum, pagesize];
        }
        if (cate_id && state) {
            sql.str = 'SELECT id,title,pub_date,state,cate_id FROM ev_articles WHERE is_delete=0 AND author_id=? AND cate_id=? AND state=? ORDER BY id LIMIT ?,?;';
            sql.data = [userId, cate_id, state, sqlPagenum, pagesize];
        }
        db.query(sql.str, sql.data, (err, result) => {
            if (err) return reject(err.message);
            if (result.length < 1) return reject('获取文章列表失败!');
            const promises = result.map((item) => {
                // 将每篇文章的类别从id换成相对应的名字
                return getArticleCates(item.cate_id).then(value => {
                    item.cate_name = value.name;
                    delete item.cate_id;
                }, reason => {
                    reject(reason);
                });
            });
            Promise.all(promises).then(value => {
                resolve(result);
            });
        });
    });
}

//获取文章分类名称列表
function getArticleCates(id) {
    return new Promise((resolve, reject) => {
        const sqlStr = 'SELECT name FROM ev_article_cate WHERE id=?;';
        db.query(sqlStr, id, (err, result) => {
            if (err) return reject(err.message);
            if (result.length !== 1) return res.reject('获取文章列表失败!');
            resolve(result[0]);
        })
    });
}