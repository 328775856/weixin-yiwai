
let innerAudioContext = null, second = 30;

Page({

  data: {
    percentage: 0,
    isPaused: false,
    mediaTitle: '',
    mediaImage: '',
    mediaUrl: '',
    isPlaying: false,

  },


  onLoad(options) {
    const { mediaTitle, mediaImage, mediaUrl } = options;
    this.setData({
      mediaTitle, mediaImage: `${mediaImage}?imageView2/2/h/390/q/50`, mediaUrl
    });

  },
  onShow() {
    this.setData({ percentage: 0});
    const { mediaTitle, mediaImage, mediaUrl } = this.data;
    wx.showNavigationBarLoading();

    innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.autoplay = true;
    innerAudioContext.loop = true;
    innerAudioContext.src = mediaUrl;
    // innerAudioContext.src = 'https://img.kanhua.yiwaiart.com/1515911758124.mp3'
    // innerAudioContext.seek(60);
    innerAudioContext.onPlay(() => {
      this.setData({ isPlaying: true });
      wx.hideNavigationBarLoading();
    });
    innerAudioContext.onError((res) => {
      
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

  tapPlay() {
    if (!this.data.isPlaying) return;
    if (innerAudioContext.paused) {
      innerAudioContext.play();
      this.setData({ isPaused: false });
    } else {
      innerAudioContext.pause();
      this.setData({ isPaused: true });
    }
  },
  tapPre() {
    this.ope('pre');
  },
  tapNext() {
    this.ope();
  },
  ope(ope = 'next') {
    if (!this.data.isPlaying) return;
    const {
      duration,
      currentTime
    } = innerAudioContext;
    if (ope == 'next')
      innerAudioContext.seek(currentTime + second >= duration ? duration : currentTime + second);
    else
      innerAudioContext.seek(currentTime - second <= 0 ? 0 : currentTime - second);


    if (innerAudioContext.paused) {
      innerAudioContext.play();
      this.setData({ isPaused: false });
    }

  },


  onHide() {
    innerAudioContext && innerAudioContext.destroy();
    this.setData({ isPlaying: false });
  },


  onUnload() {
    innerAudioContext && innerAudioContext.destroy();
    this.setData({ isPlaying: false });
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