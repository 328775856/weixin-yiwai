const getPagesInfo = () => {
  const pages = getCurrentPages();
  const index = pages.length - 1;
  const self = pages[index];

  self.changeTabBar = (e) => {
    const { target: { dataset: { bar: tabType } } } = e;
    console.log(tabType, 'tabType')
    let url;
    switch (+tabType) {
      case 1:
        if (+tabType === 1) return;
        url = '../Index/Index';
        wx.redirectTo({ url });
        break;
      case 2:
        wx.navigateToMiniProgram({
          appId: 'wx2a3373ccf73a2790',
          path: '',
        })
        break;
      case 3:
        if (+tabType === 2) return;
        url = `../mine/mine`;
        wx.redirectTo({ url });
        break;
      default:
        break;
    };
  }
}

export default getPagesInfo;
