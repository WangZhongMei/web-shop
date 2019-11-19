//导入express模块
const express = require("express");
//导入dao/studentDao.js模块
const userDao = require("../dao/userDao");

const svgCaptcha = require('svg-captcha');
//创建Router对象
const router = express.Router();
/**
 * 作者：朱莹
 * 用户登录操作
 */
//登录操作
router.post("/login",function (req,resp) {
    let obj = {succ:false , msg:""};
    let params = req.body;
    let yzm = req.session.captcha.toUpperCase();
    console.log(params.yzm.toUpperCase());
    if(params.yzm.toUpperCase() == yzm){
        userDao.queryByLoginname([params.loginname],function (userInfo) {
            if(userInfo == null){
                obj.msg = "该用户不存在";
            }else {
                if(params.loginpwd == userInfo.pwd){
                    obj.msg = "登录成功";
                    obj.succ = true;
                    req.session.sessionUser = userInfo;
                }else{
                    obj.msg = "密码错误";
                }
            }
            resp.json(obj);
          });

    }else {
        obj.msg="验证码错误";
        resp.json(obj);
    }

});
/**
 * 作者：朱莹
 * 用户登录操作结束
 */


/**
 * 作者：朱莹
 * 验证码
 */
router.get('/captcha',function (req, resp) {
    //size：验证码位数 ； noise：干扰线的条数 ；
const cap = svgCaptcha.create({size:4,noise:1,ignoreChars:'0o1i',background:'#DFE1CC'});
req.session.captcha= cap.text; 
// 响应的类型
resp.type('svg'); 
resp.send(cap.data);
});
/**
 * 作者：朱莹
 * 验证码
 */


/**
 * 作者：朱莹
* 注册页面相关操作
 */
//注册页面
router.post("/register",function(req,resp){
    let obj = {succ:false , msg:""};
    let params = req.body;
   userDao.queryByUserid([params.userid],function(userinfo){
        if(userinfo != null){
            obj.msg="用户名已存在";
            resp.json(obj);
        }else {
            let yzm = req.session.captcha.toUpperCase();
            if(params.yzm.toUpperCase() == yzm){
                //新增
                userDao.insert(params,function(count){
                    if(count==1){
                        obj.succ=true;
                        obj.msg="注册成功";
                        resp.json(obj);
                    }else{
                        obj.msg="注册失败！";
                        resp.json(obj);
                    }
                })
            }else {
                obj.msg="验证码错误";
                resp.json(obj);
            }

        }
   })

})

/**
 * 作者：朱莹
 * 注册页面操作结束
 */


//导出
module.exports = router;