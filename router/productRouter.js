//导入express模块
const express = require("express");
//导入dao/bookDao.js模块
const productDao = require("../dao/productDao");

//创建Router对象
const router = express.Router();
/* 
作者：章嘉怡
此处为浏览商品详情和添加商品到购物车
 */
router.get("/:pid",function(req,resp){
    let pid=req.params.pid;
    //console.log(pid);
    let obj={msg:"",succ:false};
    productDao.queryBypid([pid],function(productinfo){
        if(productinfo==null){
            obj.msg="该产品不存在";
        }else{
            obj.succ=true;
            obj.productinfo=productinfo;
            resp.cookie("track",getCookieValue(req,pid),{maxAge:1000*60*60});
        }
        resp.json(obj);
    })
})

 router.post("/procookie",function(req,resp){
    //取得cookie数据
    //resp.cookie("track",getCookieValue(req,pid),{maxAge:1000*60*60});
    let condition = req.body;
    let cookie = req.cookies;
    /* console.log("1111111111111111");
    console.log(cookie); */
    if("track" in cookie){
        let arr = cookie.track;
        var parsms = [];
        for(var i=0;i<arr.length;i++){
            var object = arr[i];
            parsms.push(object.pid);
        }
        productDao.queryIn(parsms,function(results){
            //把访问时间添加到数据中
            for(var j=0;j<results.length;j++){
                var mpro = results[j];
                for(var i=0;i<arr.length;i++){
                    var cpro = arr[i];
                    if(cpro.pid==mpro.pid){
                        mpro.time = cpro.time;
                        mpro.datatime = formatTime(new Date(cpro.time));
                        break;
                    }
                }
            }
            //console.log(results);
            results.sort(comparetime);       
            let obj = {};
            obj.prolist=results;
            obj.cid=cookie.cid;
            //console.log(obj);
            resp.json(obj);
        })     
    }
   /* 根据需要分页待完善
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
    
    }); */
});
/* function getIndex(pagenum,pagesize){
    return (pagenum-1)*pagesize;

}


function getPageCount(dataCount,pageSize){
    if(dataCount%pageSize==0){
        return Math.floor(dataCount/pageSize);
    }else{
        return Math.ceil(dataCount/pageSize);
    }
}
 */
var arrArr = new Array();
router.post("/addcart",function(req,resp){
    let params = req.body;
    //console.log(params);
    let obj={msg:"",succ:false};
    productDao.queryBypid([params.pid],function(productinfo){
        if(productinfo==null){
            obj.msg="该产品不存在";
            resp.json(obj);
        }else{
            obj.msg="加入购物车成功";
            req.session.sessionProduct=productinfo;           
            // obj.number=params.number;
            obj.succ=true;
            //arrArr.push(obj.productinfo);    
            var pid=params.pid;
            for(var i=0;i<arrArr.length;i++){
                if(pid==arrArr[i].pid){
                    //console.log(params.number);
                    let number=Number(arrArr[i].number);
                    number+=Number(params.number);
                    arrArr[i].number=number;
                    //console.log(pid);
                    //console.log(number);
                    break;
                }
            }
            if(i==arrArr.length){
                obj.productinfo=productinfo;
                obj.productinfo.number=params.number;
                arrArr.push (obj.productinfo) ;
            }
            
            // arrArr.push(obj.productinfo); 
            req.session.sessionShopCart=arrArr;
            // console.log(arrArr);
            resp.json(obj);
        }
    })

}) 

function getCookieValue(req,pid){
    var oldarr = new Array();
    //方法返回数组
    //取得cookie数据
    let cookie = req.cookies;
    //判断cookie中是否有track键 有该键 说明已经存储了cookie的值 ,没有该键 第一次cookie 
    if("track" in cookie){
        oldarr = cookie.track;
        //console.log(oldarr);
        for(var i=0;i<oldarr.length;i++){
            var object = oldarr[i];
            if(object.pid==pid){
                oldarr.splice(i,1);
                break;
            }
        }
        //把pid添加到数组的开头。
        var obj={};
        obj.pid=pid;
        obj.time=new Date().getTime();
        oldarr.unshift(obj);
    }else{
        var obj={};
        obj.pid=pid;
        obj.time=new Date().getTime();
        oldarr.push(obj);
    } 
    return oldarr;
}

function comparetime(obj1,obj2){
    return -(obj1.time-obj2.time);
}

function buzero(str){
    //把数值转换成字符串
    str=str+"";
    if(str.length==1){
        return "0"+str;
    }
    return str;
}

function formatTime(date){
    var time=date.getFullYear()+
         "-"+buzero(date.getMonth()+1)+
         "-"+buzero(date.getDate())+
         " "+buzero(date.getHours())+
         ":"+buzero(date.getMinutes())+
         ":"+buzero(date.getSeconds());
         
    return time;
}
/* 
作者：章嘉怡
此处为浏览商品详情和添加商品到购物车结束
 */


/** 
 * 作者：吴雨
 * 此处为购物车界面相关操作
 */

//将存在session的值放在bookshopping中
router.get("/",function(req,resp){
    let shop=req.session.sessionShopCart;
    let obj={mag:"",succ:false};
    // console.log("---取得session数据---");
    // console.log(shop);
    if(shop==undefined){
        obj.msg="没有加购商品";
    }else{
        let obj=shop;
        resp.json(obj);
    }
})
//删除所有数据
router.post("/clean",function(req,resp){
    req.session.cookie.maxAge = 0;
    arrArr=[];
    // console.log("---删除session数据---");
    // console.log(req.session.sessionShopCart);
    resp.json("");
})
//指定删除一行数据
router.post("/del/:pid",function(req,resp){
    console.log("---存储数据---");
    console.log(arrArr);
    console.log(req.session.sessionShopCart);
    let pid=req.params.pid;
    let arrs=[];
    console.log("-----pid----");
    console.log(pid);
    let obj={msg:"",succ:false};
    productDao.queryBypid([pid],function(productinfo){
        if(productinfo==null){
            obj.msg="该产品不存在";
        }else{
            console.log("----1--------------");
            obj.succ=true;
            let arrs=req.session.sessionShopCart;
            for(var i=0;i<arrs.length;i++){
                if(pid==arrs[i].pid){
                    arrs.splice(i,1);
                    req.session.sessionShopCart=arrs;
                    arrArr=arrs;
                    console.log("----2----------------");
                }
            }
            console.log("---4-----------------");
            console.log(arrs);
            console.log(req.session.sessionShopCart);
            obj.msg="删除成功！";
        }
        // console.log(obj);
        resp.json(obj);
    })
})
//对选择的数据进行存储，给中美
router.post("/saved",function(req,resp){
    // console.log("---存储数据---");
    let params=req.body;
    let obj={succ:false};
    // console.log(params);
    let arr= new Array();
    let shoplist=req.session.sessionShopCart;
    // console.log(shoplist);
    for(var j=0;j<params.arr.length;j++){
        var pids=params.arr[j].pid;
        var num=params.arr[j].number;
        var money=params.arr[j].allmoney;
        // console.log(pids);
        for(var i=0;i<shoplist.length;i++){
            var pid = shoplist[i].pid;
            if(pid==pids){
                shoplist[i].number=num;
                shoplist[i].allmoney=money;
                // console.log("----要存储的");
                arr.push(shoplist[i]);
                
            }
        }
    }
    // console.log(arr);
    //我存储的给中美的订单
    obj.succ=true;
    req.session.orderdetail=arr;
    for(var i=0;i<arrArr.length;i++){
        let arrOne=arrArr[i]
        for(var j=0;j<arr.length;j++){
            let arri=arr[j];
            if(arrOne.pid==arri.pid){
                arrArr.splice(i,1);
                i--;
            }
        }
    }
    req.session.sessionShopCart=arrArr;
    console.log("req.session.orderdetail");
    console.log(req.session.orderdetail);
    resp.json(obj);
})
//渲染模板list.html
router.post("/temlAll",function(req,resp){
    // let params=req.query;
    console.log(req.session.orderdetail);
    let orderAll= req.session.orderdetail;
    console.log("orderAll");
    console.log(orderAll);
    resp.json(orderAll);

});
/** 
 * 作者：吴雨
 * 购物车界面相关操作结束
 */

module.exports = router;