var cacheFolder = 'public/upload/';
var path = require('path');
var userDirPath = cacheFolder;
var username = ctx.params.name;
console.log(username);
if (!fs.existsSync(userDirPath)) {
  fs.mkdirSync(userDirPath);
}
var form = new formidable.IncomingForm(); //创建上传表单
form.encoding = 'utf-8'; //设置编辑
form.uploadDir = userDirPath; //设置上传目录
form.keepExtensions = true; //保留后缀
form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
form.type = true;
var displayUrl;
form.parse(ctx.req, function (err, fields, files) {
  var filesName = files.files.name;
  var filesType = files.files.type;
  var patt = new RegExp(/(gif|jpg|jpeg|bmp|png)$/, "i");
  if (patt.exec(filesName)) {
    var exName = patt.exec(filesName)[0];
  }
  var oldPath = files.files.path;
  var reg = new RegExp(/^public\\/);
  displayUrl = oldPath.replace(reg, "");
  console.log(displayUrl);

  ctx.res.end(util.inspect({
    fields: fields,
    files: files
  }));

});
console.log(displayUrl);



  var reg = new RegExp(/^public\\/);
  displayUrl = displayUrl.replace(reg, "");
  console.log(displayUrl);
  // 更新该用户数据库记载的的头像url
  var username = ctx.session.name;
  var user = await User.findOne({
    where: {
      name: username
    }
  });
  user.update({
    headImgURL: displayUrl
  });
  var topics = await Topic.findAll({
    where: {
      username: username
    }
  });
  console.log(topics);
  if (topics != []) {
    topics.forEach(function (t) {
      t.update({
        headImgURL: displayUrl
      });
    })
  };

  var replies = await Reply.findAll({
    where: {
      name: username
    }
  });
  if (replies != []) {
    replies.forEach(function (r) {
      r.update({
        headImgURL: displayUrl
      });
    })
  }

  ctx.session.headImgURL = displayUrl;
  ctx.body = displayUrl;