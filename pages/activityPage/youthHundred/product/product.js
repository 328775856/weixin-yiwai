import {
  getYouthProductList,
  votePeach,
  getCustomerVote
} from './product.service';
const {
  myNavigateTo
} = getApp();

Page({

  data: {
    customerId: 0,
    productList: [],
    searchInfo: '',
    pageNo: 0,
    pageSize: 10,
    isEmpty: false,
    isApiError: false,
    lock: false,
    isLoaded: false,
    isLoading: true,
  },

  onLoad(options) {
    const {
      id: customerId
    } = wx.getStorageSync('user');
    this.setData({
      customerId
    });
    this.init();
  },
  onShow() {

  },
  init() {
    this.getYouthProductList();
  },
  /**
   * 获取活动作品列表
   */

  getYouthProductList(fn = false) {
    const {
      lock,
      isLoaded
    } = this.data;
    if (!lock && !isLoaded) {

      this.getCustomerVote().then((res) => {
        console.log(res, '今日已投票');
        this.setData({
          lock: true,
          isLoading: true
        });
        wx.showLoading({
          title: '正在加载',
        });

        const {
          searchInfo,
          pageNo,
          pageSize
      } = this.data;
        const no = pageNo + 1;

        const postData = {
          searchInfo,
          pageNo: no,
          pageSize,
        };

        // 接口有错误
        getYouthProductList(postData).then(({
          data: {
            youthProductList: productList,
          totalItems,
          totalPages
          }
        }) => {
          console.log(productList, 'productList');
          console.log(totalPages, 'totalPages');
          // 回调
          if (fn) fn();
          wx.hideLoading();
          if (no >= totalPages) {
            this.setData({
              isLoaded: true
            });
          }
          if (productList && productList.length > 0) {
            this.setData({
              productList: [...this.data.productList, ...this.operateData(productList, res)],
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
        }, (res) => {
          if (res.retType == -1 || res.retType == -2) {
            wx.hideLoading();
          }
        });
      });


    }

  },
  operateData(list, res) {
    let id = 0;
    list.map((item, i) => {
      id = item.productDto.id;
      if (res[0] && id == res[0].productId || res[1] && id == res[1].productId || res[2] && id == res[2].productId) {
        item.isLike = 1;
      }
    });
    return list;
  },

  /**
    * 获取用户投票信息
    */
  getCustomerVote() {
    const { customerId } = this.data;
    return getCustomerVote({ customerId }).then(({ code, data: { voteRecords } }) => {
      if (code == '10000') {
        return voteRecords;
      } else {
        return [];
      }
    });
  },
  /**
     * 投票
     */
  setVotePeach({ currentTarget: { dataset: { productId, isLike } } }) {
    if (isLike == 1) return;
    const { productList, customerId } = this.data;
    const postData = { customerId, productId };
    // 投票中
    wx.showLoading({
      title: '投票中',
      mask: true
    });
    votePeach(postData).then(({ code, msg }) => {
      wx.hideLoading();
      if (code == '10000') {
        productList.map(item => {
          if (item.productDto.id == productId) {
            item.isLike = item.isLike ? 0 : 1;
            item.peachNum = item.isLike ? ++item.peachNum : --item.peachNum;
          }
        });
        this.setData({ productList });
        wx.showToast({
          title: '投票成功',
        });
      } else {
        // 超过3票
        wx.showToast({
          icon: 'none',
          title: msg,
        });
      }
    });
  },

  bindscrolltolower() {
    this.getYouthProductList();
  },
  bindinput(e) {
    const {
      detail: {
        value
      }
    } = e;
    this.setData({
      searchInfo: value
    });
  },
  bindconfirm() {
    // reset
    this.setData({
      productList: [],
      pageNo: 0,
      isEmpty: false,
      isApiError: false,
      lock: false,
      isLoaded: false,
      isLoading: true,
    });
    this.getYouthProductList();
  },
  // onReachBottom() {

  //   console.log('底部加载...');
  // },

  // onShareAppMessage() {

  // },
  navigateToProductDetail({ currentTarget: { dataset: { id } } }) {
    myNavigateTo({ url: `../../../Picture/Detail?id=${id}` });
  }
})