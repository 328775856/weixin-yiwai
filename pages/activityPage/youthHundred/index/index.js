import {
  getYouthProductList,
  votePeach,
  getCustomerVote,
  getActivityComment,
  setCommentLike
} from './index.service';
import timeFormat from '../../../../utils/timeFormat';

import {
  auth,
  loginBefore
} from '../../../../template/auth/auth';
const {
  login,
  myNavigateTo
} = getApp();

Page({

  data: {
    customerId: 0,
    top3List: [],
    productList: [],
    voteRecords: [],

    // 评论相关
    commentList: [],
    totalItems: 0,
    pageNo: 0,
    pageSize: 10,
    isEmpty: false,
    isApiError: false,
    lock: false,
    isLoaded: false,
    isLoading: true,
  },

  onLoad(options) {
    /* 授权:登录方法 */
    auth(login, this.init);
  },
  onShow() {
    /* 授权: 判断是否显示弹框 */
    loginBefore();
    if (wx.getStorageSync('user').id)
      this.init();
  },
  init() {
    const {
      id: customerId
    } = wx.getStorageSync('user');
    this.setData({
      customerId
    });

    this.getDataByAll();
    this.getActivityComment();
    // this.getYouthProductList();
    // this.getCustomerVote();
  },
  getDataByAll() {
    Promise
      .all([this.getYouthProductList(), this.getCustomerVote()])
      .then(([res1, res]) => {
        console.log(res, '已经投票过的');
        const { productList } = this.data;
        let id = 0;
        productList.map((item, i) => {
          id = item.productDto.id;
          if (res[0] && id == res[0].productId || res[1] && id == res[1].productId || res[2] && id == res[2].productId) {
            item.isLike = 1;
          }
        });
        this.setData({ productList });
      })
  },
  /**
   * 获取活动作品列表
   */
  getYouthProductList() {
    // const { artistName, } = this.data;
    const postData = {
      searchInfo: '',
      pageNo: 1,
      pageSize: 6
    };
    return getYouthProductList(postData).then(({ code, data: { totalItems, totalPages, youthProductList } }) => {
      // 获取前三条放在top3List
      const arr = youthProductList.slice(0, 3);
      [arr[0], arr[1], arr[2]] = [arr[1], arr[0], arr[2]];
      this.setData({ top3List: arr });
      this.setData({ productList: youthProductList });
      return true;
    });

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
   * 获取评论列表
   */

  getActivityComment(fn = false) {
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
      });
      const {
        customerId,
        pageNo,
        pageSize
      } = this.data;
      const no = pageNo + 1;

      const postData = {
        customerId,
        pageNo: no,
        pageSize,
      };

      // 接口有错误
      getActivityComment(postData).then(({
        data: {
          data: commentList,
        totalItems,
        totalPages
        }
      }) => {
        this.setData({ totalItems });
        console.log(commentList, 'commentList');
        if (fn) fn();
        // 关闭系统loading
        wx.hideLoading();
        // 判断是否已经最后一页了

        if (no >= totalPages) {
          this.setData({
            isLoaded: true
          });
        }

        if (commentList && commentList.length > 0) {

          this.setData({
            commentList: [...this.data.commentList, ...this.operateData(commentList)],
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
    }
  },
  operateData(list) {
    list.map(item =>
      item.gmtCreate = timeFormat(item.gmtCreate)
    );
    return list;
  },
  onHide() {

  },

  onPullDownRefresh() {
    this.setData({
      pageNo: 0,
      isLoaded: false,
      isEmpty: false,
      lock: false,
      isLoaded: false,
      isLoading: false,
      commentList: []
    });
    setTimeout(() => {
      this.getActivityComment(() => {
        wx.stopPullDownRefresh();
      });
    }, 500);
  },
  onReachBottom() {
    this.getActivityComment();
    console.log('底部加载...');
  },


  onShareAppMessage() {

  },

  /**
   * 点赞
   */
  setCommentLike({ currentTarget: { dataset: { commentId } } }) {
    const { commentList, customerId } = this.data;
    commentList.map(item => {
      if (item.id == commentId) {
        item.isLike = item.isLike ? 0 : 1;
        item.commentLikeNum = item.isLike ? ++item.commentLikeNum : --item.commentLikeNum;
      }
    });
    this.setData({ commentList });

    const postData = { customerId, commentId };
    setCommentLike(postData);
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
          title: '送桃成功',
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
  navigateToExplain() {
    myNavigateTo({ url: '../explain/explain' });
  },
  // 跳转到更多作品页面
  navigateToProduct() {
    myNavigateTo({ url: '../product/product' });
  },
  navigateToProductDetail({ currentTarget: { dataset: { id } } }) {
    myNavigateTo({ url: `../../../Picture/Detail?id=${id}` });
  },
  navigateToExhibitionDetails() {
    const id = 20;
    myNavigateTo({ url: `../../../exhibitionDetails/exhibitionDetails?id=${id}`});
  },
})