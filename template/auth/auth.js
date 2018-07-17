const getSelf = () => {
  const pages = getCurrentPages();
  const index = pages.length - 1;
  const self = pages[index];
  return self;
};

const auth = (login = false, init = false) => {
  const self = getSelf();
  self.setData({
    showAuthAlert: false
  });
  self.tapAuth = ({
    detail
  }) => {
    if (detail.errMsg === 'getUserInfo:fail auth deny') return;
    wx.showLoading({
      title: '授权登录中...',
      mask: true
    });
    login(detail, () => {
      wx.hideLoading();
      self.setData({
        showAuthAlert: false
      });
      if (init) init();
    });
  };
};

/**
 * 登陆前判断是否需要显示弹框
 */
const loginBefore = () => {
  const self = getSelf();
  const {
    id: customerId
  } = wx.getStorageSync('user');
  if (customerId) {
    self.setData({
      showAuthAlert: false
    });
  } else
    self.setData({
      showAuthAlert: true
    });
};

export {
  auth,
  loginBefore
};