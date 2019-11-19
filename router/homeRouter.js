//导入express模块
const express = require("express");
//导入dao/studentDao.js模块
const productDao = require("../dao/productDao");
const categoryDao = require("../dao/categoryDao");

//创建Router对象
const router = express.Router();

// 头部导航栏  作者：焦蓉
router.get("/navlist",function(req,resp){
    categoryDao.queryNav(function(navlist){
        let obj = {};
        obj.navlist = navlist;
        resp.json(obj);
    });
});

// 首页查询 最热产品列表  作者：焦蓉
router.get("/prolisthot",function(req,resp){
    // 查询mysql获取产品信息
    productDao.queryHot(function(prolist){
        let obj = {};
        obj.prolist=prolist;
        resp.json(obj);
    });
});
// 首页查询 最新产品列表  作者：焦蓉
router.get("/prolistnew",function(req,resp){
    // 查询mysql获取产品信息
    productDao.queryNew(function(prolist){
        let obj = {};
        obj.prolist=prolist;
        resp.json(obj);
    });
});
// 产品列表  作者：焦蓉
router.get("/prolist",function(req,resp){
    let obj = {};
       
    let condition = req.query;
    console.log(condition);
    resp.cookie("cid",condition.cid,{maxAge:1000*60*60});
     // 查询mysql获取产品信息
    productDao.queryProductByCId([condition.cid,getIndex(condition.pagenum,condition.pagesize),parseInt(condition.pagesize)],function(prolist){
       
       obj.prolist=prolist;
        // console.log(obj.prolist);
        console.log("condition:..........");
        console.log(condition);
       productDao.queryCount(condition.cid,function(count){
            let pagecount =  getPageCount(count,condition.pagesize);
            //定义分页对象
            let pagnation={};
            pagnation.pagecount=pagecount;
            pagnation.datacount=count;
            pagnation.pagesize=parseInt(condition.pagesize);
            pagnation.pagenum=parseInt(condition.pagenum);

            obj.pagnation=pagnation ;

            resp.json(obj);
        }); 
    
    });  
});


function getIndex(pagenum,pagesize){
    return (pagenum-1)*pagesize;

}


function getPageCount(dataCount,pageSize){
    if(dataCount%pageSize==0){
        return Math.floor(dataCount/pageSize);
    }else{
        return Math.ceil(dataCount/pageSize);
    }
}

// 产品分页  作者：费刘云

//根据总记录获取总页数
function getPageCount(dataCount,pageSize){
    let pageCount=0;
    if(dataCount%pageSize==0){
        pageCount= dataCount/pageSize;
    }else{
        pageCount= Math.ceil(dataCount/pageSize);
    }
    return pageCount;
}
// 作者：费刘云  end
//导出
module.exports = router;