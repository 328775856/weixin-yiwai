import CTB from '../../utils/canvas-text-break';
import wxp from '../../lib/wx-promisify';
import {
  // getExhibitionTickets,
  getExhibition,
  setCustomerTicket
} from './exhibitionTicket.service';
let ctx = null;

Page({

  data: {
    isShowSaveBtn: false,
    isShowLogo: false,
    cardCreateImgUrl: '',

    WIDTH: 600,
    HEIGHT: 1044,

    id: 0,

    image: '',
    exhibitionId: 0,
    exhibitionName: '',
    exhibitionStartTime: '',
    exhibitionEndTime: '',
    place: '',
    price: 0,
    primeCost: 0,
    discount: 0,

    // 字体高度
    bkh1: 0,
    bkh2: 0,
  },

  onLoad(options) {
    wx.showLoading({
      title: '图片加载中...',
    });
    const {
      // 展览id
      id,
      // 展览券id 用来生成展券添加到展券列表
      ticketsId,
      // 打折
      discount,
    } = options;
    this.setData({
      // 展览id
      id,
      ticketsId,
      discount,
    });
    // this.setData({
    //   image: 'https://img.kanhua.yiwaiart.com/ttt/1.jpg',
    //   exhibitionId: 1,
    //   exhibitionName: '“卢浮宫·古希腊之光”主题展““卢浮宫·古希腊之光”主题展““卢浮宫·古希腊之光”主题展““卢浮宫·古希腊之光”主题展““卢浮宫·古希腊之光”主题展““卢浮宫·古希腊之光”主题展““卢浮宫·古希腊之光”主题展““卢浮宫·古希腊之光”主题展““卢浮宫·古希腊之光”主题展““卢浮宫·古希腊之光”主题展““卢浮宫·古希腊之光”主题展““卢浮宫·古希腊之光”主题展““卢浮宫·古希腊之光”主题展““卢浮宫·古希腊之光”主题展““卢浮宫·古希腊之光”主题展““卢浮宫·古希腊之光”主题展““卢浮宫·古希腊之光”主题展“',
    //   exhibitionStartTime: '2018-02-05 15:07:43',
    //   exhibitionEndTime: '2018-02-05 15:07:43',
    //   place: '软件园二期软',
    //   price: '998',
    //   discount: 8.8
    // });
    let {
      WIDTH,
      HEIGHT
    } = this.data;

    let TOP_H = 692;

    let TOP = {
      w: WIDTH,
      h: TOP_H,
      x: 0,
      y: 0,
    }


    let POINT = {
      w: 513,
      h: 10,
      x: (WIDTH - 513) / 2,
      y: TOP_H - 35 - 10 / 2
    }

    let POSTER = {
      w: WIDTH - 10 - 10,
      h: TOP_H - 10 - 35,
      x: 10,
      y: 10
    };

    ctx = wx.createCanvasContext('myCanvas');

    getExhibition({ exhibitionId: id }).then(({ code, data: {
      image,
      exhibitionName,
      exhibitionStartTime,
      exhibitionEndTime,
      place,
      price
    } }) => {
      if (code == '10000') {
        this.setData({
          image,
          exhibitionName,
          exhibitionStartTime,
          exhibitionEndTime,
          place: place || '',
          price: price || 0
        });
        return wxp.getImageInfo({
          src: 'https://img.kanhua.yiwaiart.com/ttt/up_v1.png',
        });
      }

    }).then(res => {
      const {
        exhibitionName,
        place
      } = this.data;
      // 开始写内容
      CTB({
        type: 2,
        ctx,
        text: exhibitionName,
        x: 30,
        y: 735,
        w: 530,
        fontStyle: {
          lineHeight: 52,
          textAlign: 'left',
          textBaseline: 'top',
          font: 'normal bold 32px arial',
          fontSize: 32,
          fillStyle: '#333333'
        }
      }).then(({
        breakNum,
        lineNum,
        lineHeight,
        height
      }) => {
        const oldH = (32 + 4) + 52 * 2;
        // 65为间隔
        let h = 0;
        let bkh1 = 0
        if (lineNum > 2) {
          h = HEIGHT + height - oldH + 65;
          bkh1 = height - oldH + 65;
        } else {
          h = HEIGHT;
          bkh1 = 0;
        }
        this.setData({
          HEIGHT: h,
          bkh1
        });
        return CTB({
          type: 2,
          ctx,
          text: place,
          x: 62,
          y: HEIGHT - (162 - 24 - 20),
          w: 350,
          fontStyle: {
            lineHeight: 44,
            textAlign: 'left',
            textBaseline: 'top',
            font: 'normal 26px arial',
            fontSize: 26,
            fillStyle: '#808080'
          }
        })
      }).then(({
        breakNum,
        lineNum,
        lineHeight,
        height
      }) => {
        const {
          HEIGHT,
        } = this.data;

        const oldH = (26 + 4) + 44 * 1;
        // 44为间隔

        let h = 0;
        let bkh2 = 0;
        if (lineNum > 1) {
          h = HEIGHT + height - oldH + 44;
          bkh2 = height - oldH + 44;
        } else {
          h = HEIGHT;
          bkh2 = 0;
        }
        this.setData({
          HEIGHT: h,
          bkh2
        });

        // 画底部
        ctx.setFillStyle('#fff');
        ctx.fillRect(0, TOP_H, WIDTH, h - TOP_H);

      });


      // 画头部图片
      ctx.drawImage(res.path, TOP.x, TOP.y, TOP.w, TOP.h);

      return wxp.getImageInfo({
        src: this.data.image,
        // src: 'https://img.kanhua.yiwaiart.com/eyadmin/696c1404-05f8-4204-a77c-ded337f353ec.png',
      });
    }).then((res) => {

      const {
        exhibitionName
      } = this.data;

      CTB({
        ctx,
        text: exhibitionName,
        x: 30,
        y: 735,
        w: 530,
        fontStyle: {
          lineHeight: 52,
          textAlign: 'left',
          textBaseline: 'top',
          font: 'normal bold 32px arial',
          fontSize: 32,
          fillStyle: '#333333'
        }
      });


      ctx.save();


      const r = 35;
      const interval = 10;
      ctx.moveTo(interval, interval);

      let x1 = r, //控制点1的x坐标 
        y1 = TOP_H - 70 - 10, //控制点1的y 
        x2 = r, //控制点2的x 
        y2 = y1 + r, //控制点2的y 
        x = y1, //终点x 
        y = y1 + r; //终点y 
      ctx.lineTo(interval, y1); //起点 
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(0,0,0,0)";
      // ctx.strokeStyle = "#000"
      ctx.quadraticCurveTo(45, TOP_H - 75, 47, TOP_H - 35);
      // ctx.bezierCurveTo(x1, y1, x2, y2, x, y);
      // ctx.bezierCurveTo(60, TOP_H - 70 - 10, 60, TOP_H + 10, 0, TOP_H + 10);

      // ctx.lineTo(WIDTH, TOP_H + 10); //起点 
      ctx.lineTo(WIDTH - 47, TOP_H - 35); //起点 
      ctx.quadraticCurveTo(WIDTH - 45, TOP_H - 75, WIDTH - 10, TOP_H - 80);

      // ctx.bezierCurveTo(WIDTH - 60, TOP_H + 10, WIDTH - 60, TOP_H - 70 - 10, WIDTH, TOP_H - 70 - 10);
      // ctx.bezierCurveTo(WIDTH - 60, TOP_H + 10, WIDTH - 60, TOP_H - 70 - 10, WIDTH, TOP_H - 70 - 10);

      ctx.lineTo(WIDTH - interval, interval);
      ctx.closePath();
      ctx.stroke();
      ctx.clip();

      // 画海报
      // 计算海报宽高 
      const tempH = TOP_H - 35;
      const scale1 = res.width / res.height;
      const scale2 = WIDTH / tempH;
      let drawW = 0, drawH = 0, mt = 0, ml = 0;
      if (scale1 > scale2) {
        drawH = tempH;
        drawW = tempH * scale1;
        ml = (WIDTH - drawW) / 2;
      } else {
        drawW = WIDTH;
        drawH = drawW / scale1;
        mt = (tempH - drawH) / 2;
      }
      // ctx.drawImage(res.path, POSTER.x, POSTER.y, POSTER.w, POSTER.h);
      // ctx.drawImage(res.path, POSTER.x, POSTER.y, 596, 937);
      ctx.drawImage(res.path, ml, mt, drawW, drawH);
      // ctx.drawImage(res.path, POSTER.x, POSTER.y, res.width, res.height);
      ctx.restore();

      return wxp.getImageInfo({
        src: 'https://img.kanhua.yiwaiart.com/ttt/point.png',
      });
    }).then((res) => {
      // 画点点
      ctx.drawImage(res.path, POINT.x, POINT.y, POINT.w, POINT.h);
      // 画图标
      return Promise.all([
        wxp.getImageInfo({
          src: 'https://img.kanhua.yiwaiart.com/ttt/EY_icon_time@2x.png',
        }),
        wxp.getImageInfo({
          src: 'https://img.kanhua.yiwaiart.com/ttt/EY_icon_adress@2x.png',
        }),
        wxp.getImageInfo({
          src: 'https://img.kanhua.yiwaiart.com/ttt/EY_icon_money@2x.png',
        }),
        wxp.getImageInfo({
          // src: 'https://img.kanhua.yiwaiart.com/ttt/EY_img_erweima@2x.png',
          src: 'https://img.kanhua.yiwaiart.com/ttt/EY_img_erweima@3x.png',
        }),
      ])
    }).then(([res1, res2, res3, res4]) => {

      // 获取画布的高度

      const {
        HEIGHT
      } = this.data;

      const {
        exhibitionStartTime,
        exhibitionEndTime,
        place,
        price,
        discount,

        bkh1,
        bkh2
      } = this.data;

      const words_price = `￥${price}`;
      const words_discount = `（意外专属${discount}折券）`;

      // ctx.drawImage(res1.path, 25, HEIGHT - 160, 25, 24);
      // ctx.drawImage(res2.path, 26, HEIGHT - (160 - 24 - 20), 22, 25);
      // ctx.drawImage(res3.path, 25, HEIGHT - (160 - 24 - 20 - 25 - 20), 24, 24);
      // ctx.drawImage(res4.path, 456, HEIGHT - 160, 111, 111);

      ctx.drawImage(res1.path, 25, bkh1 + 880, 25, 24);
      ctx.drawImage(res2.path, 26, bkh1 + 880 + 24 + 20, 22, 25);
      ctx.drawImage(res3.path, 25, bkh1 + bkh2 + 880 + 24 + 20 + 25 + 20, 24, 24);
      ctx.drawImage(res4.path, 456, bkh1 + 880, 111, 111);
      // 标题对应内容
      ctx.save();
      ctx.font = 'normal 26px arial';
      ctx.fillStyle = '#808080';
      ctx.textBaseline = 'top';


      ctx.fillText(`${(exhibitionStartTime.split(' ')[0]).replace(/-/g, '.')}~${(exhibitionEndTime.split(' ')[0]).replace(/-/g, '.')}`, 62, bkh1 + 878);

      CTB({
        type: 1,
        ctx,
        text: place,
        x: 62,
        y: bkh1 + 878 + 24 + 20,
        w: 350,
        fontStyle: {
          lineHeight: 44,
          textAlign: 'left',
          textBaseline: 'top',
          font: 'normal 26px arial',
          fontSize: 26,
          fillStyle: '#808080'
        }
      }).then(({
        breakNum,
        lineNum,
        lineHeight,
        height
      }) => {

      });

      ctx.fillText(words_price, 62, bkh1 + bkh2 + 878 + 24 + 20 + 25 + 20);

      // ctx.fillText(`2018.01.01 ~2018.06.01`, 62, 878);
      // ctx.fillText(`xxxx艺术馆`, 62, 878 + 24 + 20);
      // ctx.fillText(`￥100.9`, 62, 878 + 24 + 20 + 25 + 20);


      const w1 = ctx.measureText(words_price).width;
      const w2 = ctx.measureText(words_discount).width;
      ctx.save();

      ctx.fillStyle = '#333333';
      ctx.fillText(words_discount, 62 + w1, bkh1 + bkh2 + 878 + 24 + 20 + 25 + 20);

      ctx.beginPath();
      ctx.moveTo(62 + w1, bkh1 + bkh2 + 878 + 24 + 20 + 25 + 20 + 30);
      ctx.lineTo(62 + w1 + w2, bkh1 + bkh2 + 878 + 24 + 20 + 25 + 20 + 30);
      ctx.stroke();
      ctx.restore();

      ctx.restore();




    }).then(() => {
      ctx.draw(false, () => {
        setTimeout(() => {
          this.setData({ isShowLogo: true });

          // 调用生成图片的接口
          const postData = {
            customerId: wx.getStorageSync('user').id,
            ticketsId: this.data.ticketsId
          };
          setCustomerTicket(postData);

          wx.hideLoading();

          // 生成图片
          wxp.canvasToTempFilePath({
            canvasId: 'myCanvas',
          }).then(({
            tempFilePath
          }) => {
            this.setData({
              cardCreateImgUrl: tempFilePath
            });
          })
        }, 1000);
      });

    });

  },

  onShow() {

  },
  saveImg() {

    // 画上logo 会有裁剪的现象
    wx.showLoading({
      title: '保存中...',
      mask: true
    });

    this.drawLogo(() => {
      this.setData({ isShowLogo: false });
      const {
      cardCreateImgUrl
    } = this.data
      wx.saveImageToPhotosAlbum({
        filePath: cardCreateImgUrl,
        success() {
          wx.showToast({
            title: '保存成功！',
            icon: 'success'
          });
        },
        fail(err) {
          wx.hideLoading();
          if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
            // console.log("用户一开始拒绝了，我们想再次发起授权")
            // console.log('打开设置窗口')
            wx.openSetting({
              success(res) {
                if (res.authSetting['scope.writePhotosAlbum']) {
                  // console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                } else {
                  // console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                }
              }
            })
          }
        }
      });

    });

  },
  drawLogo(fn) {
    wxp.getImageInfo({
      src: 'https://img.kanhua.yiwaiart.com/ttt/EY_img_youcuo@2x.png',
    }).then((res) => {
      ctx.drawImage(res.path, 386, 30, 287, 187);
      ctx.draw(true, () => {
        setTimeout(() => {
          // 生成图片
          wxp.canvasToTempFilePath({
            canvasId: 'myCanvas',
          }).then(({
            tempFilePath
          }) => {
            this.setData({
              cardCreateImgUrl: tempFilePath
            });

            if (fn) fn();

          })
        }, 1000);
      });
    });
  },
  bindload() {
    this.setData({ isShowSaveBtn: true });
  },

})