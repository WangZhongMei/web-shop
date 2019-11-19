//导入mysql驱动
const mysql = require("mysql");
//导入config中database.js文件
const database = require("../config/database");

//创建连接池对象
const pool = mysql.createPool(database.mysql);

// 作者：焦蓉  start
// 头部导航  作者：焦蓉
exports.queryNav=function (callback) {
    let sql = "select * from category";
    pool.query(sql,[],function (error,results,fields) {  
        callback(results);
    });
}
// 作者：焦蓉  end