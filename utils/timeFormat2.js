/**
 *  1，今天 x < 10 分钟显示：刚刚
 *  2，今天 显示 今天
 *  3，昨天 显示 昨天
 *  4，昨天 < X < 今年：显示 x月x日
 *  5，< 当年：显示 x年x月x日
 */
const timeFormat2 = (t) => {
  // debugger;
  const zeroize = (n) => (n < 10 ? `0${n}` : n);
  // // 兼容IOS
  t = t.replace(/-/g, '/');
  var date1 = new Date(t);
  // 当前的时间戳
  var date2 = new Date();
  const tempDate2 = new Date();

  var s1 = date1.getTime(),
    s2 = date2.getTime();
  var total = (s2 - s1) / 1000;

  var day = parseInt(total / (24 * 60 * 60));//计算整数天数
  var afterDay = total - day * 24 * 60 * 60;//取得算出天数后剩余的秒数
  var hour = parseInt(afterDay / (60 * 60));//计算整数小时数
  var afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60;//取得算出小时数后剩余的秒数
  var min = parseInt(afterHour / 60);//计算整数分
  var afterMin = total - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60;//取得算出分后剩余的秒数

  // 小于 当年 显示：年-月-日
  if (date1.getFullYear() < date2.getFullYear()) {
    return `${date1.getFullYear()}年${zeroize(date1.getMonth() + 1)}月${zeroize(date1.getDate())}日`;
  }
  // 等于当年
  else if (date1.getFullYear() == date2.getFullYear()) {
    // 判断是否昨天  显示 昨天
    tempDate2.setDate(date2.getDate() - 1);
    if (date1.getMonth() == date2.getMonth() && tempDate2.getDate() == date1.getDate()) {
      return '昨天';
    }
    // 判断今天
    else if (day == 0) {
      // 小于10分钟  显示 刚刚
      if (hour == 0 && min < 10) {
        return '刚刚';
      }
      // 大于10分钟  显示 今天
      else {
        return '今天';
      }
    }
    // 判断前天或者之前  显示 x月x日
    else {
      return `${zeroize(date1.getMonth() + 1)}月${zeroize(date1.getDate())}日`;
    }
  }

};
export default timeFormat2;