Page({

  data: {
    percentage: 0,

  },


  onLoad(options) {

    wx.showNavigationBarLoading();

    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.autoplay = true;
    // innerAudioContext.loop = true;
    innerAudioContext.src = 'https://img.kanhua.yiwaiart.com/birthday/audio/2.mp3'
    // innerAudioContext.src = 'https://img.kanhua.yiwaiart.com/1515911758124.mp3'
    // innerAudioContext.seek(60);
    innerAudioContext.onPlay(() => {
      wx.hideNavigationBarLoading();
    });
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    });

    innerAudioContext.onEnded((res) => {
      this.setData({
        percentage: 100
      });
    });

    innerAudioContext.onTimeUpdate((res) => {
      const {
        duration,
        currentTime
      } = innerAudioContext;
      this.setData({
        percentage: 100 * (currentTime / duration).toFixed(2)
      });
    });



    // const backgroundAudioManager = wx.getBackgroundAudioManager()

    // backgroundAudioManager.title = '此时此刻'
    // backgroundAudioManager.epname = '此时此刻'
    // backgroundAudioManager.singer = '许巍'
    // backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
    // backgroundAudioManager.src = 'https://img.kanhua.yiwaiart.com/birthday/audio/2.mp3' 
    // backgroundAudioManager.onTimeUpdate((res) => {
    //   console.log(backgroundAudioManager.)
    //   console.log(backgroundAudioManager.currentTime);
    // });
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})