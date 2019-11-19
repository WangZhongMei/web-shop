//导入express模块
const express = require("express");
//创建http服务对象
const app = express();

//导入body-Parser的第三方中间件
const bodyParser = require("body-parser");

//导入studentRouter.js模块
const userRouter = require("./router/userRouter.js");
const homeRouter = require("./router/homeRouter.js");
const productRouter = require("./router/productRouter.js");
const orderRouter = require("./router/orderRouter.js");
//导入session中间件
const expressSession =  require("express-session");
const cookieParser = require("cookie-parser");
//创建session对象
//创建会话中间件  配置session中间件信息
const session = expressSession({
    /* name : "session-name", */  //cookie key名称
    secret : 'secret', // 对session id 相关的cookie 进行签名  不能少
    resave : false,
    rolling: true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 1000 * 60*30, // 设置 session 的超时时间，单位毫秒  rolling: true设置 cookie有效期 只要使用session 就会更新cookie有效期
    }
});
app.use(cookieParser('secret'));
//把session对象加入到服务器中
app.use(session);


//导入art-template模板引擎
//设置模板引擎文件后缀，在express框架中整合art-template模板引擎
app.engine("html",require("express-art-template"));
//设置模板引擎目录
app.set("views","./views/");
//设置视图引擎
app.set("view engine","html");


//解析请求参数的类型是application/x-wwww-urlencoded  默认为该类型   
//body-parser专门处理请求正文(请求体))中的内容  把解析好的数据设置到请求对象中body属性中。
app.use(bodyParser.urlencoded({extended:true}));
//解析请求参数的类型是application/json 把解析好的数据设置到请求对象中body属性中。
app.use(bodyParser.json());

//根据客户端的资源名称 挂载到homeRouter对象上
app.use("/igeek",userRouter);
app.use("/igeek",homeRouter);
app.use("/igeek",productRouter);
app.use("/igeek",orderRouter);


//静态资源的设置
app.use("/static",express.static("./views/"));
app.use("/js",express.static("./js/"));
app.use("/css",express.static("./css/"));
app.use("/img",express.static("./img/"));
app.use("/fonts",express.static("./fonts/"));

//添加监听
app.listen("8080",function(){
    console.log("8080running...");
})