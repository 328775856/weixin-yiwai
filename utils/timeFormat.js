/**
   * @param {time} 时间 数据库返回的为 2017-12-02 14:15:10
   * 时间显示说明：
   *  x ≤10 分钟  显示为刚刚
   * 10分钟< X  显示：月-日  时-分
   * 小于 当年 显示：年（后两位）-月-日
   */
const timeFormat = (t) => {
  const zeroize = (n) => (n < 10 ? `0${n}` : n);
  // // 兼容IOS
  t = t.replace(/-/g, '/');
  var date1 = new Date(t);
  // 当前的时间戳
  var date2 = new Date();

  var s1 = date1.getTime(),
    s2 = date2.getTime();
  var total = (s2 - s1) / 1000;

  var day = parseInt(total / (24 * 60 * 60));//计算整数天数
  var afterDay = total - day * 24 * 60 * 60;//取得算出天数后剩余的秒数
  var hour = parseInt(afterDay / (60 * 60));//计算整数小时数
  var afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60;//取得算出小时数后剩余的秒数
  var min = parseInt(afterHour / 60);//计算整数分
  var afterMin = total - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60;//取得算出分后剩余的秒数

  // 小于 当年 显示：年（后两位）-月-日
  if (date1.getFullYear() < date2.getFullYear()) {
    return `${date1.getFullYear()}-${zeroize(date1.getMonth() + 1)}-${zeroize(date1.getDate())}`;
  }
  // 等于当年
  else if (date1.getFullYear() == date2.getFullYear()) {
    // 判断同月同日
    if (day == 0 && hour == 0) {
      // 大于10分钟  显示：月 - 日  时- 分
      if (min < 10) {
        return '刚刚';
      } else {
        return `${zeroize(date1.getMonth() + 1)}-${zeroize(date1.getDate())} ${zeroize(date1.getHours())}:${zeroize(date1.getMinutes())}`;
      }
    } else {
      return `${zeroize(date1.getMonth() + 1)}-${zeroize(date1.getDate())} ${zeroize(date1.getHours())}:${zeroize(date1.getMinutes())}`;
    }
  }
}
export default timeFormat;