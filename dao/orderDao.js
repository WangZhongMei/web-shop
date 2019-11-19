//导入mysql驱动
const mysql = require("mysql");
//导入config中database.js文件
const database = require("../config/database.js");

//创建连接池对象
const pool = mysql.createPool(database.mysql);

//根据userid查询user
exports.queryByUserid=function(param,callback){
    let sql = "select * from user where user_id=?";
    pool.query(sql,param,function (error, results, fields) {
        if (error) throw error;
        let obj=null;
        if(results.length>0){
            obj=results[0];
        }
        callback(obj);
    });
}


//新增orderdetail
exports.insert=function(params,callback){
    let sql = "insert into orderdetail(pid,number,shop_price,allmoney,uuid) values(?,?,?,?,?)";
    let param = [params.pid,params.number,params.shop_price,params.allmoney,params.uuid];
    pool.query(sql,param,function (error, results, fields) {
        if (error) throw error;
        callback(results.affectedRows);
    });
}

//新增orders
exports.insertOrders=function(params,callback){
    let sql = "insert into orders(time,allMoney,allNum,orderStatus,userid,username,shippingAddress,phone) values(?,?,?,?,?,?,?,?)";
    let param = [params.time,params.allMoney,params.allNum,params.orderStatus,params.userid,params.username,params.shippingAddress,params.phone];
    pool.query(sql,param,function (error, results, fields) {
        if (error) throw error;
        callback(results.affectedRows);
    });
}

//根据userid查询orders
exports.queryByuserid=function(param,callback){
    let sql = "select * from orders where userid=?";
    pool.query(sql,param,function (error, results, fields) {
        if (error) throw error;
        let obj=null;
        if(results.length>0){
            obj=results[0];
        }
        callback(obj);
    });
}

//查询orders中的uuid 根据时间
exports.queryTime=function(param,callback){
    let sql = "select * from orders where time=?";
    pool.query(sql,param,function (error, results, fields) {
        if (error) throw error;
        let obj=null;
        if(results.length>0){
            obj=results[0];
        }
        callback(obj);
    });
}


//根据pid查询商品
exports.queryPro=function(param,callback){
    let sql = "select p.pid,p.pname,p.pimage,p.shop_price from product p left join orderdetail d on d.pid = p.pid";
    // let sql = "select * from product where pid=?";
    pool.query(sql,param,function (error, results, fields) {
        if (error) throw error;
        let obj=null;
        if(results.length>0){
            obj=results[0];
        }
        callback(obj);
    });
}


// 将orders和detailorder两张表结合 根据uuid
exports.queryAll=function(condition,callback){
    let {pagenum,pagesize}=condition;
    let querySql = "select o.*,d.*  from orderdetail d left join orders o on d.uuid = o.uuid ORDER BY o.time DESC  limit  ?,?";
    let params = [];
    let startIndex =  (pagenum-1)*pagesize;
    params.push(startIndex);
    params.push(parseInt(pagesize));
    pool.query(querySql,params,function (error, results, fields) {
        if (error) throw error;
        callback(results);
    });
}

//根据查询条件查询学生总记录数
exports.queryCount=function(params,callback){
    let querySql = "select count(*) count from orderdetail d left join orders o on d.uuid = o.uuid ";
    pool.query(querySql,params,function (error, results, fields) {
        if (error) throw error;
        let count=0;
        if(results.length>0){
            count=results[0].count;
        }
        callback(count);
    });
}

//根据pid将orderdetail和product联系起来
exports.querypid=function(params,callback){
    let querySql = "select d.number,d.shop_price,d.allmoney,d.pid,p.pname,p.pimage,d.uuid from orderdetail d left join product p on d.pid = p.pid";
    pool.query(querySql,params,function (error, results, fields) {
        if (error) throw error;
        callback(results);
    });
}

//取得orders中的数据
exports.queryOrders=function(condition,callback){
    let {pagenum,pagesize}=condition;
    let querySql = "select * from orders  ORDER BY time DESC limit ?,? ";
    let params = [];
    let startIndex =  (pagenum-1)*pagesize;
    params.push(startIndex);
    params.push(parseInt(pagesize));
    pool.query(querySql,params,function (error, results, fields) {
        if (error) throw error;
        callback(results);
    });
}
