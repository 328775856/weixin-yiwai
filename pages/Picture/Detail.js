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
  getMoreCommentList
} from './Detail.service';
Page({
  data: {
    customerId: 0,
    productId: 0,
    // 作品详情

    productDetails: null,
    // 音/视频列表
    isShowPlayer: false,
    mediaList: [],
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
    commentList: [],
    commentListByPage: [],
    pageNo: 1,
    pageSize: 3,
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
    const { id: productId } = options;
    this.setData({ productId });
  },

  init() {
    const {
      id: customerId
    } = wx.getStorageSync('user');
    this.setData({
      customerId
    });

    this.getProductDetails();

    /**
     * 获取评论列表规则
     * 1.上限是6条 依次是my best more 评论
     * 2.先显示3条点击查看更多加载其余3条，再次点击跳转到评论回复详情页
     * 3.如果少于3条不出现查看更多评论 少于6条 不做跳转到详情页面
     * 4.发表评论弹起蒙层，评论完后插到顶部
     */
    this.getSimpleCommentList();

    // // 
    // this.setData({
    //   productDetails: {
    //     // imageUrl: 'https://img.kanhua.yiwaiart.com/picture/59f35a36a98c92392.jpg',
    //     imageUrl: 'https://img.kanhua.yiwaiart.com/picture/5a02bfc4b3f7a5577.jpg',

    //     // imageUrl: 'https://img.kanhua.yiwaiart.com/eyadmin/055f36d4-045c-4c4f-aa3f-172848beef13.jpg',
    //   }
    // });

    // // temp
    // const article = '<p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">1890年，夏天，在法国圣雷米的精神病院。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">他们说，住进这里来，对所有人都好。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">病房有一扇小窗，每天晚上可以从窗户望出去，是法国乡村的夜晚，夜晚散发着柏树的香味。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">人群很远，在山脚下。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">窗外比病房亮得多，因为天空上有星星和月亮。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">它们明亮得好像可以发出声音。可是，医生并不让我晚上画画。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">只能到了白天的时候，拿起画笔颜料，凭记忆画下来。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">于是有了这幅《星空》。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;"><br/></p><p style="text-align: center"><img src="https://img.kanhua.yiwaiart.com/eyadmin/c5d8aeb4-3390-42b8-81d1-cb723be536eb.jpg"/></p><p><span style="font-family: &quot;Helvetica Neue&quot;; font-size: 13px;"><br/></span></p><p><span style="font-family: &quot;Helvetica Neue&quot;; font-size: 13px;">圣雷米夜晚的星空很漂亮，很安静，只有我能听到它们的声音，星星和月亮无时不刻在转动，只有在夜晚，它们才真正活着。</span></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;">———————</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">编者按：</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">距离梵高所作《星空》过去整整114年，直到2004年，美国宇航局和欧洲航天局公布了一张太空望远镜拍摄的太空照片，发现这幅太空摄影与《星夜》竟有很大相似之处。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">这种物质被人们称为“涡状星系”。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">在梵高那里，它就是每晚陪着病痛中的画家入眠的光芒。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;">&nbsp;</p><p style="text-align: center"><img src="https://img.kanhua.yiwaiart.com/eyadmin/3ffbde01-89c3-4d96-82f9-f80ea1af57b8.jpg"/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; text-align: center;">（右：太空望远镜拍摄的恒星）</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">恒星距离地球2万光年，肉眼无法观测到，但梵高做到了。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">艺术家惊人的创造力竟与科学相遇。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">梵高曾在写给弟弟提奥的信中说：</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">当我画一个太阳，我希望人们感觉它在以惊人的速度旋转，正在发出骇人的光热巨浪。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">他一生“痴迷”于追逐光芒，最终竟“看到”了这团星云。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">当一个人对待一件事情的时候，他看待这件事物的角度绝对是独一无二的。</p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;; min-height: 15px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; font-stretch: normal; font-size: 13px; line-height: normal; font-family: &quot;Helvetica Neue&quot;;">当你痴迷某事时，会像梵高一样，勇于追逐自己的“星空”吗？</p>'
    // const that = this;
    // wxParse.wxParse('article', 'html', article, that, 15);



    // const query = wx.createSelectorQuery().in(this);
    // query.select('#textWrp').boundingClientRect(({
    //   height
    // }) => {
    //   console.log(height, 'height');
    //   const {
    //     LIMITH
    //   } = that.data;
    //   if (height > LIMITH) {
    //     that.setData({
    //       limitHeight: LIMITH,
    //       isShowOpen: true
    //     });
    //   }
    // }).exec();

    // this.setData({
    //   commentList: [{
    //     customerImg: 'https://wx.qlogo.cn/mmopen/vi_32/kfMibDakwv2OPaN6LZrpuDrDsPxrZtMTQDM2zkkZrsr0ezdKT0HZQicRHqciavQ7m3COC6ZoU3EaumgTrbzsgqtxA/132'
    //   },
    //   {
    //     customerImg: 'https://wx.qlogo.cn/mmopen/vi_32/kfMibDakwv2OPaN6LZrpuDrDsPxrZtMTQDM2zkkZrsr0ezdKT0HZQicRHqciavQ7m3COC6ZoU3EaumgTrbzsgqtxA/13'
    //   },
    //   {
    //     customerImg: 'https://wx.qlogo.cn/mmopen/vi_32/kfMibDakwv2OPaN6LZrpuDrDsPxrZtMTQDM2zkkZrsr0ezdKT0HZQicRHqciavQ7m3COC6ZoU3EaumgTrbzsgqtxA/132'
    //   }
    //   ]
    // });
  },

  /**
   * 获取作品详情
   */
  getProductDetails() {
    const { customerId, productId, mediaList } = this.data;
    const postData = { customerId, productId };
    getProductDetails(postData).then(({ code, data }) => {
      // 该作品已下架
      if (code == '10001') {
        // toast('该作品已下架！', 2000);
        // timer = setTimeout(() => {
        //   wx.navigateBack();
        // }, 2000);
        return;
      }

      // 拼接音频视频数组
      const { videoImage, videoUrl, voiceUrl } = data;
      if (videoUrl && videoUrl != '') {
        mediaList.push({ imageUrl: videoImage, url: videoUrl, type: 1 });
      }
      if (voiceUrl && voiceUrl != '') {
        mediaList.push({ imageUrl: videoImage, url: voiceUrl, type: 2 });
      }

      console.log(data, 'productDetails');
      this.setData({ productDetails: data, productId: data.id, mediaList });

      const { isPreviewImage } = this.data;
      if (!isPreviewImage) {
        const article = data.proDescription;
        const that = this;
        wxParse.wxParse('article', 'html', article, that, 15);
        const query = wx.createSelectorQuery().in(this);
        query.select('#textWrp').boundingClientRect(({
      height
    }) => {
          console.log(height, 'height');
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
      this.setData({ isPreviewImage: true });
    });
  },

  getSimpleCommentList() {
    Promise
      .all([this.getMyCommentList(), this.getHotCommentList(), this.getMoreCommentList()])
      .then(([arr1, arr2, arr3]) => {
        console.log(arr1)
        console.log(arr2)
        console.log(arr3)
        let arr = [...arr1, ...arr2, ...arr3];
        console.log(arr, '获取简单列表');
        if (arr.length > 6) {
          arr.length = 6;
        }
        arr = this.operateData(arr);
        const pageArr = this.getPageList({ list: arr, pageNo: 1, pageSize: 3 });
        console.log(pageArr, 'pageArr');
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
  getPageList({ list, pageNo, pageSize }) {
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
    const { productId, customerId } = this.data;
    const postData = {
      productId,
      presentCustomerId: customerId
    };
    return getMyCommentList(postData).then(({ data: { commentList } }) => {
      return commentList;
    });
  },
  /**
    * 获取热门评论列表
    */
  getHotCommentList() {
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
  },

  /**
    * 获取更多评论列表
    */
  getMoreCommentList() {
    const { productId, customerId } = this.data;
    const postData = {
      productId,
      presentCustomerId: customerId,
      pageNo: 1,
      pageSize: 6
    };
    return getMoreCommentList(postData).then(({ data: { commentList } }) => {
      return commentList;
    });
  },

  /**
   * 加载更多评论列表
   */
  tapMoreComment() {

  },
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
    const { url } = e.currentTarget.dataset;
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
  tapPlay({ currentTarget: { dataset: { type } } }) {
    // 播放视频
    if (type == 1) {
      this.setData({ isShowPlayer: true });
      const videoCtx = wx.createVideoContext('player');
      videoCtx.play();
      videoCtx.requestFullScreen();
    }
    // 播放音频
    else {
      myNavigateTo({
        url: '../musicDetails/musicDetails'
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
    console.log(e);
  },
  binderrorhead(e) {
    console.log(e);
  }
});