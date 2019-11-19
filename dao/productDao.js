//导入mysql驱动
const mysql = require("mysql");
//导入config中database.js文件
const database = require("../config/database");

//创建连接池对象
const pool = mysql.createPool(database.mysql);

// 作者：焦蓉  start
//首页最热产品  作者：焦蓉
exports.queryHot=function(callback){
    let sql = "select * from product p where p.is_hot=1 limit 0,9";
    pool.query(sql,[],function (error, results, fields) {
        callback(results);
    });
}

//首页最新产品  作者：焦蓉
exports.queryNew=function(callback){
    let sql = "select * from product p order by pdate limit 0,9";
    pool.query(sql,[],function (error, results, fields) {
        callback(results);
    });
}

// 产品列表页 作者：焦蓉
exports.queryProductByCId=function(params,callback){
    let sql = "select * from product where cid =? limit ?,?";
    pool.query(sql,params,function (error, results, fields) {
        callback(results);
    });
}
// 作者：焦蓉  end

// 产品分页 作者：费刘云
exports.queryCount=function(cid,callback){

    let querySql = "select count(*) count from product where cid =? ";
    
    pool.query(querySql,[cid],function (error, results, fields) {
        if (error) throw error;
        let count = 0;
        if(results.length>0){
            count = results[0].count;
        }
        callback(count);
    });
}
// 作者：费刘云  end


exports.queryBypid=function(params,callback){
    let sql="select p.*,c.cname from product p left join category c on p.cid = c.cid where p.pid=?";
    pool.query(sql,params,function(error,results,fields){
        let obj=null;
        if(results.length>0){
            obj=results[0];
        }
        callback(obj);
    })
}

exports.queryIn=function(params,callback){
    let sql="select * from product where pid in([where])";
    let where="";
    for(var i=0;i<params.length;i++){
        if(i==params.length-1){
            where+="?";
        }else{
            where+="?,";
        }
    }
    sql=sql.replace("[where]",where);
    pool.query(sql,params,function(error,results,fields){
        callback(results);
    })
}
