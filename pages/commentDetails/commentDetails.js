import timeFormat from '../../utils/timeFormat';

const {
  myNavigateTo
} = getApp();

import {
  getMyCommentList,
  getHotCommentList,
  getMoreCommentList,
  addComment,
  addReply,
  setCommentLike
} from './commentDetails.service';
Page({

  data: {
    // 评论总数
    commentTotals: 0,

    productId: 0,
    customerId: 0,
    /* 评论列表 begin */
    commentList: [],
    pageNo: 1,
    pageSize: 10,
    isEmpty: false,
    lock: false,
    isLoaded: false,
    isLoading: true,
    /* 评论列表 end */

    // 发表评论
    commentLock: false,
    content: '',
    commentInputObj: {
      value: '',
      isShowTrue: true,
      focus: false,
      isMask: false,
      placeholder: '说点什么...'
    },
    // 回复入参
    commentId: 0,
    replyType: 0,
    toReplyId: 0,
    toCustomerId: 0,
    toCustomerName: '',
  },

  onLoad(options) {
    const { id: productId } = options;
    this.setData({ productId });
    this.init();
  },
  init() {
    const {
      id: customerId
    } = wx.getStorageSync('user');
    this.setData({
      customerId
    });
    this.getAllCommentList();
  },
  getAllCommentList() {
    this.setData({
      isLoading: true
    });
    /**
       * 获取我的评论列表
       */
    const arr1 = () => {
      const { productId, customerId } = this.data;
      const postData = {
        productId,
        presentCustomerId: customerId
      };
      return getMyCommentList(postData).then(({ data: { commentList } }) => {
        return commentList;
      });
    };
    /**
     * 获取热门评论列表
     */
    const arr2 = () => {
      const { productId, customerId } = this.data;
      const postData = {
        productId,
        presentCustomerId: customerId
      };
      return getHotCommentList(postData).then(({ data: { commentList } }) => {
        // 只能第一条为best
        if (commentList && commentList.length > 0) {
          commentList.map((item, i) => {
            if (i == 0) {
              item.isHot = 1;
            } else {
              item.isHot = 0;
            }
          });
          return commentList;
        }
        return [];
      });
    };

    /**
     * 获取更多评论列表
     */
    const arr3 = () => {
      const { productId, customerId, pageNo, pageSize } = this.data;
      const postData = {
        productId,
        presentCustomerId: customerId,
        pageNo,
        pageSize
      };
      return getMoreCommentList(postData).then(({ data: { commentList, totalItems } }) => {
        this.setData({
          commentTotals: totalItems || 0
        });
        // 获取totalItems
        return commentList;
      });
    };

    Promise
      .all([arr1(), arr2(), arr3()])
      .then(([res1, res2, res3]) => {
        const {
          commentTotals
        } = this.data;
        this.setData({
          commentTotals: commentTotals + res1.length + res2.length
        });

        wx.setNavigationBarTitle({
          title: `观点（${commentTotals + res1.length + res2.length}）`
        });

        this.setData({
          isLoading: false
        });

        this.setData({ commentList: this.operateData([...res1, ...res2, ...res3]) });
      });


  },

  getMoreCommentList() {
    const {
      lock,
      isLoaded
    } = this.data;
    if (!lock && !isLoaded) {
      this.setData({
        lock: true,
        isLoading: true
      });

      const {
        productId,
        customerId,
        pageNo,
        pageSize
      } = this.data;
      const no = pageNo + 1;

      const postData = {
        productId,
        presentCustomerId: customerId,
        pageNo: no,
        pageSize,
      };
      getMoreCommentList(postData).then(({
        data: {
         commentList,
        totalItems,
        totalPages
        }
      }) => {
        this.setData({
          commentTotals: totalItems || 0
        });

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
      });
    }
  },
  operateData(list) {
    list.map((item, i) => {
      item.gmtCreate = timeFormat(item.gmtCreate);
      if (item.replyList && item.replyList.length > 0) {
        item.replyList.map(itemj => {
          itemj.gmtCreate = timeFormat(itemj.gmtCreate);
        });
      }
    });
    return list;
  },


  /* input事件相关 begin */
  tapAddComment() {
    // 判断非空
    const {
      commentId,
      content
    } = this.data;
    if (content.trim() == '') {
      wx.showToast({
        title: '评论不能为空！',
        icon: 'none',
      });
      return;
    }

    // 判断评论还是回复
    if (commentId == 0) {
      this.addComment();
    } else {
      this.addReply();
    }
  },
  // 点击带有收藏的评论框
  tapci2() {
    this.setData({
      'commentInputObj.isShowTrue': true,
      'commentInputObj.focus': true,
    });
  },
  cibindinput(e) {
    const {
      detail: {
        value
      }
    } = e;
    this.setData({
      content: value
    });
  },
  cibindfocus(e) {
    this.setData({
      'commentInputObj.isMask': true,
    });
  },
  taphideMask() {
    this.setData({
      'commentInputObj.isMask': false,
      // 重置
      commentId: 0,
      'commentInputObj.placeholder': '说点什么...',
    });
  },
  // cibindblur(e) {
  //   this.setData({
  //     'commentInputObj.isMask': false,
  //     // 重置
  //     // commentId: 0,
  //     // 'commentInputObj.placeholder': '说点什么...',
  //   });
  // },
  addComment() {
    const { commentLock } = this.data;
    if (commentLock) return;
    const {
      content,
      productId,
      customerId
    } = this.data;
    const postData = {
      productId,
      customerId,
      content
    };
    wx.showLoading({
      title: '提交中...',
    });
    this.setData({
      commentLock: true
    });

    addComment(postData).then(({
      code,
      data: {
        id: commentId,
        gmtCreate
      }
    }) => {
      if (code == '10000') {
        this.addCommentSucc(commentId, gmtCreate, content);
        this.setData({
          commentLock: false
        });
      } else {
        wx.showToast({
          title: '评论失败！',
          mask: true
        });
      }

      // 清空文本域
      this.setData({
        'commentInputObj.value': '',
        content: ''
      });

    });
  },

  addCommentSucc(commentId, gmtCreate, content) {
    wx.showToast({
      title: '评论成功！',
      icon: 'success',
      mask: true,
      duration: 1500
    });
    setTimeout(() => {
      this.navigateToPoster({ commentId });
    }, 1500);
    const {
      id,
      nickName,
      avatarUrl,
      isVip,
      vipInfo,
      isOfficial
    } = wx.getStorageSync('user');
    const obj = {
      id: commentId,
      // 格式化时间
      gmtCreate: timeFormat(gmtCreate),
      content,
      _content: content,
      customerId: id,
      customerName: nickName,
      customerImg: avatarUrl,
      replyNum: 0,
      replyList: [],
      isLike: 0,
      isVip,
      vipInfo,
      isOfficial: isOfficial || 0,
      commentLikeNum: 0,
      isHl: true
    };

    // 插入更多回答myCommentList
    // const { myCommentList } = this.data;
    // myCommentList.map(item => item.isHl = false);
    // this.setData({ myCommentList });
    // myCommentList.unshift(obj);
    // this.setData({ siv: '' });
    // this.setData({ myCommentList, siv: 'moreComment' });

    const {
      commentList,
      commentTotals
    } = this.data;
    // commentList.map(item => item.isHl = false);
    // this.setData({ commentList });
    commentList.unshift(obj);
    // this.setData({ siv: '' });
    // this.setData({ commentList, siv: 'moreComment' });
    this.setData({
      commentList,
      commentTotals: commentTotals + 1
    });

    wx.setNavigationBarTitle({
      title: `观点（ ${commentTotals + 1} ）`
    });

    this.taphideMask();
  },

  tapSetCommentLike({ currentTarget: { dataset: { commentId } } }) {
    const { commentList, customerId } = this.data;
    commentList.map(item => {
      if (item.id == commentId) {
        item.isLike = item.isLike ? 0 : 1;
        item.commentLikeNum = item.isLike ? ++item.commentLikeNum : --item.commentLikeNum;
        // item.clickBig = item.isLike ? true : false;
      }
    });
    this.setData({ commentList });

    const postData = { customerId, commentId };
    setCommentLike(postData);
  },

  tapReply({ currentTarget: { dataset: { replyType, toReplyId, commentId, toCustomerId, toCustomerName } } }) {
    this.setData({
      'commentInputObj.focus': true,
      'commentInputObj.focus': true,
      commentId
    });


    this.setData({ replyType, toReplyId, toCustomerId, toCustomerName, 'commentInputObj.placeholder': `回复：@${toCustomerName}` });

  },

  /**
    * 添加回复
    */
  addReply() {
    const {
      content,
      commentId,
      customerId,
      replyType,
      toReplyId,
      toCustomerId,
      toCustomerName
    } = this.data;

    const postData = {
      commentId,
      content,
      customerId,
      replyType,
      toCustomerId,
      toReplyId
    };

    wx.showLoading({
      title: '提交中...',
    })
    addReply(postData).then(({ code, data: { id: replyId, gmtCreate } }) => {
      if (code == '10000') {
        this.addReplySucc(replyId, gmtCreate, content, replyType, toReplyId, toCustomerId, toCustomerName);
      } else {
        wx.showToast({
          title: '回复失败！',
          mask: true
        });
      }
      // 清空文本域
      this.setData({
        'commentInputObj.value': '',
        content: ''
      });
    });
  },
  /**
  * 添加回复成功
  */
  addReplySucc(replyId, gmtCreate, content, replyType, toReplyId, toCustomerId, toCustomerName) {
    wx.showToast({
      title: '回复成功！',
      icon: 'success',
      mask: true,
      duration: 1000,
    });

    const { id, nickName, avatarUrl, isVip, vipInfo, isOfficial } = wx.getStorageSync('user');

    const obj = {
      id: replyId,
      // 格式化时间
      gmtCreate: timeFormat(gmtCreate),
      // 被回复者id
      toCustomerId,
      // 被回复者昵称
      toCustomerName,
      replyType,
      content,
      _content: content,//都是内容
      customerId: id,
      customerName: nickName,
      customerImg: avatarUrl,
      totalNum: 0,
      isLike: 0,
      isVip,
      vipInfo,
      isOfficial: isOfficial || 0,
      replyLikeNum: 0,
      isOperate: false,// 回复特例,不显示评论和崇拜
      isAddReply: true,// 回复特例,显示为当前item为回复
      isHl: true
    };

    // 插入更多回答replyList
    // const { replyList } = this.data;
    // replyList.unshift(obj);
    // this.setData({ replyList });

    // const { replyList } = this.data;
    // replyList.map(item => item.isHl = false);
    // this.setData({ replyList });
    // replyList.unshift(obj);
    // this.setData({ siv: '' });
    // this.setData({ replyList, siv: 'moreComment' });

    // const { totalNum } = this.data;
    // this.setData({ totalNum: totalNum + 1, commentId: 0 });
    const { commentList, commentId } = this.data;
    commentList.map((item, i) => {
      if (item.id == commentId) {
        item.replyNum = ++item.replyNum;
        if (item.replyList && item.replyList.length > 0) {
          item.replyList.unshift(obj);
        } else {
          item.replyList = [obj];
        }
      }
    });
    this.setData({
      commentList,
      commentId: 0,
      'commentInputObj.placeholder': '说点什么...'
    });

    this.taphideMask();

  },

  /* input事件相关 end */


  onShow() {

  },


  onHide() {

  },


  onUnload() {

  },


  onPullDownRefresh() {

  },


  onReachBottom() {
    this.getMoreCommentList();
  },
  navigationPersonalPage({ currentTarget: { dataset: { type, beVisitorId } } }) {
    myNavigateTo({ url: `../memberDetail/memberDetail?type=${type}&beVisitorId=${beVisitorId}` });
  },
  navigateToPoster(params) {
    const { productId } = this.data;
    myNavigateTo({ url: `../poster/poster?productId=${productId}&commentId=${params.commentId || 0}` });
  }
  // onShareAppMessage() {

  // }
})