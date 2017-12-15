const qiniu = require("qiniu");
qiniu.conf.ACCESS_KEY = 'oNbPyw3D-xby_8PDtSilNEET-GxzmrhUeA6ROwDS';
qiniu.conf.SECRET_KEY = 'Ac4WfvyS3Jm9yuSvn-falSEHvffMITi7f01NnQ8m';
var fs = require('fs');
var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z0;
// 是否使用https域名
config.useHttpsDomain = true;
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
    var key = '';
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