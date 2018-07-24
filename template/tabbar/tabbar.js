const getPagesInfo = () => {
  const pages = getCurrentPages();
  const index = pages.length - 1;
  const self = pages[index];

  self.changeTabBar = (e) => {
    const { target: { dataset: { bar } } } = e;
    const { tabType } = self.data;
    console.log(tabType, 'tabType')
    let url;
    switch (+bar) {
      case 1:
        if (+tabType === 1) return;
        url = '../Index/Index';
        wx.redirectTo({ url });
        break;
      // case 2:
      //   wx.navigateToMiniProgram({
      //     appId: 'wx2a3373ccf73a2790',
      //     path: '',
      //   })
      //   break;
      case 2:
        if (+tabType === 2) return;
        url = `../member/member`;
        wx.redirectTo({ url });
        break;
      default:
        break;
    };
  }
}

export default getPagesInfo;
