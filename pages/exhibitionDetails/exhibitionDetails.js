//在使用的View中引入WxParse模块
let wxParse = require('../../lib/wxParse/wxParse/wxParse.js');
import timeFormat from '../../utils/timeFormat';

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
  getExhibition,
  getExhibitionArtistList,
  findByExhibitionId,
  getExhibitionCommentPage,
  addExhibitionComment,
  setExhibitionCommentLike,
  getExhibitionTickets
} from './exhibitionDetails.service';

Page({

  data: {
    customerId: 0,
    exhibitionId: 0,
    details: null,

    // 富文本
    isShowOpen: false,
    isOpen: false,
    LIMITH: 100,
    limitHeight: 0,
    // 头部图片
    windowWidth: 0,
    isImgLoading: true,

    // 评论
    commentList: [],
    pageNo: 0,
    pageSize: 10,
    isEmpty: false,
    lock: false,
    isLoaded: false,
    isLoading: true,

    // 展览作品
    productList: [],
    isMore: false,

    isMoreArtist: false,

    // 展券
    ticketsId: 0,
    discount: 0,
    // 发表评论
    commentLock: false,
    content: '',
    commentInputObj: {
      value: '',
      isShowTrue: false,
      focus: false,
      isMask: false,
      placeholder: '说点什么...'
    },
  },

  onLoad(options) {

    /* 授权:登录方法 */
    auth(login, this.init);
    const {
      id: exhibitionId
    } = options;
    this.setData({
      exhibitionId
    });


    let windowWidth = 0;
    wx.getSystemInfo({
      success(res) {
        windowWidth = res.windowWidth;
      }
    });

    this.setData({
      windowWidth
    });
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

    // some function
    this.getExhibition();
    this.getExhibitionArtistList();
    this.findByExhibitionId();
    this.getExhibitionCommentPage();
    this.getExhibitionTickets();
  },
  /**
   * 获取展览详情
   */
  getExhibition() {
    const {
      exhibitionId
    } = this.data;
    const postData = {
      exhibitionId
    };
    getExhibition(postData).then(({
      code,
      data: details
    }) => {
      details.exhibitionStartTime = (details.exhibitionStartTime.split(' ')[0]).replace(/-/g, '.');
      details.exhibitionEndTime = (details.exhibitionEndTime.split(' ')[0]).replace(/-/g, '.');
      this.setData({
        details
      });


      // 显示富文本
      const {
        isPreviewImage
      } = this.data;
      if (!isPreviewImage) {
        const article = details.description;
        const that = this;
        wxParse.wxParse('article', 'html', article, that, 15);
        const query = wx.createSelectorQuery().in(this);
        query.select('#textWrp').boundingClientRect(({
          height
        }) => {
          const {
            LIMITH
          } = that.data;
          if (height > LIMITH) {
            that.setData({
              limitHeight: LIMITH,
              isShowOpen: true
            });
          }
        }).exec();
      }
      this.setData({
        isPreviewImage: true
      });



    });
  },

  /**
   * 获取参展艺术家列表
   */
  getExhibitionArtistList() {
    const {
      exhibitionId
    } = this.data;
    const postData = {
      pageNo: 1,
      pageSize: 5,
      searchInfo: JSON.stringify({
        // 先用1
        // exhibitionId: 1
        exhibitionId
      }),
      sort: '',
      sortField: ''
    }
    getExhibitionArtistList(postData).then(({
      data: {
        data: artistList,
      totalItems
      }
    }) => {
      if (artistList && artistList.length > 0) {
        this.setData({
          artistList,
          isMoreArtist: totalItems >= 5 ? true : false
        });
      }
    });

    const operateData = (list) => {
      list.map((item) => {
        item.id = item.productDto.id;
        item.name = item.productDto.name;
        item.imageUrl = item.productDto.imageUrl;
      });
      return list;
    };
  },
  /**
   * 获取关联作品
   */
  findByExhibitionId() {
    const {
      exhibitionId
    } = this.data;
    const postData = {
      pageNo: 1,
      pageSize: 5,
      searchInfo: JSON.stringify({
        exhibitionId
      }),
      sort: '',
      sortField: ''
    }
    findByExhibitionId(postData).then(({
      data: {
        exhibitsList: productList,
      totalItems
      }
    }) => {
      if (productList && productList.length > 0) {
        this.setData({
          productList: operateData(productList),
          isMore: totalItems >= 5 ? true : false
        });
      }
    });

    const operateData = (list) => {
      list.map((item) => {
        item.id = item.productDto.id;
        item.name = item.productDto.name;
        item.imageUrl = item.productDto.imageUrl;
      });
      return list;
    };
  },

  /**
   * 评论列表
   */
  getExhibitionCommentPage() {
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
      exhibitionId,
        customerId,
        pageNo,
        pageSize
    } = this.data;
      const no = pageNo + 1;
      const postData = {
        searchInfo: JSON.stringify({
          exhibitionId
        }),
        pageNo: no,
        pageSize,
        sortField: '',
        sort: '',
        presentCustomerId: customerId
      };
      getExhibitionCommentPage(postData).then(({
        data: {
         commentList,
        totalItems,
        totalPages
        }
      }) => {
        // setTimeout(() => {

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

        // }, 5000);

      });


    }
  },
  operateData(list) {
    list.map(item => {
      item.gmtCreate = timeFormat(item.gmtCreate);
    });
    return list;
  },

  /**
   * 获取打折数量
   */
  getExhibitionTickets() {
    const { exhibitionId } = this.data;
    getExhibitionTickets({ exhibitionId }).then(({ code, data: { id, discount } }) => {
      if (code == '10000') {
        this.setData({ ticketsId: id, discount });
      }
    });
  },
  tapLoadMore() {
    this.getExhibitionCommentPage();
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

    const postData = { commentId, customerId };
    setExhibitionCommentLike(postData);
  },
  /* input事件相关 begin */
  tapAddComment() {
    // 判断非空
    const {
      content
    } = this.data;
    if (content.trim() == '') {
      wx.showToast({
        title: '观点不能为空！',
        icon: 'none'
      });

      return;
    }
    this.addComment();
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
      'commentInputObj.isShowTrue': false,
      'commentInputObj.isMask': false,
    });
  },

  addComment() {
    const { commentLock } = this.data;
    if (commentLock) return;
    const {
      content,
      exhibitionId,
      customerId
    } = this.data;
    const postData = {
      content,
      customerId,
      exhibitionId,
    };
    wx.showLoading({
      title: '提交中...',
    });
    this.setData({
      commentLock: true
    });

    addExhibitionComment(postData).then(({
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
    });
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
    } = this.data;
    // commentList.map(item => item.isHl = false);
    // this.setData({ commentList });
    commentList.unshift(obj);
    // this.setData({ siv: '' });
    // this.setData({ commentList, siv: 'moreComment' });
    this.setData({
      commentList,
    });
    this.taphideMask();
  },
  /* input事件相关 end */

  // 事件
  tapShowCommentInput() {
    this.setData({
      'commentInputObj.isShowTrue': true,
      'commentInputObj.focus': true,
    });
  },
  tapOpenAll() {
    const {
      isOpen,
      LIMITH
    } = this.data;
    if (isOpen) {
      this.setData({
        limitHeight: LIMITH,
        isOpen: false
      });
    } else {
      this.setData({
        limitHeight: 0,
        isOpen: true
      });
    }
  },
  /**
   * 头部图片加载
   */
  bindload(e) {
    // 图片加载完毕，关闭loading
    this.setData({
      isImgLoading: false
    });
  },
  tapLookMoreArtist() {
    const { exhibitionId } = this.data;
    // 查看更多艺术家
    myNavigateTo({
      url: `../signArtist/signArtist?exhibitionId=${exhibitionId}`
    });
  },
  tapLookMoreProduct() {
    const { exhibitionId } = this.data;
    // 查看更多作品
    myNavigateTo({
      url: `../exhibitionWorks/exhibitionWorks?exhibitionId=${exhibitionId}&type=4`
    });
  },
  navigationPersonalArtistPage({ currentTarget: { dataset: { type, beVisitorId, isArtist } } }) {
    myNavigateTo({ url: `../memberDetail/memberDetail?type=${type}&beVisitorId=${beVisitorId}&isArtist=${isArtist}` });
  },
  navigateToProductDetails({ currentTarget: { dataset: { id } } }) {
    myNavigateTo({ url: `../Picture/Detail?id=${id}` });
  },

  previewImage(e) {
    const {
      url
    } = e.currentTarget.dataset;
    wx.previewImage({
      current: url,
      urls: [url]
    });
  },
  navigateToExhibitionTicket() {
    const {
      exhibitionId,
      // details: {
      //   image,
      //   exhibitionName,
      //   exhibitionStartTime,
      //   exhibitionEndTime,
      //   place,
      //   price,
      // },
      ticketsId,
      discount
    } = this.data;
    // myNavigateTo({ url: `../exhibitionTicket/exhibitionTicket?image=${image}&exhibitionName=${exhibitionName}&exhibitionStartTime=${exhibitionStartTime}&exhibitionEndTime=${exhibitionEndTime}&place=${place}&price=${price}&discount=${discount}&ticketsId=${ticketsId}` });
    myNavigateTo({ url: `../exhibitionTicket/exhibitionTicket?id=${exhibitionId}&ticketsId=${ticketsId}&discount=${discount}` });
  }
  // onShareAppMessage() {

  // }
})