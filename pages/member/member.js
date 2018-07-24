// pages/member/member.js
import tabBar from '../../template/tabbar/tabbar';

// 授权:引入
import { auth, loginBefore } from '../../template/auth/auth';
const { login, myNavigateTo, globalData: { isIpx } } = getApp();
import {
  getCustomerInfo,
  getArtistInfo,
  getLikeAndReplyMsgNum,
  getOrganByManagerId
} from './member.service';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    customerId: 0,
    artistName: '',
    organId: '',
    isRead:true,
    userInfo: {

    },
    optionList: [
      {
        icon: '../../images/member/EY_icon_msg_normal@2x.png',
        name: '消息',
        pageUrl: '/pages/message/message',
        type: 0,
      },

      {
        icon: '../../images/member/EY_icon_mypictiur@2x.png',
        name: '我的作品',
        pageUrl: '/pages/exhibitionWorks/exhibitionWorks?type=2',
        type: 2
      },
      {
        icon: '../../images/member/EY_icon_zhanlan@2x.png',
        name: '我的展览',
        pageUrl: '/pages/exhibition/exhibition',
        type: 2
      },
      {
        icon: '../../images/member/EY_icon_zhanlan@2x.png',
        name: '我的展览',
        pageUrl: '/pages/exhibition/exhibition',
        type: 3
      },
      {
        icon: '../../images/member/EY_icon_artist@2x.png',
        name: '签约艺术家',
        pageUrl: '/pages/signArtist/signArtist',
        type: 3,
      },
      {
        icon: '../../images/member/EY_icon_guancang@2x.png',
        name: '我的馆藏',
        pageUrl: '/pages/exhibitionWorks/exhibitionWorks',
        type: 3,
      },
      {
        icon: '../../images/member/EY_icon_coupon@2x.png',
        name: '卡券',
        pageUrl: '/pages/tickets/tickets',
        type: 0
      },

      {
        icon: '../../images/member/EY_icon_collect@2x.png',
        name: '收藏',
        pageUrl: '/pages/collect/collect',
        type: 0
      },
      {
        icon: '../../images/member/EY_icon_comment@2x.png',
        name: '我的观点',
        pageUrl:'/pages/myComment/myComment',
        type: 0
      },
      {
        icon: '../../images/member/EY_icon_like@2x.png',
        name: '我的崇拜',
        pageUrl: '/pages/admirer/admirer',
        type: 0
      },
      {
        icon: '../../images/member/EY_icon_vip@2x.png',
        name: '我要认证',
        pageUrl: '/pages/authArt/authArt',
        type: 1
      }
    ],
    tabType: 2
  },

  getUser() {
    //wx.showLoading();
    const { id: customerId } = wx.getStorageSync('user');
    this.setData({ customerId });
    this.setData({ userInfo: wx.getStorageSync('user') });
    this.getUserInfo();
    //this.init();
  },

  //获取用户信息
  getUserInfo() {
    const {customerId,type} = this.data;
    let postData= {
      customerId
    }
    getCustomerInfo(postData).then(({ code, data, msg }) => {
      if (+code === 10000) {
        wx.hideLoading();
        this.setData({ userInfo: this.operateUserInfo(data) });
        this.getMessage();
        this.setData({
          type:data.type
        })
        if (this.data.type == 2) {
          this.getArtist();
        }
        if (this.data.type == 3) {
          this.getOrgan();
        }
      }
    });
  },

  //获取信息

  getMessage(){
    let postData ={
      customerId:this.data.customerId
    }

    getLikeAndReplyMsgNum(postData).then(({code,data,msg})=>{
      if(+code ===10000){
        const {likeMsgNum,replyMsgNum} = data;
        const { optionList } = this.data;
       
        if(likeMsgNum + replyMsgNum>0){
          this.setData({
            isRead:false
          })

          optionList.map(item=>{
            if(item.name =='消息'){
              
              item.icon = '../../images/member/EY_icon_msg_pop@2x.png'
            }
          })
          this.setData({
            optionList
          })
        }else{
          this.setData({
            isRead:true
          })

          optionList.map(item => {
            if (item.name == '消息') {
              item.icon = '../../images/member/EY_icon_msg_normal@2x.png'
            }
          })

          this.setData({
            optionList
          })
        }
      }
    })
  },

  operateUserInfo(obj){
    if(obj.nickName.length>8){
       obj.nickName = obj.nickName.substr(0, 7) + '...';
    }
    return obj;
  },

  

  //如果是机构
  // 获取机构信息
  getOrgan() {
    const {customerId,optionList,organId} = this.data;
    let postData = {
      managerId: customerId
    }
    getOrganByManagerId(postData).then(({ code, data, msg }) => {
      // 该用户不存在
      if (+code === 10000) {
        //this.setData({ organInfo: data });
        this.setData({
          organId: data.id
        })

        optionList.map(item => {
          if (item.name == "签约艺术家") {
            item.pageUrl = `/pages/signArtist/signArtist?type=3&organId=${this.data.organId}`
          }
          if (item.name == "我的馆藏") {
            item.pageUrl = `/pages/exhibitionWorks/exhibitionWorks?type=3&organId=${this.data.organId}`
          }

          if (item.name == "我的展览") {
            item.pageUrl = `/pages/exhibition/exhibition?type=3&organId=${this.data.organId}`
          }
        })
        this.setData({
          optionList
        })
      }
    });
  },

  //如果用户是艺术家

  getArtist() {
    const { customerId, optionList, artistName, artistId} = this.data;
    let postData = {
      customerId
    }
    getArtistInfo(postData).then(({ code, msg, data }) => {
      if (+code === 10000) {
        this.setData({
          artistInfo: data
        })

        this.setData({
          artistName: data.name,
          artistId:data.id
        })

        optionList.map(item => {
          if (item.name == "我的作品") {
            item.pageUrl = `/pages/exhibitionWorks/exhibitionWorks?type=2&artistName=${this.data.artistName}`
          }
          if (item.name == "我的展览") {
            item.pageUrl = `/pages/exhibition/exhibition?type=2&artistId=${this.data.artistId}`
          }
        })
        this.setData({
          optionList
        })
      } else {
        wx.showToast({
          title: msg,
          duration: 2000
        })
        wx.navigateBack();
      }
    })
  },

  init(){
    this.getUser()
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    tabBar();
    this.init()
    auth(login, this.init);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    loginBefore();
    const { id: customerId } = wx.getStorageSync('user');
    if (customerId) {
      this.init();
    } 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  linkEdit() {
    const url = `../editMember/editMember?id=${this.data.userInfo.id}&type=${this.data.type}`;
    myNavigateTo({ url });
  },
  personalLink() {
    const url = `../memberDetail/memberDetail?type=${this.data.type}&beVisitorId=${this.data.userInfo.id}`;
    myNavigateTo({ url });
  },
})