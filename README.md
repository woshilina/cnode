 
# cnode -- lina-Blog
> 模仿cnode建立的一个web项目

[线上体验](https://lina-blog.herokuapp.com/)

### 简要介绍
- 基于nodejs后端运行环境，使用的框架是Koa2
- 模板使用的ejs
- 数据库使用的是MySQL,选择Node的ORM框架Sequelize来操作数据库
- 前端框架使用的Bootstrap，是目前最受欢迎的前端框架

### 功能介绍
- 用户注册，登陆
- 用户信息的设置，头像上传
- 选择板块发表文章，支持Markdown输入，可以编辑或删除文章
- 对文章进行评论，对他人的评论进行评论或点赞
- 用户积分并排名
- 用户未读消息
- 页码
### 遇到的问题
1. post，get请求时传参的方式，post请求时数据的解析即koa-body的使用
2. 图片的剪裁cropperjs的应用，上传到本地，然后上传到七步云
3. markdoown编辑器中间件的选择，选择Mditor中间件原因:上手简单，可以满足简单的需求，最近更新的；并如何将用户编辑的内容显示到页面，ejs模板的语法的应用
4. 图标中间件的选择，在bootstrap文档中扩展部分选择Octicons，第一个Iconic没引入成功
### 截图
##### 注册
![image](https://s1.ax1x.com/2017/12/20/XhK2R.png)
##### 登陆
![image](https://s1.ax1x.com/2017/12/20/XhMx1.png)
##### 首页
![image](https://s1.ax1x.com/2017/12/20/Xh3qK.png)
##### 单篇文章页
![image](https://s1.ax1x.com/2017/12/20/XhJaD.png)
##### 发布话题
![image](https://s1.ax1x.com/2017/12/20/XhUGd.png)
##### 未读消息
![image](https://s1.ax1x.com/2017/12/20/XhaRA.png)
##### 设置
![image](https://s1.ax1x.com/2017/12/20/XhdxI.png)
##### 回复，点赞
![image](https://s1.ax1x.com/2017/12/20/Xhbi4.png) 

# 基于koa2搭建nodejs项目
### 一. 环境准备
由于 `koa2` 已经开始使用 `async/await` 等新语法，所以请保证 `node `环境在 `7.6` 版本以上
#### 安装Node.js和npm
##### 1. node.js
请到 Node 官网[nodejs.org](https://nodejs.org/en/)
 
或者国内镜像[https://npm.taobao.org/mirrors/node](https://npm.taobao.org/mirrors/node)，下载最新安装包。

 本人是windows系统，打开命令提示符`cmd`或`PowerShell`然后输入`node -v`,即可查看是否安装成功
 
```
PS C:\Users\11780> node -v
v8.7.0
```
显示`v8.7.0`说明安装成功，版本是8.7
##### 2. npm
npm(node package manager)是Node.js的包/模块管理工具，是随同NodeJS一起安装的，用于node能解决NodeJS代码部署上的很多问题，常见的使用场景有以下几种：常见的使用场景：
1>.允许用户从npm服务器下载别人编写的第三方包到本地使用
2>.允许用户从npm服务器下载并安装别人编写的命令行程序到本地使用
3>.允许用户将自己编写的包或命令行程序上传到npm服务器供别人使用

 可以在命令提示符输入npm-v查看其版本。
 
常见命令：

```
$ npm init  //初始化目录
$ npm install ModuleName //安装模块
$ npm install --save ModuleName //安装依赖包并将依赖包添加到 package.json 文件的 dependencies 键下
可简写成 $ npm i -s ModuleName
$ npm uninstall ModuleName//卸载模块
```
##### 3. 安装Visual Studio Code
VScode是由微软出品的
node的集成开发环境，可以编码、运行、调试，优点是启动速度快，执行简单，调试方便，而且是免费的

下载地址：VScode官网 [https://code.visualstudio.com/](https://code.visualstudio.com/)
##### 4.安装Postman
Postman 是一个 HTTP 通信测试工具。
下载：
- 官网下载 [https://www.getpostman.com/](https://www.getpostman.com/)
- 安装chrome浏览器插件postman，参考文章 [http://www.cnblogs.com/mafly/p/postman.html](http://www.cnblogs.com/mafly/p/postman.html/)
##### 5.Git
Git是一个开源的分布式版本控制系统，用于敏捷高效地处理任何或小或大的项目。无需服务器端软件支持。

下载：
官网 [https://git-scm.com/downloads](https://git-scm.com/downloads/)

### 二. 项目初始化
##### 1. 创建目录
使用命令行进入到你打算创建项目的文件夹中，如：进入到E盘的github文件夹中,
```
PS C:\Users\11780> cd  E:/github  //回车
```
创建工程目录cnode，进入cnode

```
PS E:\github>mkdir cnode
PS E:\github>cd cnode
```
使用npm初始化

```
PS E:\github\cnode>npm init
```
回车选择默认，生成一个package.json文件
##### 2.创建API入口文件app.js
使用vscode打开cnode，然后创建app.js文件
写入
```
console.log("Hello World!")
```
保存，点击调试，开始调试，会在调试控制台输出
`Hello World!`说明node环境正常。
###### 另外两种运行app的方法：
1. 在vscode的终端  输入`node app.js`
2. 在cmd或powershell中对应工程目录下输入`node app.js`
##### 3. 安装koa2
在cmd或powershell或终端输入`npm i -s koa`回车安装，
安完之后：
- 项目目录多了一个文件夹`node_modules`,这个文件夹用来存储依赖包，目前只存储了koa2相关的东西。
- package.json文件中多了`"dependencies": {
    "koa": "^2.4.1"
  }`
##### 4.启动服务器
重写app.js

```
const Koa = require('koa') //引入koa
const app = new Koa()//创建koa实例

// 增加代码
app.use(async (ctx, next) => {
  await next()
  ctx.response.type = 'text/html'
  ctx.response.body = '<h1>Hello World</h1>'
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})//监听3000端口
```
使用二-2创建API入口文件app.js中的三种方法之一 启动服务器，在浏览器中输入url`localhost:3000`或者`http://127.0.0.1:3000`即可访问到页面中显示`Hello World`


### 三. koa
##### 1.中间件
举个例子：上节代码

```
app.use(async (ctx, next) => {
  await next()
  ctx.response.type = 'text/html'
  ctx.response.body = '<h1>Hello World</h1>'
})
```
它的作用是：每接受一个`http`请求，`Koa`都会调用通过`app.use()`注册的`async`函数，同时为该函数传入`ctx`和`next`两个参数。而这个`async`函数就是我们所说的中间件。

中间件(middleware),处在HTTP Request和HTTP Rsponse中间，用来实现某种中间功能。用app.use()来加载中间件。

基本上Koa所有的功能都是通过中间件实现的，每个中间价默认接受两个参数第一个参数是ctx对象，第二个参数是next函数。只要调用next函数，就会把执行权转交下一个中间件。

多个中间件会形成一个栈结构，以先进后出的顺序执行。就是所谓的洋葱结构。
######  <1> ctx  
`ctx`是`context`的标识符。
`Koa `提供一个 `Context` 对象，表示一次对话的上下文（包括 HTTP 请求和 HTTP 回复）。通过加工这个对象，就可以控制返回给用户的内容。

每个 请求都将创建一个 `Context`，并在中间件中作为接收器引用。

`ctx.response`代表 `HTTP Response`。同样地，`ctx.request`代表` HTTP Request`。

为方便起见许多上下文的访问器和方法直接委托给它们的 `ctx.request`或 `ctx.response`，例如 `ctx.type` 和` ctx.length` 委托给 `response` 对象，`ctx.path` 和 `ctx.method `委托给 `request`。

也就是说：`ctx.request.path`可以写成`ctx.path`,
`ctx.response.length`可以写成`ctx.length`

ctx.state 中间件的存储空间，通过 state 可以存储一些数据，比如用户数据，版本信息等， 用于通过中间件传递信息给你的前端视图

```
ctx.state.user = await User.find(id);
```

 ###### <2> request
- request.header  请求头
- request.method 请求方法
- request.url 请求的URL
- request.origin 获取URL的来源，包括 protocol 和 host。
```
ctx.request.origin
// => http://example.com
```

- request.href  请求的完整的URL，包括 protocol，host 和 url。
```
ctx.request.href;
// => http://example.com/foo/bar?q=1
```

- request.path 请求路径名
- request.querystring 根据 ? 获取原始查询字符串.
- request.query 获取解析的查询字符串, 当没有查询字符串时，返回一个空对象。请注意，此 获取不支持嵌套解析。
- request.type 获取请求 Content-Type 不含参数 "charset"

 ###### <3> response
-  response.header 响应头对象
-  response.status 响应状态
-  response.body 响应主体
-  response.type  响应类型 Content-Type 不含参数 "charset"，Koa 默认的返回类型是text/plain
-  response.redirect(url, [alt]) 执行 [302] 重定向到 url.
##### 2.koa-router
路由是用于描述 URL 与处理函数之间的对应关系的。
比如用户访问 http://localhost:3000/，
那么浏览器就会显示 index 页面的内容，如果用户访问的是 http://localhost:3000/home，
那么浏览器应该显示 home 页面的内容。

通过npm安装`npm i -s koa-router`

使用：

```
const Koa = require('koa')
const app = new Koa()

const router= require('koa-router')();//引入koa-router并实例化
router
  .get('/',async(ctx,next)=>{
  //...});//处理请求路径为'/'，请求方法为get的请求
  .post('/home',async(ctx,next){
  //...});//处理请求路径为'/home'，请求方法为post的请求
  .put('/users/:id', async (ctx, next) => {
    // ... 
  })
  .del('/users/:id', async (ctx, next) => {
    // ... 
  })
  .all('/users/:id', async (ctx, next) => {
    // ... 
 // 调用路由中间件
 app.use(router.routes())
 app.listen(3000)
```
在 HTTP 协议方法中，GET、POST、PUT、DELETE 分别对应 查，增，改，删，这里 router 的方法也一一对应。通常我们使用 GET 来查询和获取数据，使用 POST 来更新资源。PUT 和 DELETE 使用比较少,all 方法用于处理上述方法无法匹配的情况，或者你不确定客户端发送的请求方法类型。

###### 其他特性：
- 命名路由
```
router.url('user', 3);
// => 生成路由 "/users/3" 
 
router.url('user', { id: 3 });
// => 生成路由 "/users/3" 
 
```
- 多中间件 

当路由处理函数中有异步操作时，这种写法的可读性和可维护性更高
```
router.get(
  '/users/:id',
  function (ctx, next) {
    return User.findOne(ctx.params.id).then(function(user) {
      // 首先读取用户的信息，异步操作
      ctx.user = user;
      next();
    });
  },
  function (ctx) {
    console.log(ctx.user);
    // 在这个中间件中再对用户信息做一些处理
    // => { id: 17, name: "Alex" }
  }
);
```


- 嵌套路由

我们可以在应用中定义多个路由，然后把这些路由组合起来用，这样便于我们管理多个路由，也简化了路由的写法。
```
const Router = require("koa-router")
var forums = new Router();
var posts = new Router();
 
posts.get('/', function (ctx, next) {...});
posts.get('/:pid', function (ctx, next) {...});
forums.use('/forums/:fid/posts', posts.routes(), posts.allowedMethods());
 
// 可以匹配到的路由为 "/forums/123/posts" 或者 "/forums/123/posts/123"
app.use(forums.routes());
```
- URL 参数

koa-router 也支持参数，参数会被添加到 ctx.params 中。参数可以是一个正则表达式，这个功能的实现是通过 path-to-regexp 来实现的。原理是把 URL 字符串转化成正则对象，然后再进行正则匹配， ` router.all('/*')`中`*` 通配符就是一种正则表达式。
```
router.get('/:category/:title', function (ctx, next) {
  console.log(ctx.params);//是一个对象
  // => { category: 'programming', title: 'how-to-node' } 
});
```

##### 3.post/get请求
当我们捕获到请求后，一般都需要把请求带过来的数据解析出来。数据传递过来的方式一般有三种：

###### - 请求参数放在 URL 后面

```
http://localhost:3000/home?id=12&name=ikcamp
```
使用request的query 方法或 querystring 方法可以直接获取到 Get 请求的数据，唯一不同的是 query 返回的是对象，而 querystring 返回的是字符串。

路由：
```
router.get('/home', async(ctx, next) => {
    console.log(ctx.request.query)
    console.log(ctx.request.querystring)
    ctx.response.body = '<h1>HOME page</h1>'
  })

```
访问上述url，控制台会依次输出：

```
{ id: '12', name: 'ikcamp' }
id=12&name=ikcamp
```

###### - 请求参数放在 URL 中间

```
http://localhost:3000/home/12/ikcamp
```
路由：
```
router.get('/home/:id/:name', async(ctx, next)=>{
    console.log(ctx.params)
    ctx.response.body = '<h1>HOME page /:id/:name</h1>'
  })
```
控制台输出:

```
{ id: '12', name: 'ikcamp' } 
```
###### - 请求参数放在 body 中

post 请求通常都会通过表单或 JSON 形式发送，而无论是 Node 还是 Koa，都 没有提供 解析 post 请求参数的功能。

使用的是koa-body解析:

安装：`npm i -s koa-body`

在app.js中引入`const koabody=require('koa-body')`

应用到app中`app.use(koabody())`
### 四. 如何实现前后端数据交互
 在对应网页html或ejs中引入jQuery 让jQuery ajax起作用
#####  问题一：如何引入jQuery？
使用CDN(内容分布网络)，搜索“jQuery CDN[”链接](http://code.jquery.com/)，在最新版本处点击minified（压缩版本）就可以看到jQuery的链接，直接copy到你的目标文件就ok了。

[以下问题请参考w3c官网](http://www.w3school.com.cn/jquery/jquery_ajax_intro.asp)


##### 问题二：什么是ajax？
AJAX = 异步 JavaScript 和 XML
简短地说，在不重载整个网页的情况下，AJAX 通过后台加载数据，并在网页上进行显示。

通过 jQuery AJAX 方法，您能够使用 HTTP Get 和 HTTP Post 从远程服务器上请求文本、HTML、XML 或 JSON - 同时您能够把这些外部数据直接载入网页的被选元素中。
##### 问题三. jQuery ajax - ajax() 方法怎么用

jQuery ajax - ajax() 方法[W3C官网链接](http://www.w3school.com.cn/jquery/ajax_ajax.asp/)

###### 定义和用法

ajax() 方法通过 HTTP 请求加载远程数据。

该方法是 jQuery 底层 AJAX 实现。简单易用的高层实现见 $.get, $.post 等。$.ajax() 返回其创建的 XMLHttpRequest 对象。大多数情况下你无需直接操作该函数，除非你需要操作不常用的选项，以获得更多的灵活性。

最简单的情况下，$.ajax() 可以不带任何参数直接使用。

注意：所有的选项都可以通过 $.ajaxSetup() 函数来全局设置。

语法


```
jQuery.ajax([settings])
```

settings	可选。用于配置 Ajax 请求的键值对集合。 可以通过 $.ajaxSetup() 设置任何选项的默认值。

```
$.ajax({ 
url: "test.html", //url 类型：String默认值:当前页地址。发送请求的地址。
type: 'post',//类型：String默认值: "GET")。请求方式 ("POST" 或 "GET")， 默认为 "GET"。注意：其它 HTTP 请求方法，如 PUT 和 DELETE 也可以使用，但仅部分浏览器支持。
data: data,// 类型：String发送到服务器的数据。将自动转换为请求字符串格式。GET 请求中将附加在 URL 后。查看 processData 选项说明以禁止此自动转换。必须为 Key/Value 格式。如果为数组，jQuery 将自动为不同值对应同一个名称。如 {foo:["bar1", "bar2"]} 转换为 '&foo=bar1&foo=bar2'。
success: function(data, status){
  if (status == 'success') {
        location.href='home';}}//类型：Function请求成功后的回调函数。参数：由服务器返回，并根据 dataType 参数进行处理后的数据；描述状态的字符串。这是一个 Ajax 事件。
error: function (data, status) {
        if (status == 'error') {
          location.href = 'onload';}
      }//error类型：Function默认值: 自动判断 (xml 或 html)。请求失败时调用此函数。有以下三个参数：XMLHttpRequest 对象、错误信息、（可选）捕获的异常对象。如果发生了错误，错误信息（第二个参数）除了得到 null 之外，还可能是 "timeout", "error", "notmodified" 和 "parsererror"。这是一个 Ajax 事件。
});
```

### 五. 搭建mvc框架
在业务代码持续增大，场景更加复杂的情况下，我们需要将代码分层。

 MVC 模式：
-  Model（模型层）：提供/保存数据
- Controller（控制层）：数据处理，实现业务逻辑
- View（视图层）：展示数据，提供用户界面

项目结构：

![image](https://s1.ax1x.com/2017/12/22/j3DwF.png)

- controller 控制层，从路由分离出来的业务逻辑函数
- database  数据库，数据库模型，数据库的设置
- public  存放公共文件  css，js，图片等
- routers  路由
- view 模板
- app.js  项目主文件

### 六. koa-ejs
koa-ejs是为koa框架设计的视图渲染中间件，支持所有的ejs的特点。
实际作用是用来从JSON数据中生成HTML字符串。

安装：`npm i -s koa-ejs`

应用：
```
const Koa = require('koa');
const render = require('koa-ejs');//引入koa-ejs
const path = require('path');//node自带的模块，用于处理文件与目录的路径
 
const app = new Koa();
//应用到koa实例app，并设置参数
render(app, {
  root: path.join(__dirname, 'view'),//试图根目录
  layout: 'template',//全局试图文件
  viewExt: 'html',//试图文件扩展名
  cache: false,//缓存已编译的模板：否
  debug: true//调试：是
});
 
app.use(async function (ctx) {
  await ctx.render('user');
});
 
app.listen(7001);
```
###### EJS的语法和功能：
1、缓存功能，能够缓存已经解析好的html模版；

2、`<% code %>`用于执行其中javascript代码。

如：`<% alert('hello world') %>`

3、`<%= code %>`会对code进行html转义，显示转义后的 HTML 内容

```
<h1><%=title %></h1>  //会把title存的值显示出来在h1中
<p><%= 'hello world'%></p> //会把hello world显示在p中
<h1><%= '<b>hello world</b>'%></h1> //会把加粗的hello world显示在h1中

    
```
4、`<%- code %>`将不会进行转义，显示原始 HTML 内容

5、支持自定义标签，比如'<%'可以使用'{{'，'%>'用'}}'代替； 
    ejs 里，默认的闭合标记是 <%  .. %>，我们也可以定义自己的标签。例如：
```
app.set("view options",{                                                                                  
   "open":"{{",                                                                                  
   "close":"}}"
});
```
6、提供一些辅助函数，用于模版中使用 

     1)、first，返回数组的第一个元素; 
     2)、last，返回数组的最后一个元素； 
     3)、capitalize，返回首字母大写的字符串； 
     4)、downcase，返回字符串的小写； 
     5)、upcase，返回字符串的大写； 
     6)、sort，排序（Object.create(obj).sort()？）； 
     7)、sort_by:'prop'，按照指定的prop属性进行升序排序； 
     8)、size，返回长度，即length属性，不一定非是数组才行；
     9)、plus:n，加上n，将转化为Number进行运算； 
     10)、minus:n，减去n，将转化为Number进行运算； 
     11)、times:n，乘以n，将转化为Number进行运算； 
    12)、divided_by:n，除以n，将转化为Number进行运算； 
    13)、join:'val'，将数组用'val'最为分隔符，进行合并成一个字符串； 
    14)、truncate:n，截取前n个字符，超过长度时，将返回一个副本 
    15)、truncate_words:n，取得字符串中的前n个word，word以空格进行分割； 
    16)、replace:pattern,substitution，字符串替换，substitution不提供将删除匹配的子串； 
    17)、prepend:val，如果操作数为数组，则进行合并；为字符串则添加val在前面； 
    18)、append:val，如果操作数为数组，则进行合并；为字符串则添加val在后面； 
    19)、map:'prop'，返回对象数组中属性为prop的值组成的数组； 
    20)、reverse，翻转数组或字符串； 
    21)、get:'prop'，取得属性为'prop'的值； 
    22)、json，转化为json格式字符串 

 7、利用`<%- include filename %>`加载其他页面模版； 
    

### 七. ORM框架--Sequelize
##### 1.什么是ORM？
简单的讲就是对SQL查询语句的封装，让我们可以用OOP的方式操作数据库，优雅的生成安全、可维护的SQL代码。直观上，是一种Model和SQL的映射关系。
##### 2.什么是Sequelize
Sequelize是一款基于Nodejs功能强大的异步ORM框架。
同时支持PostgreSQL, MySQL, SQLite and MSSQL多种数据库，很适合作为Nodejs后端数据库的存储接口，为快速开发Nodejs应用奠定扎实、安全的基础。
##### 3.应用
为了方便，可以在[MySQL官方网站](https://dev.mysql.com/downloads/installer/)下载并安装到本地

###### 应用到项目中：

安装：

```
npm i -s sequelize
npm i -s mysql
```


注意mysql是驱动，我们不直接使用，但是sequelize会用

database即数据库文件夹结构：

```
database
|
+——models    //数据库模型
|    |
|    +——lina-user.js
|    +——lina-topic.js
|    +——lina-reply.js
|    +——lina-message.js
|    +——lina-like.js
|
+——config.js  //数据库配置文件
|
+——sequelize.js  //数据库主文件
```
config.js

```
var config = {
    database: 'test', // 使用哪个数据库
    username: 'www', // 用户名
    password: 'www', // 口令
    host: 'localhost', // 主机名
    port: 3306 // 端口号，MySQL默认3306
};

module.exports = config;
```
sequelize.js
```
//导入ORM框架sequelize，即数据库操作模块
const Sequelize = require('sequelize');
//导入数据库配置文件
const config = require('./config');
//创建数据库连接
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

sequelize.sync();

console.warn('87687');
 
module.exports = sequelize;
```
在创建数据模型是需要引入sequelize（通过sequelize连接数据库，并在对应的数据库中创建数据库模型）;后台控制层一般只需要引入数据库模型就可以进行数据库的增查改删。

可以参阅Sequelize官网  [http://docs.sequelizejs.com/](http://docs.sequelizejs.com/)

### 八. 图片上传
##### 1. 读取本地文件 
使用input的type=file 控件,需要对其美化
```
  <input type="file" id="inpicture" style="display: none">//将读取文件的input元素隐藏
  <button type="button" class="file btn btn-primary  mt-3 btn-block" id="inpicture-i" onclick="inpicture.click()">
    选择文件
  </button>//设置关联读取文件input元素的button元素
```
##### 2. 裁剪 cropperjs
使用cropperjs中间件进行裁剪 [cropperjs--GitHub官网](https://github.com/fengyuanchen/cropperjs)

使用模式对话框作为剪裁的容器，并完成剪裁后的上传

[FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader) 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。

```
//选择图片后打开裁剪对话框
$("#inpicture").change(function () {
  var file = this.files[0];
  var reader = new FileReader();//实例化FileReader用来读取指定的file文件
  if (/image+/.test(file.type)) {//判断是否为图片格式
    reader.onload = function () {
      $("#dialog").dialog("open");//打开裁剪对话框
      $(".cut-container").empty();//清空裁剪对话框内容，防止多次选择添加多个图片
      $(".cut-container").append('<img src="' + this.result +
        '" style="max-width:500px;max-height:500px"/>');//this.result指reader的属性，result 属性包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容。
      $('.cut-container>img').cropper({
        aspectRatio: 1 / 1, //裁剪框比例
        viewMode: 1,//显示模式：裁剪框只能在图片内移动
        background: true//在容器上显示网格背景
      });

    }
    reader.readAsDataURL(file)
  }else{
    alert("请选择图片！");
  }
})
```

```
// 读取本地头像并剪裁上传
$("#dialog").dialog({
  autoOpen: false,
  width: 410,
  height: 510,
  buttons: {
    "确定上传头像": function () {
      var data = $('.cut-container>img').cropper('getCroppedCanvas');//获取裁剪后的头像（ getCroppedCanvas 输出canvas（裁剪框）的位置和尺寸大小。）
      upload(data);//点击确定上传头像按钮时调用上传函数
      $(this).dialog("close");
    }
  }
});
```
#####  3. 上传图片
 

 **上传头像前端脚本编码**

###### 使用的两个知识点
1. HTMLCanvasElement.[**toBlob()  方法**](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toBlob)创造Blob对象，用以展示canvas上的图片；这个图片文件可以被缓存或保存到本地，由用户代理端自行决定。如不特别指明，图片的类型默认为 image/png，分辨率为96dpi。
第三个参数用于针对image/jpeg格式的图片进行输出图片的质量设置。

1. 通过[**FormData对象**](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/Using_FormData_Objects/)可以组装一组用 XMLHttpRequest发送请求的键/值对。它可以更灵活方便的发送表单数据，因为可以独立于表单使用。如果你把表单的编码类型设置为multipart/form-data ，则通过FormData传输的数据格式和表单通过submit() 方法传输的数据格式相同

###### 前端脚本编码

```
// 上传头像
function upload(data) {
    data.toBlob(function (blob) {//HTMLCanvasElement.toBlob()将canvas图像转换为文件
    console.log(blob.size);
    if ((blob.size / 1024) > 1024) {
      alert('图片文件过大!请选择小于1M的头像');
      return;
    } else {
      var formData = new FormData();
      formData.append('files', blob);
      console.log(formData.get('files'));
      $.ajax({
        type: "post",
        url: '/upload', //用于文件上传的服务器端请求地址
        data: formData,
        processData: false,// 不处理数据
        contentType: false,// 不设置内容类型
        success: function (result) {
          if (result.result = false) {
            $('.error').show();//显示上传失败
            setTimeout(() => {
              $('.error').hide()
            }, 5000);
          } else {
            $('.success').show();//显示上传成功
            $(".container>img").attr("src", result.imageUrl);//更新设置区域头像
            $('.user_avatar>img').attr('src', result.imageUrl);//更新右侧用户信息头像
            setTimeout(() => {
              $('.success').hide()
            }, 5000);
          }
        }
      });
    }
  });
}
```
 **上传头像的后台编码**

###### 路由部分

```
//上传个人头像
router.post('/upload', koaBody({
  multipart: true,//解析multipart/form-data请求数据类型
  formLimit: 15,
  formidable: {
    uploadDir: 'public/upload',//上传的本地路径
    keepExtensions: true//保持后缀
  }
}),  inputimage);//调用函数



```
######  上传头像的函数
```
const uptoqiniu = require('./uptoqiniu')//引入[七牛云](https://developer.qiniu.com/kodo/sdk/1289/nodejs)配置文件

// 上传个人头像
const inputimage = async(ctx) => {
  console.log(ctx.request.body);
  var file = ctx.request.body.files.files;
  console.log(file.path);
  console.log(file.name);

  var displayUrl = file.path;
  let message = {};
  message.result = false;
  try {
    let upresult = await uptoqiniu.upload(displayUrl);//上传到七牛云
    fs.unlink(displayUrl, (err) => {
      if (err) {
        console.error(err);
      }
    });//fs.unlink()删除本地临时文件夹内的图片
    console.log(upresult);
    var qiniuUrl = "http://p0zgrt85b.bkt.clouddn.com/" + upresult.key;
    message.imageUrl = qiniuUrl;
    message.result = true;
    var username = ctx.session.name;
    var user = await User.findOne({
      where: {
        name: username
      }
    });
    user.update({
      headImgURL: qiniuUrl
    });//更新用户的头像url
    var topics = await Topic.findAll({
      where: {
        username: username
      }
    });
    console.log(topics);
    if (topics != []) {
      topics.forEach(function (t) {
        t.update({
          headImgURL: qiniuUrl
        });
      })
    };//更新用户创建的话题的头像url
    

    var replies = await Reply.findAll({
      where: {
        name: username
      }
    });
    if (replies != []) {
      replies.forEach(function (r) {
        r.update({
          headImgURL: qiniuUrl
        });
      })
    }//更新用户回复的头像url

    ctx.session.headImgURL = qiniuUrl;//更新session

  } catch (error) {
    console.log(error);
    message.result = false;
  }
  ctx.body = message;
  console.log(ctx.body)
};
```
###### 七牛云配置文件
[七牛云官网](https://developer.qiniu.com/kodo/sdk/1289/nodejs)
```
const qiniu = require("qiniu");
qiniu.conf.ACCESS_KEY = 'oNbPyw3D-xby_8PDtSilNEET-GxzmrhUeA6ROwDS';
qiniu.conf.SECRET_KEY = 'Ac4WfvyS3Jm9yuSvn-falSEHvffMITi7f01NnQ8m';
var fs = require('fs');

var config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0;// 空间对应的机房
config.useHttpsDomain = true;// 是否使用https域名

exports.upload = async(displayUrl) => {
  return new Promise(function (resolve, reject) {
    var accessKey = qiniu.conf.ACCESS_KEY;
    var secretKey = qiniu.conf.SECRET_KEY;
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    let bucket = 'lina-qiniuyun';
    var options = {
      scope: bucket,
      detectMime: 1,
      returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);

    // 文件上传
    var filePath = displayUrl;
    var localFile = displayUrl;
    var formUploader = new qiniu.form_up.FormUploader(config);
    console.log(formUploader);
    var putExtra = new qiniu.form_up.PutExtra();
    var key = '';
    formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr,
      respBody, respInfo) {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        console.log(respBody);
      } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
      }
      resolve(respBody);
    });

  })
}
```

 
