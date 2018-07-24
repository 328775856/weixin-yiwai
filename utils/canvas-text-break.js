// 记录换行次数
const CTB = ({
  type = 1,
  // 1.画在画布上
  // 2.简单的获取一些高度，换行次数属性而已，
  ctx,
  text,
  x,
  y,
  w,
  lh,
  fontStyle: {
    lineHeight = 60,
    textAlign = 'center',
    textBaseline = 'middle',
    font = '40px arial',
    fontSize = 40,
    fillStyle = 'FFFFFF'
  },
  // success = false
}) => {
  let breakNum = 0;
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  const chr = text.split('');
  const row = [];
  let temp = "";

  // 判断如果末尾是，！。》 就不要换行
  // 判断如果末尾是《 就不要换行
  for (let a = 0; a < chr.length; a++) {
    if (ctx.measureText(temp).width < w) { } else {
      breakNum++;
      if (/[，。！》]/im.test(chr[a])) {
        // console.log(`我是${chr[a]},我在末尾,我不换行`);
        temp += ` ${chr[a]}`;
        // 跳过这个符号 
        a++;
      }
      if (/[《]/im.test(chr[a - 1])) {
        // console.log(`我是${chr[a-1]},我在末尾,我要换行`);
        // 删除最后一个字符
        temp = temp.substr(0, temp.length - 1);
        a--;
      }

      row.push(temp);
      temp = "";
    }

    temp += chr[a] ? chr[a] : '';
  }
  row.push(temp);
  if (type == 1) {
    for (let b = 0; b < row.length; b++) {
      ctx.fillText(row[b], x, y + b * lineHeight);
    }
  }
  ctx.restore();

  const res = {
    breakNum,
    lineNum: breakNum + 1,
    lineHeight,
    height: (fontSize + 4) + lineHeight * breakNum
  };
  return new Promise((resolve, reject) => {
    resolve(res);
  });
}
export default CTB;