//在使用的View中引入WxParse模块
let wxParse = require('../../lib/wxParse/wxParse/wxParse.js');
Page({

  data: {



    windowWidth: 0,
    details: null,


    // 评论
    commentList: [],
  },

  onLoad(options) {
    let windowWidth = 0;
    wx.getSystemInfo({
      success(res) {
        windowWidth = res.windowWidth;
        // windowHeight = res.windowHeight;
      }
    });

    this.setData({
      windowWidth,
      details: {
        imageUrl: 'https://img.kanhua.yiwaiart.com/picture/5a02bfc4b3f7a5577.jpg'
      }
    });
    // temp
    const article = '<p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">1890年，夏天，在法国圣雷米的精神病院。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">他们说，住进这里来，对所有人都好。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">病房有一扇小窗，每天晚上可以从窗户望出去，是法国乡村的夜晚，夜晚散发着柏树的香味。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">人群很远，在山脚下。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">窗外比病房亮得多，因为天空上有星星和月亮。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">它们明亮得好像可以发出声音。可是，医生并不让我晚上画画。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">只能到了白天的时候，拿起画笔颜料，凭记忆画下来。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">于是有了这幅《星空》。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;"><br/></p><p style="text-align: center"><img src="https://img.kanhua.yiwaiart.com/eyadmin/c5d8aeb4-3390-42b8-81d1-cb723be536eb.jpg"/></p><p><span style="font-family: &quot;Helvetica Neue&quot;; font-size: 13px;"><br/></span></p><p><span style="font-family: &quot;Helvetica Neue&quot;; font-size: 13px;">圣雷米夜晚的星空很漂亮，很安静，只有我能听到它们的声音，星星和月亮无时不刻在转动，只有在夜晚，它们才真正活着。</span></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;">———————</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">编者按：</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">距离梵高所作《星空》过去整整114年，直到2004年，美国宇航局和欧洲航天局公布了一张太空望远镜拍摄的太空照片，发现这幅太空摄影与《星夜》竟有很大相似之处。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">这种物质被人们称为“涡状星系”。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">在梵高那里，它就是每晚陪着病痛中的画家入眠的光芒。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;">&nbsp;</p><p style="text-align: center"><img src="https://img.kanhua.yiwaiart.com/eyadmin/3ffbde01-89c3-4d96-82f9-f80ea1af57b8.jpg"/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; text-align: center;">（右：太空望远镜拍摄的恒星）</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">恒星距离地球2万光年，肉眼无法观测到，但梵高做到了。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">艺术家惊人的创造力竟与科学相遇。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">梵高曾在写给弟弟提奥的信中说：</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">当我画一个太阳，我希望人们感觉它在以惊人的速度旋转，正在发出骇人的光热巨浪。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">他一生“痴迷”于追逐光芒，最终竟“看到”了这团星云。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">当一个人对待一件事情的时候，他看待这件事物的角度绝对是独一无二的。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">当你痴迷某事时，会像梵高一样，勇于追逐自己的“星空”吗？</p>'
    const that = this;
    wxParse.wxParse('article', 'html', article, that, 15);


    this.setData({
      commentList: [{
        customerImg: 'https://wx.qlogo.cn/mmopen/vi_32/kfMibDakwv2OPaN6LZrpuDrDsPxrZtMTQDM2zkkZrsr0ezdKT0HZQicRHqciavQ7m3COC6ZoU3EaumgTrbzsgqtxA/132'
      },
      {
        customerImg: 'https://wx.qlogo.cn/mmopen/vi_32/kfMibDakwv2OPaN6LZrpuDrDsPxrZtMTQDM2zkkZrsr0ezdKT0HZQicRHqciavQ7m3COC6ZoU3EaumgTrbzsgqtxA/13'
      },
      {
        customerImg: 'https://wx.qlogo.cn/mmopen/vi_32/kfMibDakwv2OPaN6LZrpuDrDsPxrZtMTQDM2zkkZrsr0ezdKT0HZQicRHqciavQ7m3COC6ZoU3EaumgTrbzsgqtxA/132'
      }
      ]
    });

  },

  onReady() {

  },

  onShow() {

  },

  onHide() {

  },

  onUnload() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  onShareAppMessage() {

  }
})