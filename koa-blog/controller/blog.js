const xss = require('xss');
const { exec } = require('../db/mysql');

const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title  like '%${keyword}%' `;
    }

    sql += `order by createtime desc;`;

    return exec(sql);
}

const getDetail = (id) => {
    let sql = `select * from blogs where 1=1 `

    if (id) {
        sql += `and id='${id}' `
    }

    return exec(sql).then((row) => {
        return row[0];
    });
}

const newBlog = (blogData = {}) => {
    const { author } = blogData;
    const title = xss(blogData.title);
    const content = xss(blogData.content);
    const createtime = Date.now();
    const sql = `insert into blogs (title, content, createtime, author) values ('${title}', '${content}', '${createtime}', '${author}')`;

    return exec(sql).then((insertData) => {
        return {
            id: insertData.insertId,
        }
    });
};

const updateBlog = (blogData) => {
    const { id } = blogData;
    const title = xss(blogData.title);
    const content = xss(blogData.content);
    const sql = ` update blogs set title='${title}', content='${content}' where id=${id}`

    return exec(sql).then((data) => {
        if (data.affectedRows) {
            return true;
        }

        return false;
    })
};

const delBlog = (blogData) => {
    const { id, author } = blogData;
    const sql = ` delete from blogs where id=${id} and author='${author}'`

    return exec(sql).then((data) => {
        if (data.affectedRows) {
            return true;
        }

        return false;
    })
};

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog,
}