/**
 * 你可能感兴趣
 * 1.首先用artistid找同个艺术家的画
 * 2.无数据，找同个标签
 * 3.按照作品倒序找出
 */


import wxp from '../../lib/wx-promisify';
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
  getProductDetails,
  getMyCommentList,
  getHotCommentList,
  getMoreCommentList,
  addComment,
  getCollectState,
  setCollect,
  getProductStatisticsList,
  getProductMediaList,
  getCustomerVote,
  votePeach
} from './Detail.service';
Page({
  data: {
    customerId: 0,
    productId: 0,
    isPeachLike: 0,
    isShowPeach: false,
    // 作品详情
    productDetails: null,
    isCollect: 0,
    // 音/视频列表
    isShowPlayer: false,
    mediaList: [],
    // 富文本
    isShowOpen: false,
    isOpen: false,
    LIMITH: 100,
    limitHeight: 0,

    // 头部图片
    windowWidth: 0,
    imgWidth: 0,
    imgHeight: 0,
    maxHeight: 320,
    isImgLoading: true,
    mt: 0,
    // 是否打开了图片预览
    isPreviewImage: false,

    // 评论
    commentTotals: 0,
    commentList: [],
    commentListByPage: [],
    pageNo: 1,
    pageSize: 3,

    // 作品列表
    productList: [],

    // 发表评论
    commentLock: false,
    content: '',
    commentInputObj: {
      value: '',
      isShowTrue: false,
      focus: false,
      isMask: false,
      placeholder: '说点什么...'
    }
  },
  onShow() {
    /* 授权: 判断是否显示弹框 */
    loginBefore();
    if (wx.getStorageSync('user').id)
      this.init();
  },
  onLoad(options) {
    /* 授权:登录方法 */
    auth(login, this.init);
    const {
      id: productId
    } = options;
    this.setData({
      productId
    });
  },

  init() {
    const {
      id: customerId
    } = wx.getStorageSync('user');
    this.setData({
      customerId
    });


    // // 初始化数据
    // this.setData({
    //   pageNo: 1
    // });
    this.setData({
      productList: []
    });

    this.getProductDetails();
    this.getMediaList();
    /**
     * 获取评论列表规则
     * 1.上限是6条 依次是my best more 评论
     * 2.先显示3条点击查看更多加载其余3条，再次点击跳转到评论回复详情页
     * 3.如果少于3条不出现查看更多评论 少于6条 不做跳转到详情页面
     * 4.发表评论弹起蒙层，评论完后插到顶部
     */
    this.getSimpleCommentList();

    this.getCollectState();

    // 获取投票状态
    /**
     * 获取用户投票信息
     */
    this.getCustomerVote();
    this.isExceedDate();
  },
  isExceedDate() {
    let d1 = new Date();
    let d2 = new Date('2018/07/29 18:00:00');
    if (d1 > d2) {
      this.setData({ isShowPeach: false });
    } else {
      this.setData({ isShowPeach: true });
    }
  },
  getCustomerVote() {
    const { customerId, productId } = this.data;
    console.log(productId, 'productId');
    return getCustomerVote({ customerId }).then(({ code, data: { voteRecords } }) => {
      if (code == '10000') {
        if (voteRecords[0] && productId == voteRecords[0].productId || voteRecords[1] && productId == voteRecords[1].productId || voteRecords[2] && productId == voteRecords[2].productId) {
          this.setData({ isPeachLike: 1 });
        } else {
          this.setData({ isPeachLike: 0 });
        }
        console.log(voteRecords, 'voteRecords');
      }
    });
  },

  /**
   * 投票
   */
  setVotePeach({ currentTarget: { dataset: { isLike } } }) {
    if (isLike == 1) return;
    const { customerId, productId, isPeachLike, productDetails } = this.data;
    const postData = { customerId, productId };
    // 投票中
    wx.showLoading({
      title: '投票中',
      mask: true
    });
    votePeach(postData).then(({ code, msg }) => {
      wx.hideLoading();
      if (code == '10000') {
        this.setData({
          isPeachLike: 1,
          'productDetails.peachNum': isPeachLike == 0 ? ++productDetails.peachNum : --productDetails.peachNum
        });
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
  /**
   * 获取作品详情
   */
  getProductDetails() {
    const {
      customerId,
      productId,
      // mediaList
    } = this.data;
    const postData = {
      customerId,
      productId
    };
    getProductDetails(postData).then(({
      code,
      data
    }) => {
      // 该作品已下架
      if (code == '10001') {
        wx.showToast({
          title: '该作品已下架！',
          mask: true,
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
        //   wx.navigateBack();

        // toast('该作品已下架！', 2000);
        // timer = setTimeout(() => {
        //   wx.navigateBack();
        // }, 2000);
        return false;
      }

      // // 拼接音频视频数组
      // const {
      //   videoImage,
      //   videoUrl,
      //   voiceUrl
      // } = data;
      // if (videoUrl && videoUrl != '') {
      //   mediaList.push({
      //     imageUrl: videoImage,
      //     url: videoUrl,
      //     type: 1
      //   });
      // }
      // if (voiceUrl && voiceUrl != '') {
      //   mediaList.push({
      //     imageUrl: videoImage,
      //     url: voiceUrl,
      //     type: 2
      //   });
      // }
      this.setData({
        productDetails: data,
        productId: data.id,
        // mediaList
      });

      const {
        isPreviewImage
      } = this.data;
      if (!isPreviewImage) {
        const article = data.proDescription;
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
      return true;
    }).then((res) => {
      if (res)
        this.getRelProductList();
    });
  },
  /**
  * 获取媒体播放列表
  */
  getMediaList() {
    const { productId } = this.data;
    getProductMediaList({ productId }).then(({ data: { mediaList } }) => {
      this.setData({ mediaList });
    });
  },

  getSimpleCommentList() {
    Promise
      .all([this.getMyCommentList(), this.getHotCommentList(), this.getMoreCommentList()])
      .then(([arr1, arr2, arr3]) => {
        const {
          commentTotals
        } = this.data;
        this.setData({
          commentTotals: commentTotals + arr1.length + arr2.length
        });
        let arr = [...arr1, ...arr2, ...arr3];
        if (arr.length > 6) {
          arr.length = 6;
        }
        arr = this.operateData(arr);
        const pageArr = this.getPageList({
          list: arr
        });
        this.setData({
          commentList: arr,
          commentListByPage: pageArr
        });
      });
  },
  operateData(list) {
    list.map((item, i) => {
      item.gmtCreate = timeFormat(item.gmtCreate)
    });
    return list;
  },
  /**
   * 分页
   */
  getPageList({
    list
  }) {
    const {
      pageNo,
      pageSize
    } = this.data;
    return list.map((item, i) => {
      if ((i + 1) <= pageNo * pageSize) {
        return item;
      }
    }).filter(item => item != undefined);
  },
  /**
   * 获取我的评论列表
   */
  getMyCommentList() {
    const {
      productId,
      customerId
    } = this.data;
    const postData = {
      productId,
      presentCustomerId: customerId
    };
    return getMyCommentList(postData).then(({
      data: {
        commentList
      }
    }) => {
      return commentList;
    });
  },
  /**
   * 获取热门评论列表
   */
  getHotCommentList() {
    const {
      productId,
      customerId
    } = this.data;
    const postData = {
      productId,
      presentCustomerId: customerId
    };
    return getHotCommentList(postData).then(({
      data: {
        commentList
      }
    }) => {
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
  },

  /**
   * 获取更多评论列表
   */
  getMoreCommentList() {
    const {
      productId,
      customerId
    } = this.data;
    const postData = {
      productId,
      presentCustomerId: customerId,
      pageNo: 1,
      pageSize: 6
    };
    return getMoreCommentList(postData).then(({
      data: {
        commentList,
      totalItems
      }
    }) => {
      this.setData({
        commentTotals: totalItems || 0
      });
      // 获取totalItems
      return commentList;
    });
  },

  getRelProductList() {
    /**
     * 获取感兴趣列表
     * 1.获取同艺术家的作品 artistName
     * 2.获取同风格 proTypeId 随机获取 pageSize为6 随机pageNo出来后-1 如果等于0就取1
     * 3.评论数依次倒序
     * 上限5个
     */
    const getRule1 = () => {
      const {
        productDetails
      } = this.data;
      const postData = {
        pageNo: 1,
        pageSize: 6,
        sortField: '',
        sort: '',
        searchInfo: JSON.stringify({
          artistName: productDetails.artistName,
          // artistName: 'xxxxxx',
          status: 1
        })
      };
      return getProductStatisticsList(postData).then(({
        data: {
          productList
        }
      }) => {
        return productList;
      });
    };
    const getRule2 = ({
      pageNo = 1,
      pageSize = 6
    }) => {
      const {
        productDetails
      } = this.data;
      const postData = {
        pageNo,
        pageSize,
        sortField: '',
        sort: '',
        searchInfo: JSON.stringify({
          proTypeId: productDetails.proTypeId,
          status: 1
        })
      };
      return getProductStatisticsList(postData).then(({
        data: {
          productList,
        totalItems,
        totalPages
        }
      }) => {
        return {
          productList,
          totalPages
        };
      });
    };

    // const getRule3 = () => {
    //   const { productDetails } = this.data;
    //   const postData = {
    //     pageNo: 1,
    //     pageSize: 6,
    //     sortField: '',
    //     sort: '',
    //     searchInfo: JSON.stringify({
    //       status: 1
    //     })
    //   };
    //   return getProductStatisticsList(postData).then(({ data: { productList } }) => {
    //     return productList;
    //   });
    // };

    // 操作列表
    const operateData = (list) => {
      const {
        productId
      } = this.data;
      const arr = list.map((item) => {
        item.id = item.productDto.id;
        item.name = item.productDto.name;
        item.imageUrl = item.productDto.imageUrl;
        return item;
      }).filter(item => item.productId != productId);
      return arr;
    };

    getRule1().then((productList) => {
      if (operateData(productList).length > 0) {
        this.setData({
          productList: operateData(productList)
        });
      } else {
        return getRule2({});
      }
    }).then(({
      totalPages
    }) => {
      const pageNo = parseInt(Math.random() * totalPages + 1, 10);
      getRule2({
        pageNo
      }).then(({
        productList
      }) => {
        this.setData({
          productList: operateData(productList)
        });
      });
    });
  },

  /**
   * 获取作品收藏数量和是否已被收藏
   */
  getCollectState() {
    const {
      customerId,
      productId
    } = this.data;
    const postData = {
      customerId,
      productId
    };
    getCollectState(postData).then(({
      data: {
        collectNum, isCollect
      }
    }) => {
      this.setData({
        isCollect
      });
    });
  },
  /**
   * 加载更多评论列表
   */
  tapMoreComment() {
    const {
      pageNo,
      commentList
    } = this.data;

    if (pageNo >= 2 || commentList.length < 3) {
      const {
        productId
      } = this.data;
      // 跳转
      myNavigateTo({
        url: `../commentDetails/commentDetails?id=${productId}`
      });
      return;
    }

    this.setData({
      pageNo: 2
    });
    const pageArr = this.getPageList({
      list: commentList
    });

    this.setData({
      commentListByPage: pageArr
    });
  },

  tapSetCollect() {
    const { productId, customerId, isCollect } = this.data;
    const postData = {
      productId,
      customerId
    }
    setCollect(postData).then(({ code }) => {
      if (code == 10000) {
        isCollect == 0 ? this.setData({ isCollect: 1 }) : this.setData({ isCollect: 0 });
      }
    })
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
      commentListByPage,
      commentTotals
    } = this.data;
    // commentList.map(item => item.isHl = false);
    // this.setData({ commentList });
    commentList.unshift(obj);
    commentListByPage.unshift(obj);
    // this.setData({ siv: '' });
    // this.setData({ commentList, siv: 'moreComment' });
    this.setData({
      commentList,
      commentListByPage,
      commentTotals: commentTotals + 1
    });
    this.taphideMask();

  },
  /* input事件相关 end */




  /**
   * 头部图片加载
   */
  bindload(e) {
    const {
      maxHeight
    } = this.data;
    let windowWidth = 0;
    let windowHeight = 0;
    wx.getSystemInfo({
      success(res) {
        windowWidth = res.windowWidth;
        windowHeight = res.windowHeight;
      }
    });
    this.setData({
      windowWidth
    });
    let {
      width: imgWidth,
      height: imgHeight
    } = e.detail;
    // 设置原来的宽高
    this.setData({
      originalWidth: imgWidth,
      originalHeight: imgHeight
    });
    const scale = imgHeight / imgWidth;
    if (imgHeight >= maxHeight) {
      imgHeight = maxHeight;
      imgWidth = imgHeight / scale;
    } else {
      // 计算 margin-top
      this.setData({
        mt: (maxHeight - imgHeight) / 2
      });
    }
    this.setData({
      imgWidth,
      imgHeight
    });
    // if (imgWidth > windowWidth) {
    //   // 判断是否有提示过
    //   const already = !wx.getStorageSync('alreadyShowSwipe');
    //   this.setData({ isShowSwipe: already });
    // }
    // 图片加载完毕，关闭loading
    this.setData({
      isImgLoading: false
    });
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

  bindfullscreenchange(e) {

    const { detail: { fullScreen } } = e;

    const videoCtx = wx.createVideoContext('player');
    if (fullScreen) {
      videoCtx.play();
    } else {
      videoCtx.pause();
    }
    this.setData({ isShowPlayer: false });
  },

  alertVideoWrp() {
    this.setData({ isShowPlayer: true });
    const videoCtx = wx.createVideoContext('player');
    videoCtx.play();
    videoCtx.requestFullScreen();
    // // 增加音/视频点击量
    // const { productDetails: { videoUrl } } = this.data;
    // addMaterialClickNum({ materialUrl: videoUrl });
  },
  tapPlay({
    currentTarget: {
      dataset: {
        item

      }
    }
  }) {
    // 播放视频
    if (item.type == 1) {
      this.setData({
        'productDetails.videoImage': item.mediaImage,
        'productDetails.videoUrl': item.mediaUrl,
        isShowPlayer: true
      });
      const videoCtx = wx.createVideoContext('player');
      videoCtx.play();
      videoCtx.requestFullScreen();
    }
    // 播放音频
    else {
      const { mediaTitle, mediaImage, mediaUrl } = item;
      myNavigateTo({
        url: `../musicDetails/musicDetails?mediaTitle=${mediaTitle}&mediaImage=${mediaImage}&mediaUrl=${mediaUrl}`
      })
    }
  },
  // 事件
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

  // 方法
  delHtmlTag(str) {
    // 去掉 &nbsp;
    str = str.replace(/&nbsp;/g, '');
    return str.replace(/<[^>]+>/g, ''); //去掉所有的html标记
  },
  bindloadhead(e) {
  },
  binderrorhead(e) {
  },
  navigateToProductDetails({ currentTarget: { dataset: { id } } }) {
    myNavigateTo({ url: `../Picture/Detail?id=${id}` })
  },
  navigationPersonalPage({ currentTarget: { dataset: { type, beVisitorId } } }) {
    myNavigateTo({ url: `../memberDetail/memberDetail?type=${type}&beVisitorId=${beVisitorId}` });
  },
  navigateToPoster(params) {
    const { productId } = this.data;
    myNavigateTo({ url: `../poster/poster?productId=${productId}&commentId=${params.commentId || 0}` });
  }
});