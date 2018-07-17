
import request from './request';
import qiniuUploader from '../lib/qiniu/qiniuUploader';

/*
  参数            备注
  @tempFilePath  小程序的图片的临时路径
  @callback      七牛图片上传成功的回调
*/
const qiniuUpfile = (tempFilePath, callback) => {
  // 请求七牛接口获取token
  request.post('getQNToken').then(({ data, code }) => {
    console.log(data);
    console.log(code);
    if (+code === 10000) {
      const uptoken = data.uptoken;
      // 七牛配置,上传图片到七牛服务器获得图片地址
      qiniuUploader.upload(tempFilePath, (res) => {
        callback(res);
      }, (error) => {
        console.log(error, '上传失败了')
      }, {
          uploadURL: 'https://up-z2.qbox.me',
          domain: 'https://img.kanhua.yiwaiart.com/',
          uptoken: uptoken
        });
    }
  }, (error) => {
    console.log('获取token出错', error);
  });
};

export default qiniuUpfile;


