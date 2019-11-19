const mysql = require("mysql");

const database = require("../config/database");

const pool = mysql.createPool(database.mysql);

/*
 * 作者：朱莹
 *登录页面用户名相关操作
 */
exports.queryByLoginname = function (param,callback) {
    let sql = "select * from user where user_id=?";
    pool.query(sql,param,function (err,results,fields) {
        if (err) throw err;
        let obj = null;
        console.log(results);
        if(results.length > 0){
            obj = results[0];
        }
        callback(obj);
      })
  };
  /*
 * 作者：朱莹
 *登录页面用户名相关操作
 */


 /*
 * 作者：朱莹
 *注册页面用户名相关操作
 */
//根据用户名查询用户信息
exports.queryByUserid=function(param,callback){
    let sql = "select * from user where user_id = ?";
    pool.query(sql,param,function (err, results, fields) {
        if (err) throw err;
        let obj=null;
        if(results.length > 0){
            obj = results[0];
        }
        callback(obj);
    });
}
/*
 * 作者：朱莹
 *注册页面用户名相关操作
 */


/*
 * 作者：朱莹
 *用户注册新增操作
 */
//新增
exports.insert=function(params,callback){
    let sql = "insert into user (user_id,pwd,email,phone,user_name,sex,birth) values (?,?,?,?,?,?,?)";
    let param = [params.userid,params.password,params.email,params.phone,params.username,params.sex,params.birth];
    console.log(param);
    pool.query(sql,param,function (err, results, fields) {
        if (err) throw err;
        callback(results.affectedRows);
    });
}
/*
 * 作者：朱莹
 *用户注册新增操作结束
 */