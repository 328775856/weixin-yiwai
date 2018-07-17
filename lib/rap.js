/**
 * 初始化rap参数
 */
let config = {
  rapApiHost: '', // RAP地址
  // RAP路由的工作模式 0:不拦截 1:拦截全部 2:黑名单中的项不拦截 3:仅拦截白名单中的项
  rapMode: 0,
  blackList: [], // 黑名单
  whiteList: [], // 白名单
}
const RAP = () => ({
  /**
   * 设置RAP地址
   * @param {string} data RAP地址
   */
  setRapApiHost(data) {
    config.rapApiHost = data;
  },
  rapApiHost() {
    return config.rapApiHost;
  },
  /**
   * 设置RAP路由的工作模式
   * @param {string} data RAP路由的工作模式
   */
  setMode(data) {
    config.rapMode = data;
  },
  mode() {
    return config.rapMode;
  },
  /**
   * 设置白名单
   * @param {Array} data 白名单数组
   */
  setWhiteList(data) {
    config.whiteList = data;
  },
  whiteList() {
    return config.whiteList;
  },
  /**
   * 设置白名单
   * @param {Array} data 黑名单数组
   */
  setBlackList(data) {
    config.blackList = data;
  },
  blackList() {
    return config.blackList;
  },
  /**
   * 外部获取处理后的请求地址
   * @param  {string} domain 域名
   * @param  {string} path   接口地址
   * @param  {string} params 参数
   * @return {string}        外部获取处理后的请求地址
   */
  apiUrl(domain, path, params) {
    const apiUrl = params ? `${ domain }/${ path }?${ params }` : `${ domain }/${ path }`;
    const rapApiUrl = params ? `${ config.rapApiHost }/${ path }?${ params }` : `${ config.rapApiHost }/${ path }`;
    if (config.rapMode === 0) {
      return apiUrl;
    } else if (config.rapMode === 1) {
      return rapApiUrl;
    } else if (config.rapMode === 2) {
      const blackMode = isInList(config.blackList, path);
      return blackMode ? apiUrl : rapApiUrl;
    } else {
      const whiteMode = isInList(config.whiteList, path);
      return whiteMode ? rapApiUrl : apiUrl;
    }
  }
});
/**
 * is in balck or white list
 * @param  {Array}  list  白名单或者黑名单数组
 * @param  {string}  url  接口地址
 * @return {Boolean}      是否存在白名单或者黑名单中
 */
function isInList(list, url) {
  if (list.length <= 0) return false;
  for (let i = 0; i < list.length; i++) {
    let o = list[i];
    // 判断url是否包含 '/数字/'
    // 判断o是否包含   '/:id/'
    if (/\d+/.test(url) && o.indexOf('/:') !== -1) {
      let str1 = '';
      let str2 = '';
      str1 = o.replace(/\/:.+?\//g, '/number/');
      str2 = url.replace(/\/[0-9]+?\//g, '/number/');
      str1 = str1.replace(/\/:.+?$/g, '/number');
      str2 = str2.replace(/\/[0-9]+?$/g, '/number');
      if (str1 == str2) {
        o = str1;
        url = str2;
        console.log('o ----------- : ' + o);
        console.log('url ----------- : ' + url);
      }
    }
    if (typeof o === 'string' && (url.indexOf(o) >= 0 || o.indexOf(url) >= 0)) {
      return true;
    } else if (typeof o === 'object' && o instanceof RegExp && o.test(url)) {
      return true;
    }
  }
  return false;
}
module.exports = RAP();