import Promise from '../lib/es6-promise.min';
import wxp from '../lib/wx-promisify';
import RAP from '../lib/rap';
import cf from '../config';

// 1为rap,0为真实地址
let mode = 0;
let apiVersion = 'v1';
// 接口地址组装
const urlFor = (path, params = {}) => {
  let ps = '';
  if (params) {
    ps += Object.keys(params).map(key => `${key}=${params[key]}`);
  }

  ps = ps.split(',');
  ps = ps.join('&');

  /**
   * 配置RAP
   */
  RAP.setRapApiHost('http://rap.daily.feibo.cc/mockjsdata/29');
  RAP.setMode(mode);
  RAP.setWhiteList([]);
  RAP.setBlackList([]);

  return RAP.apiUrl(cf.apiHost, path, ps);
};

const request = () => ({
  get(path, data, header = {}) {
    return baseRequest(path, data, header, 'GET');
  },

  post(path, data, header = {}) {
    // 由于是aws,所以data需要再封装一层 {data:data}
    let d;
    if (mode == 0) {
      d = { data };
    }
    return baseRequest(path, d, header, 'POST');
  },

  put(path, data, header = {}) {
    return baseRequest(path, data, header, 'PUT');
  },

  delete(path, data, header = {}) {
    return baseRequest(path, data, header, 'DELETE');
  },

  http(config) {
    return wxp.request(config);
  },
});

function baseRequest(path, data, header, method) {
  let params = data;

  if (method === 'POST' || method === 'DELETE') {
    params = null;
  }

  if (method === 'GET' || method === 'DELETE') {
    data = {};
  }
  // 真实环境接口名加版本号
  let p = mode == 0 ? `${path}/${apiVersion}` : `${path}`;

  return wxp.request({
    url: urlFor(p, params),
    method,
    data
  })
    // response 拦截返回参数
    .then((d) => {
      // debugger;
      // console.log(d);
      // rap环境下
      if (mode == 1) {
        let { data } = d;
        return data;
      }
      // 真实环境下
      let { data: { data: { result } } } = d;
      let res = JSON.parse(result);
      return res;
    }, (res) => {
      if (res.errMsg && res.errMsg == 'request:fail timeout') {
        console.log('网络超时');
      }
      // 这里全局判断接口出错
      return Promise.reject(res);
    });
}

export default request();
