// pages/Message/Message.js
import {
  getMsgList
} from './message.service';

import timeFormat2 from '../../utils/timeFormat2.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgType:0,
    customerId:0,
    pageNo:0,
    pageSize:10,
    isLoaded:false,    //是否加载完毕，
    loadLock: false,
    isLoading:false,
    isEmpty:false,
    isLoadMore: true,
    emptyDataLike:{
      title:'我本该是吸睛体质啊~'
    },
    messageList:[
    ]
  },

  getMessageList(){
    const { customerId, isEmpty, msgType, pageNo, pageSize, messageList, isLoaded, loadLock, isLoading} = this.data

    if(!isLoaded && !loadLock){
      this.setData({
        loadLock:true,
        isLoading:true
      })
      let pageNoTemp = pageNo + 1
      this.setData({
        'pageNo': pageNoTemp
      })
      let postData = {
        customerId,
        msgType,
        pageNo:pageNoTemp,
        pageSize
      }
      
      getMsgList(postData).then(({ code, msg, data }) => {
        if (code === 10000) {
          if (data.messageList && data.messageList.length > 0) {
            console.log(data.messageList,'消息列表');
            this.setData({
              messageList: [...messageList,...this.operateList(data.messageList)]
            })

            this.setData({
              isLoading: false,
              loadLock: false
            })
            if (data.collectList.length < 10) {
              this.setData({
                isLoading: false,
                isLoadMore: false,
              })
            }
          } else {
            if(pageNoTemp ==1){
             
              this.setData({
                isEmpty:true
              })
            }else{
              this.setData({
                isLoaded:true,
                isLoadMore:false
              })
            }
          }
        } else {
          
          wx.showToast({
            title: msg,
            duration: 2000
          })
        }

        this.setData({
          loadLock:false,
          isLoading:false
        })
      })
    }
  },
  init(){
    this.getMessageList()
  },

  operateList(list) {
    list.map((item, i) => {
      item.gmtCreate = timeFormat2(item.gmtCreate);
      item.customerImg = item.headUrl;
      item.customerId = item.fromCustomerId;
      item.customerName = item.fromCustomerName;
      item.content = item.msgType === 1 ? "" : item.content;
      item.desc = item.msgType ===1 ? "赞了你的观点" + item.content : "回复了你";
    });
    return list;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id: customerId } = wx.getStorageSync('user');
    if (customerId) {
      this.setData({
        customerId
      })
      
    }
    this.init()
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
    this.getMessageList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})