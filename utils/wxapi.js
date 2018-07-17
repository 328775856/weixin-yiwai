const wxApi = () => ({
  // 过滤基础库版本
  versionFilter() {
    const { SDKVersion } = wx.getSystemInfoSync();
    const sdkVersion = parseFloat(SDKVersion);

    if (SDKVersion == '1.4.0' || sdkVersion < 1.4 || !SDKVersion) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        success: (res) => {
          if (res.confirm) wx.navigateBack();
        }
      });
      return true;
    }
    return false;
  }

});

module.exports = wxApi();
