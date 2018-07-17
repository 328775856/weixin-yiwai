import wxp from './lib/wx-promisify';
import request from './utils/request';
import wxapi from './utils/wxapi';

// 跳转变量
let isNavigateToIng = true;
App({
  onLaunch() {
    const self = this;
    if (wxapi.versionFilter()) {
      return;
    }
    // 兼容iphone x 距离底部 68rpx
    wx.getSystemInfo({
      success(res) {
        if (res.model.indexOf("iPhone X") != -1) {
          self.globalData.isIpx = true;
        }
      }
    })
    // 检测网络状态
    wx.onNetworkStatusChange((data) => {
      if (!data.isConnected) {
        wx.showModal({
          title: '网络异常',
          content: '网络连接异常，请确认网络是否连通',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定');
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      }
    });
  },

  globalData: {
    isIpx: false
  },
  login(userInfo, fn = false) {
    wxp.login().then(({ code }) => {
      return code;
    }).then(code => {
      if (code) {
        const authData = {
          code,
          encryptedData: userInfo.encryptedData,
          iv: userInfo.iv
        }
        request.post('auth', authData).then((res) => {
          wx.setStorageSync('user', res.data);
          return true;
        }).then((res) => {
          if (fn && res) fn();
        });
      }
    });
  },
  // 设置navigateTo跳转,超过5层用redirectTo
  myNavigateTo(obj) {
    if (isNavigateToIng) {
      isNavigateToIng = false;
      if (getCurrentPages().length >= 5) {
        wx.redirectTo(obj);
      } else {
        wx.navigateTo(obj);
      }
      setTimeout(() => {
        isNavigateToIng = true;
      }, 1000);
    }
  }
});
