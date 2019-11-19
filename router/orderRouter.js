//导入express模块
const express = require("express");
//导入dao/studentDao.js模块
const orderDao = require("../dao/orderDao.js");
const svgCaptcha = require('svg-captcha');
//创建Router对象
const router = express.Router();

//结算
router.post("/order",function(req,resp){
    // req.session.sessionOrder = {pid:1,pimage:"products/1/c_0001.jpg",pname:"小米4c标准版",shop_price:1299,number:1,subtotal:1299};
    let params = req.body; 
    let obj={succ:false,msg:""};
    let productlist=req.session.orderdetail;//[{},{},time:]
    orderDao.queryByUserid([params.userid],function(userlist){
        if(userlist==null){
            obj.msg="用户不存在";
            resp.json(obj);
        }else{
            if(params.shippingAddress!=userlist.shippingAddress){
                obj.msg="用户地址错误";
            }else if(params.username!=userlist.username){
                obj.msg="用户姓名错误";
            }else if(params.phone!=userlist.phone){
                obj.msg="用户手机号错误";
            }else{
                obj.msg="订单生成成功";
                obj.succ=true;
                let allMoney=0;
                let allNum=0;
                let c;
                var orderDetail=new Array();
                let order=params.myLocalDate;
                for(var m=0;m<productlist.length;m++){
                    allMoney+=productlist[m].number*productlist[m].shop_price;
                    allNum+=Number(productlist[m].number);
                    productlist[m].time=order;
                    c = extend(productlist[m], {time:order});
                    orderDetail.push(c);
                }
                console.log("----------------------------------------");
                // console.log(productlist);
                let onemeg={allNum:allNum,allMoney:allMoney,orderStatus:"未付款",time:order,userid:params.userid,username:params.username,shippingAddress:params.shippingAddress,phone:params.phone};

                orderDao.insertOrders(onemeg,function(count){
                    if(count==1){
                        // req.session.sessionOrders=d;
                         console.log("新增订单成功");
                        // 

                         // 查询新增订单的uuid
                        orderDao.queryTime([onemeg.time],function(message){
                            if(message==null){
                                console.log("查询错误");
                            }else{
                                // console.log("订单编号",message.uuid);
                                // console.log("productlist[m]",c);
                                var m;
                                var jsuan=new Array();
                                for(var j=0;j<orderDetail.length;j++){
                                    m=extend(orderDetail[j], {uuid:message.uuid});
                                    jsuan.push(m);
                                }
                                // console.log("orderdatail-jsuan",jsuan);
                                for(var k=0;k<jsuan.length;k++){
                                    orderDao.insert(jsuan[k],function(count){
                                        if(count==1){
                                             console.log("新增成功");
                                        }else{
                                            console.log("新增失败");
                                        }
                                    })
                                }
                                // req.session.sessionOrder=jsuan;
                                // console.log("orderdatail-jsuan",req.session.sessionOrder);
                            }
                        })
                        resp.json(obj);

                    }else{
                        console.log("新增订单失败");
                        resp.json(obj);
                    }
                })

            }
            
        }
    })
    

})

//生成订单
router.post("/orders",function(req,resp){
    let params = req.body;
    let obj={succ:false,msg:""};
    orderDao.queryOrders(params,function(data){
        console.log(data);
        if(data==null){
            console.log("不存在数据");
        }else{
            console.log("我是lists",data);
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>");
            orderDao.querypid([],function(product){
                console.log(product);
                if(product==null){
                    console.log("不存在数据");
                }else{
                    console.log("我是product",product);
                    obj.data=product;

                    for(var i=0;i<data.length;i++){
                        let dataone=data[i];
                        dataone.pro=[];
                        for(var j=0;j<product.length;j++){
                            let productone=product[j];
                            if (dataone.uuid==productone.uuid) {
                                dataone.pro.push(productone);
                            }
                        }
                    }

                    console.log("data--------------------------");
                    console.log(data);
                    obj.data=data;
                    //获取订单条数
                    orderDao.queryCount(params,function(count){
                        console.log(count);
                        let pagecount = getPageCount(count,params.pagesize);
                        // console.log(pagecount);
                        //定义分页对象
                        let pagnation={};
                        pagnation.pagecount=pagecount;
                        pagnation.datacount=count;
                        pagnation.pagesize=params.pagesize;
                        pagnation.pagenum=parseInt(params.pagenum);
                        console.log(pagnation);
                        obj.pagnation=pagnation;
                        resp.json(obj);
                    })
                }
            })
        }
    })

});

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

//拼接对象
function extend(target, source) { 
    for (var obj in source) {
        target[obj] = source[obj];
    } 
    return target;
}

//导出
module.exports = router;