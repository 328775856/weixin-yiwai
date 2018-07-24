// pages/Admirer/Admirer.js
import {
  getCustomerCommentLike
} from './admirer.service';

import timeFormat2 from '../../utils/timeFormat2.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerId: 0,
    pageNo: 0,
    pageSize: 10,
    isLoaded: false,    //是否加载完毕，
    loadLock: false,
    isLoading: false,
    isEmpty: false,
    isLoadMore:true,
    emptyDataLike: {
      title: '暂无崇拜'
    },
    dataList:[]
  },

  getDataList() {
    const { customerId, isEmpty, pageNo, pageSize, dataList, isLoaded, loadLock, isLoading } = this.data

    if (!isLoaded && !loadLock) {
      this.setData({
        loadLock: true,
        isLoading: true
      })
      let pageNoTemp = pageNo + 1
      this.setData({
        'pageNo':pageNoTemp
      })
      let postData = {
        customerId,
        pageNo: pageNoTemp,
        pageSize
      }

      getCustomerCommentLike
      (postData).then(({ code, msg, data }) => {
        if (code === 10000) {
          if (data.commentLikeList && data.commentLikeList.length > 0) {
            this.setData({
              dataList: [...dataList,...this.operateList(data.commentLikeList)]
            })



            this.setData({
              isLoading: false,
              loadLock: false
            })
            if (data.commentLikeList.length < 10) {
              this.setData({
                isLoading: false,
                isLoadMore: false,
              })
            }
          } else {
            if (pageNoTemp == 1) {

              this.setData({
                isEmpty: true
              })
            } else {
              this.setData({
                isLoaded: true,
                isLoadMore: false
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
          loadLock: false,
          isLoading: false
        })
      })
    }
  },
  init() {
    this.getDataList()
  },

  operateList(list){
    list.map((item) => {
      item.gmtCreate = timeFormat2(item.gmtCreate);
      item.url = `/pages/Picture/Detail?id=${item.commentDto.productId}`
    });
    return list;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id: customerId } = wx.getStorageSync('user');
    if(customerId){
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
    this.getDataList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})