const CTV = ({
  type = 1,
  // 1.画在画布上
  // 2.简单的获取一些高度，换行次数属性而已，
  ctx,
  text,
  x,
  y,
  fontStyle: {
    lineHeight = 60,
    textAlign = 'center',
    textBaseline = 'top',
    font = 'normal 40px arial',
    fontSize = 40,
    fillStyle = '#000'
  },
}) => {
  if (type == 1) {
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;

    for (let i = 0; i < text.length; i++) {
      if (text[i] == 'E') {
        const r = (fontSize / 16.8).toFixed(2);
        const circle_LH = r * 2 * 3;
        for (let j = 0; j < 3; j++) {
          // 画三个圆圈点 作为省略号
          ctx.beginPath();
          ctx.arc(x, y + i * lineHeight + circle_LH * (j + 1), r, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.setFillStyle('#000');
          ctx.fill();
        }
      } else
        ctx.fillText(text[i], x, y + i * lineHeight);
    }
    ctx.restore();
  }

  const res = {
    height: lineHeight * text.length
  };
  return new Promise((resolve, reject) => {
    resolve(res);
  });
}
export default CTV;