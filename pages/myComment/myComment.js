// pages/myComment/myComment.js
import {
  getCommentPage,
  getMyBestComment
} from './myComment.service';

import timeFormat2 from '../../utils/timeFormat2.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 0,
    pageSize: 10,
    isLoaded: false,    //是否加载完毕，
    loadLock: false,
    isLoading: false,
    isEmpty: false,
    dataList: [],
    bestCommentArr:[],
    presentCustomerId: 0,
    customerId:0,
    sort: '',
    sortField: '',
    beVisitorId: '',
    emptyDataLike:{
      title:'你甘愿做个沉默的人么？'
    },
    isLoadMore: true
  },

  getBestComment() {
    const { dataList, bestCommentArr } = this.data;
    let postData = {
      customerId: this.data.customerId
    }
    getMyBestComment(postData).then(({ code, data, msg }) => {

      if (+code === 10000) {
        if (data && data.length > 0) {
          this.setData({
            bestCommentArr: this.operateBestList(data)
          })
          console.log(this.data.bestCommentArr)
          this.getDataList()
        } else {
          if (!data) {
            this.getDataList()
          }
        }
      }
    })
  },

  operateBestList(list) {
    list.map(item => {
      item.url = `/pages/Picture/Detail?id=${item.productId}`
      item.gmtCreate = timeFormat2(item.gmtCreate);
    })
    return list;
  },

  getDataList() {
    const { customerId, isEmpty, pageNo, pageSize, dataList, isLoaded, loadLock, isLoading, presentCustomerId,sort,sortField } = this.data

    if (!isLoaded && !loadLock) {
      this.setData({
        loadLock: true,
        isLoading: true
      })
      let pageNoTemp = pageNo + 1
      this.setData({
        'pageNo': pageNoTemp
      })
      let postData = {
        searchInfo: JSON.stringify({
          customerId
        }),
        pageNo: pageNoTemp,
        pageSize,
        presentCustomerId,
        sort,
        sortField
      }

      getCommentPage
        (postData).then(({ code, msg, data }) => {
          if (code === 10000) {
            if (data.commentList && data.commentList.length > 0) {

              let tempArr = data.commentList
              let id1, id2, id3, id4, id5;
              if (this.data.bestCommentArr[0]) {
                id1 = this.data.bestCommentArr[0].id;

              }
              if (this.data.bestCommentArr[1]) {
                id2 = this.data.bestCommentArr[1].id;

              }
              if (this.data.bestCommentArr[2]) {
                id3 = this.data.bestCommentArr[2].id;
              }
              if (this.data.bestCommentArr[3]) {
                id4 = this.data.bestCommentArr[3].id;
              }
              if (this.data.bestCommentArr[4]) {
                id5 = this.data.bestCommentArr[4].id;
              }

              let index = tempArr.findIndex((item) => {

                return item.id == id1 || item.id == id2 || item.id == id3 || item.id == id4 || item.id == id5;

              })
              if (index >= 1) {
                tempArr.splice(index, 1);
              }
              this.setData({
                dataList: [...dataList, ...this.operateList(data.commentList)]
              })

              this.setData({
                isLoading: false,
                loadLock: false
              })
              if (data.commentList.length < 10) {
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
                  isLoaded: true
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
    this.getBestComment()
  },

  operateList(list) {
    list.map((item) => {
      item.gmtCreate = timeFormat2(item.gmtCreate);
      item.url = `/pages/Picture/Detail?id=${item.productId}`
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
    this.getDataList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})