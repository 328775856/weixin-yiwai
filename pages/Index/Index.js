import wxp from '../../lib/wx-promisify';
import tabBar from '../../template/tabbar/tabbar';
/* 授权:引入 */
import {
  auth,
  loginBefore
} from '../../template/auth/auth';
const {
  login,
  myNavigateTo
} = getApp();

import {
  demo,
  getBannerList,
  getNewCommentList,
  getHomePage
} from './Index.service';
Page({
  data: {
    /* 首页列表 begin */
    renderArr: [],
    homePageList: [],
    pageNo: 0,
    pageSize: 2,
    isEmpty: false,
    lock: false,
    isLoaded: false,
    isLoading: true,
    /* 首页列表 end */
  },
  onShow() {

  },
  onLoad() {
    tabBar();
    // /* 授权:登录方法 */
    // auth(login, this.init);
    // /* 授权: 判断是否显示弹框 */
    // loginBefore();
    // if (wx.getStorageSync('user').id)
    //   this.init();

    this.init();
  },
  init() {
    const {
      id: customerId
    } = wx.getStorageSync('user');
    this.setData({
      customerId
    });
    this.getHomePage();
  },
  getHomePage(fn = false) {
    console.log('load data');
    const {
      lock,
      isLoaded
    } = this.data;
    if (!lock && !isLoaded) {
      this.setData({
        lock: true,
        isLoading: true
      });
      // 系统loading
      wx.showLoading({
        title: '正在加载',
        mask: true
      });
      const {
        pageNo,
        pageSize
      } = this.data;
      const no = pageNo + 1;

      const postData = {
        pageNo: no,
        pageSize,
      };
      getHomePage(postData).then(({
        data: {
          data: homePageList,
        totalItems,
        totalPages
        }
      }) => {
        if (fn) fn();
        // 关闭系统loading
        wx.hideLoading();

        console.log(homePageList, 'homePageList');
        console.log(totalItems, 'totalItems');
        console.log(totalPages, 'totalPages');
        // 判断是否已经最后一页了

        if (no >= totalPages) {
          this.setData({
            isLoaded: true
          });
        }

        if (homePageList && homePageList.length > 0) {

          this.operateData(homePageList);

          this.setData({
            // homePageList: [...this.data.homePageList, ...homePageList],
            pageNo: no
          });
        } else {
          // 如果是第一页就无数据
          if (no == 1) {
            // 显示空模板
            this.setData({
              isEmpty: true
            });
          }
        }
        // 解除锁定,隐藏加载loading
        this.setData({
          lock: false,
          isLoading: false,
        });
      });
    }
  },
  operateData(homePageList) {
    /*
     * 1.每次获取10条,根据日期分组然后显示在页面上，如果是今天日期就显示为"今日"
     * 2.下拉获取数据时候,重复1步骤,然后获取当前list最后一个item的日期，如果有重复的日期就拼凑上去
     */

    // 获取renderArr 判断最后一条数据的日期
    const {
      renderArr
    } = this.data;
    const renderArrLen = renderArr.length;
    let lastItemDate = '';
    if (renderArrLen > 0) {
      lastItemDate = renderArr[renderArrLen - 1].date;
    }
    let groupByDate = {},
      list = [],
      objDate = {};
    homePageList.map((item, i) => {
      // 分组
      const date = item.publishTime.split(' ')[0];
      if (groupByDate[date]) {
        groupByDate[date].push(item);
      } else {
        groupByDate[date] = [];
        groupByDate[date].push(item);
      }
    });
    for (let o in groupByDate) {
      // 把当前的list放入renderArr数组最后对应的日期列表
      if (lastItemDate && lastItemDate == o) {

        renderArr.map((item, i) => {
          if (item.date == lastItemDate) {
            item.list = item.list.concat(groupByDate[o]);
          }
          // return item;
        });

        this.setData({
          renderArr
        });
      } else {
        objDate['date'] = o;
        objDate['_date'] = this.p2Date(o);
        objDate['_week'] = this.getWeekByDate(o);
        objDate['list'] = groupByDate[o];
        list.push(objDate);
        objDate = {};
      }
    }

    console.log([...renderArr, ...list], 'renderArr');
    this.setData({
      renderArr: [...renderArr, ...list]
    });

  },

  // 日期转换 今年不用加上年份
  p2Date(date) {

    // 判断是否今天，是返回"今天"
    const d1 = new Date(date);
    const d2 = new Date();

    if (d1.getFullYear() + d1.getMonth() + d1.getDate() == d2.getFullYear() + d2.getMonth() + d2.getDate()) {
      return '今天';
    }
    if (d1.getFullYear() == d2.getFullYear()) {
      return [d1.getMonth() + 1, d1.getDate()].join('.');
    }
    return [d1.getFullYear(), d1.getMonth() + 1, d1.getDate()].join('.');

  },
  // 根据日期得到星期
  getWeekByDate(date) {
    const today = '../../images/Index/EY_icon_today@2x.png';
    const weekImg = [
      '../../images/Index/EY_icon_Sun@2x.png',
      '../../images/Index/EY_icon_Mon@2x.png',
      '../../images/Index/EY_icon_Tue@2x.png',
      '../../images/Index/EY_icon_Wed@2x.png',
      '../../images/Index/EY_icon_Thu@2x.png',
      '../../images/Index/EY_icon_Fri@2x.png',
      '../../images/Index/EY_icon_Sat@2x.png',
      '../../images/Index/EY_icon_Sun@2x.png',
    ];

    // 判断是否今天，是返回"今天"
    const d1 = new Date(date);
    const d2 = new Date();
    if (d1.getFullYear() + d1.getMonth() + d1.getDate() == d2.getFullYear() + d2.getMonth() + d2.getDate())
      return today;
    // 返回星期
    else
      return weekImg[new Date(date).getDay()];
    // return "星期" + "日一二三四五六".charAt(new Date(date).getDay());
  },

  // loadMore2() {
  //   this.getHomePage();
  // }, 
  bindload(e) {
    console.log(e);
  },
  onPullDownRefresh() {
    this.setData({
      pageNo: 0,
      isLoaded: false,
      isEmpty: false,
      lock: false,
      isLoaded: false,
      isLoading: false,
      renderArr: []
    });
    setTimeout(() => {
      this.getHomePage(() => {
        wx.stopPullDownRefresh();
      });
    }, 500);
  },
  onReachBottom() {
    this.getHomePage();
  },
  navigateToDetails({
    currentTarget: {
      dataset: { item }
    }
  }) {
    const {
      itemId,
      itemType,
      linkUrl
    } = item;
    console.log(itemId, 'itemId');
    console.log(itemType, 'itemType');
    console.log(linkUrl, 'linkUrl');
    const url = '';
    // 品画
    if (itemType == 1) {
      myNavigateTo({
        url: `/pages/Picture/Detail?id=${itemId}`
      });
    }
    // 展览
    else if (itemType == 2) {
      myNavigateTo({
        url: `/pages/exhibitionDetails/exhibitionDetails?id=${itemId}`
      });
    }
    // 商城
    else {
      wx.navigateToMiniProgram({
        appId: 'wx2a3373ccf73a2790',
        path: linkUrl,
        success(res) {
          console.log(res);
        },
        fail(res) {
          console.log(res);
        },
        complete(res) {
          console.log(res);
        }
      });
    }

  }
});