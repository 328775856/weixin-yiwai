import CTB from '../../utils/canvas-text-break';
import CTV from '../../utils/canvas-text-vertical';
import wxp from '../../lib/wx-promisify';
let ctx = null;


import {
  getProductDetails,
  getCommentInfo
} from './poster.service';
Page({

  data: {
    NEW_WIDTH: 750 + 40,
    NEW_HEIGHT: 1148 + 40,

    WIDTH: 750,
    HEIGHT: 1148,
    windowWidth: 0,
    windowHeight: 0,

    commentId: 0,
    customerId: 0,
    productId: 0,
    productDetails: null,

    /* 
       1为 id为偶数用户
       2为 id为奇数用户 
     */
    saveType: 1,

  },

  onLoad(options) {
    const {
      productId,
      commentId
    } = this.options;
    const {
      id
    } = wx.getStorageSync('user');
    this.setData({
      productId,
      commentId: commentId || 0
    });

    let windowWidth = 0;
    let windowHeight = 0;
    wx.getSystemInfo({
      success(res) {
        windowWidth = res.windowWidth;
        windowHeight = res.windowHeight;
      }
    });
    this.setData({
      windowWidth,
      windowHeight
    });

    // 要写在微信小程序后台统计点击事件
    // id为偶数调用draw1
    if (id % 2 == 0) {
      this.draw1();
      this.setData({ saveType: 1 });
    }
    else {
      this.draw2();
      this.setData({ saveType: 2 });
    }
  },
  // 横板
  draw1() {
    wx.showLoading({
      title: '图片加载中...',
    });
    const {
      WIDTH,
      HEIGHT,
      customerId,
      productId
    } = this.data;
    ctx = wx.createCanvasContext('myCanvas');

    ctx.translate(20, 20);
    // 画白色背景
    ctx.save();
    ctx.setFillStyle('#fff');
    ctx.setShadow(0, 0, 15, 'rgba(4, 0, 0, 0.3)');
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();


    const postData = {
      customerId,
      productId
    };

    Promise
      .all([this.getProductDetails(), this.getCommentInfo()])
      .then(([res1, res2]) => {
        let data = res1;
        this.setData({
          productDetails: data
        });
        if (res2 != '') this.setData({ 'productDetails.proQuestion': res2 });

        // 写头部字
        ctx.save();
        ctx.font = 'normal 42px arial';
        ctx.fillStyle = '#000000';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';

        // 判断超过 用省略号
        let name = data.name;
        // let name = '煎饼磨坊的舞会舞会舞会';
        name = name.length > 7 ? `${name.substr(0, 7)}...` : name;
        ctx.fillText(name, WIDTH / 2, 93);
        // ctx.fillText('煎饼磨坊的舞会舞会', WIDTH / 2, 93);
        ctx.restore();

        ctx.save();
        ctx.font = 'normal 26px arial';
        ctx.fillStyle = '#000000';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';

        let artistName = data.artistName;
        // let artistName = '皮埃尔-奥古斯特·雷诺阿雷诺阿';
        // let name = '煎饼磨坊的舞会舞会舞会';
        artistName = artistName.length > 12 ? `${artistName.substr(0, 12)}...` : artistName;
        ctx.fillText(artistName, WIDTH / 2, 160);
        ctx.restore();

        return wxp.getImageInfo({
          // 七牛云做压缩
          src: `${data.imageUrl}?imageView2/1/w/621/h/668/q/50`,
        })
      }).then((res) => {
        const {
        productDetails
      } = this.data;
        // 计算海报宽高 
        const scale1 = res.width / res.height;
        const scale2 = 621 / 668;
        let drawW = 0,
          drawH = 0,
          mt = 0,
          ml = 0;
        if (scale1 > scale2) {
          drawH = 668;
          drawW = 668 * scale1;
          ml = (621 - drawW) / 2;
        } else {
          drawW = WIDTH;
          drawH = drawW / scale1;
          mt = (668 - drawH) / 2;
        }

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,0,0,0)";
        ctx.rect(66, 251, 621, 668);
        ctx.closePath();
        ctx.stroke();

        ctx.clip();
        // 画作品图片
        ctx.drawImage(res.path, ml + 66, mt + 251, drawW, drawH);
        ctx.restore();


        // 判断超过截取
        let proQuestion = productDetails.proQuestion || '';
        let regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
        proQuestion = proQuestion.replace(regStr, '');
        // let proQuestion = '😑😑l love it我是一个粉刷匠,粉刷本领强粉刷本领强粉刷本领强粉刷本领强粉刷本领强粉刷本领强粉刷本领强粉刷本领强粉刷本领强粉刷本领强粉刷本领强粉刷本领强粉刷本领强粉刷本领强粉刷本领强粉刷本领强粉刷本领强';
        proQuestion = proQuestion.length > 32 ? `${proQuestion.substr(0, 32)}...` : proQuestion;

        // 写问题
        CTB({
          type: 1,
          ctx,
          text: proQuestion,
          // 超过32个字就截断
          x: 64,
          y: 988,
          w: 350,
          fontStyle: {
            lineHeight: 39,
            textAlign: 'left',
            textBaseline: 'top',
            font: 'normal 23px arial',
            fontSize: 23,
            fillStyle: '#000000'
          }
        });

        // 画日期前面的圆
        ctx.save();
        ctx.beginPath();
        ctx.arc(WIDTH - 210, 991 + 14, 10, 0, 2 * Math.PI);
        ctx.closePath();

        ctx.setFillStyle('#FFDC00');
        ctx.fill();

        ctx.restore();
        // 写日期
        ctx.save();
        ctx.font = 'normal 25px arial';
        ctx.fillStyle = '#1D1D1D';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'right';
        ctx.fillText(this.getToday(), WIDTH - 63, 991);
        ctx.restore();

        // 写分享来自@
        ctx.save();
        ctx.font = 'bold 25px arial';
        ctx.fillStyle = '#000000';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'right';
        const {
        nickName
      } = wx.getStorageSync('user');
        ctx.fillText(`分享自 @${nickName}`, WIDTH - 63, 1065);
        ctx.restore();

        return wxp.getImageInfo({
          src: 'https://img.kanhua.yiwaiart.com/miniApp/activity/EY_img_erweima@2x.png',
        });
      }).then((res) => {
        // 画logo
        ctx.drawImage(res.path, WIDTH - 190, 77, 190, 147);
        ctx.draw(false, () => {
          // 生成图片
          wxp.canvasToTempFilePath({
            canvasId: 'myCanvas',
          }).then(({
          tempFilePath
        }) => {
            // wx.hideLoading();
            this.setData({
              cardCreateImgUrl: tempFilePath
            });
          });

        });
      });
  },
  // 竖板
  draw2() {
    wx.showLoading({
      title: '图片加载中...',
    });
    const {
      WIDTH,
      HEIGHT,
      customerId,
      productId
    } = this.data;
    ctx = wx.createCanvasContext('myCanvas');

    ctx.translate(20, 20);
    // 画白色背景
    ctx.save();
    ctx.setFillStyle('#fff');
    ctx.setShadow(0, 0, 15, 'rgba(4, 0, 0, 0.3)');
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();


    Promise
      .all([this.getProductDetails(), this.getCommentInfo()])
      .then(([res1, res2]) => {
        let data = res1;

        this.setData({
          productDetails: data
        });
        if (res2 != '') this.setData({ 'productDetails.proQuestion': res2 });
        return wxp.getImageInfo({
          src: `${data.imageUrl}?imageView2/1/w/531/h/1102/q/50`,
        })
      }).then((res) => {
        const {
        productDetails
      } = this.data;
        // 计算海报宽高 
        const scale1 = res.width / res.height;
        const scale2 = 531 / 1102;
        let drawW = 0,
          drawH = 0,
          mt = 0,
          ml = 0;
        if (scale1 > scale2) {
          drawH = 1102;
          drawW = 1102 * scale1;
          ml = (531 - drawW) / 2;
        } else {
          drawW = WIDTH;
          drawH = drawW / scale1;
          mt = (1102 - drawH) / 2;
        }

        // 画作品图片
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,0,0,0)";
        ctx.rect(197, 23, 531, 1102);
        ctx.closePath();
        ctx.stroke();
        ctx.clip();
        console.log(ml + 197, 'ml');
        ctx.drawImage(res.path, ml + 197, mt + 23, drawW, drawH);
        // ctx.drawImage(res.path, ml , mt , drawW, drawH);
        ctx.restore();

        // 写字 
        // 作品名称
        let text1 = productDetails.name,
          // let text1 = '蒙娜丽莎的微小诶',
          isOverLen1 = false;
        if (text1.length > 6) {
          isOverLen1 = true;
          text1 = `${text1.substr(0, 6)}E`;
        }
        CTV({
          type: 2,
          ctx,
          text: text1,
          x: 58 + 20,
          y: 0,
          fontStyle: {
            lineHeight: 42 + 4,
            textAlign: 'center',
            textBaseline: 'top',
            font: 'normal 42px arial',
            fontSize: 42,
            fillStyle: '#000'
          },
        }).then(({
        height
      }) => {
          CTV({
            type: 1,
            ctx,
            text: text1,
            x: 58 + 20,
            y: 380 - 30 - height,
            fontStyle: {
              lineHeight: 42 + 4,
              textAlign: 'center',
              textBaseline: 'top',
              font: 'normal 42px arial',
              fontSize: 42,
              fillStyle: '#000'
            },
          });
        });

        // 作者
        let text2 = productDetails.artistName,
          // let text2 = '文森特',
          isOverLen2 = false;
        if (text2.length > 8) {
          isOverLen2 = true;
          text2 = `${text2.substr(0, 8)}E`;
        }
        CTV({
          type: 2,
          ctx,
          text: text2,
          x: 112 + 12,
          y: 0,
          fontStyle: {
            lineHeight: 26 + 2,
            textAlign: 'center',
            textBaseline: 'top',
            font: 'normal 26px arial',
            fontSize: 26,
            fillStyle: '#000'
          },
        }).then(({
        height
      }) => {
          CTV({
            type: 1,
            ctx,
            text: text2,
            x: 112 + 12,
            y: 380 - 30 - height,
            fontStyle: {
              lineHeight: 26 + 2,
              textAlign: 'center',
              textBaseline: 'top',
              font: 'normal 26px arial',
              fontSize: 26,
              fillStyle: '#000'
            },
          });
        });

        // 画中间横线
        ctx.save();
        ctx.beginPath();
        ctx.setStrokeStyle('#000');
        ctx.setLineWidth(4);
        ctx.moveTo(54, 380);
        ctx.lineTo(54 + 80, 380);
        ctx.stroke();
        ctx.restore();

        /* 写问题 begin*/

        // 先写前面 18个字 后面超过用...表示

        let proQuestion = productDetails.proQuestion || '';

        let regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
        proQuestion = proQuestion.replace(regStr, '');

        // proQuestion = '你来人间一趟，你要看看太阳。和你的心上人一起走在街上。最多仅可以放32字。'
        let part1 = proQuestion,
          part2 = '',
          maxLen = 18;
        if (proQuestion.length > maxLen) {
          part1 = proQuestion.substr(0, maxLen);
          part2 = proQuestion.substr(maxLen, proQuestion.length);
        }
        console.log(part1, 'part1');
        console.log(part2, 'part2');

        CTV({
          ctx,
          text: part1,
          x: part2 != '' ? 57 + 40 + 12 : 57 + 20 + 12,
          y: 420,
          fontStyle: {
            lineHeight: 23 + 2,
            textAlign: 'center',
            textBaseline: 'top',
            font: 'normal 23px arial',
            fontSize: 23,
            fillStyle: '#000'
          },
        });

        // 第二部分 如果有超出用省略号
        if (part2 != '') {
          if (part2.length > 18) {
            part2 = `${part2.substr(0, 18)}E`;
          }

          CTV({
            ctx,
            text: part2,
            x: 57 + 12,
            y: 420,
            fontStyle: {
              lineHeight: 23 + 2,
              textAlign: 'center',
              textBaseline: 'top',
              font: 'normal 23px arial',
              fontSize: 23,
              fillStyle: '#000'
            },
          });
        }



        /* 写问题 end*/


        // 画logo
        return wxp.getImageInfo({
          src: 'https://img.kanhua.yiwaiart.com/miniApp/activity/EY_img_erweima@2x.png',
        });
      }).then((res) => {
        ctx.drawImage(res.path, 23, 935, 190, 147);
        return wxp.getImageInfo({
          src: 'https://img.kanhua.yiwaiart.com/miniApp/activity/EY_img_jianbian@2x.png',
        })
      }).then((res) => {
        // 画底部渐变色
        ctx.drawImage(res.path, 197 - 1, 974 + 1, 531 + 2, 151 + 1);

        // 写右下角
        // 写日期
        ctx.save();
        ctx.font = 'normal 25px arial';
        ctx.fillStyle = '#1D1D1D';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'right';
        ctx.fillText(this.getToday(), WIDTH - 50, 1037);
        ctx.restore();

        // 写分享来自@
        ctx.save();
        ctx.font = 'bold 25px arial';
        ctx.fillStyle = '#000000';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'right';
        // ctx.fillText('分享自 @at will', WIDTH - 63, 1065);
        const {
        nickName
      } = wx.getStorageSync('user');
        ctx.fillText(`分享自 @${nickName}`, WIDTH - 50, 1073);
        ctx.restore();

        ctx.draw(false, () => {
          // 生成图片
          wxp.canvasToTempFilePath({
            canvasId: 'myCanvas',
          }).then(({
          tempFilePath
        }) => {
            // wx.hideLoading();
            console.log(tempFilePath);
            this.setData({
              cardCreateImgUrl: tempFilePath
            });
          });
        });

      });

  },
  onShow() {

  },
  bindload() {
    wx.hideLoading();
  },

  /**
   * 获取作品详情
   */
  getProductDetails() {
    const {
      customerId,
      productId
    } = this.data;
    const postData = {
      customerId,
      productId
    };
    return getProductDetails(postData).then(({ code, data }) => {
      if (code == '10000') {
        return data;
      }
    });
  },

  /**
   * 获取评论信息
   */
  getCommentInfo() {
    const {
      commentId,
      customerId
    } = this.data;
    if (commentId == 0) {
      return '';
    }
    const postData = {
      commentId,
      customerId
    };
    return getCommentInfo(postData).then(({
      code,
      data: {
        content
      }
    }) => {
      if (code == '10000') {
        return content;
      }
    });
  },

  getToday() {
    const date = new Date();
    const zeroize = (n) => (n < 10 ? `0${n}` : n);

    return `${date.getFullYear()}-${zeroize(date.getMonth() + 1)}-${zeroize(date.getDate())}`;
  },
  saveImg() {
    const {
      cardCreateImgUrl,
      saveType
    } = this.data;

    // 画上logo 会有裁剪的现象
    wx.showLoading({
      title: '保存中...',
      mask: true
    });

    wx.saveImageToPhotosAlbum({
      filePath: cardCreateImgUrl,
      success() {
        if (saveType == 1)
          wx.reportAnalytics('click_poster_1', {});
        else
          wx.reportAnalytics('click_poster_2', {});

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

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage () {

  // }
})