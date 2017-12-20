 
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