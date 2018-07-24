// pages/pictureStore/pictureStore.js
import {
  getResourceList
} from './pictureStore.service';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      url: 'http://cued.xunlei.com/demos/publ/img/P_013.jpg'
    }, {
      url: 'http://cued.xunlei.com/demos/publ/img/P_013.jpg'
    }, {
      url: 'http://cued.xunlei.com/demos/publ/img/P_013.jpg'
    }, {
      url: 'http://cued.xunlei.com/demos/publ/img/P_013.jpg'
    }, {
      url: 'http://cued.xunlei.com/demos/publ/img/P_013.jpg'
    }, {
      url: 'http://cued.xunlei.com/demos/publ/img/P_013.jpg'
    }, {
      url: 'http://cued.xunlei.com/demos/publ/img/P_013.jpg'
    }, {
      url: 'http://cued.xunlei.com/demos/publ/img/P_013.jpg'
    }, {
      url: 'http://cued.xunlei.com/demos/publ/img/P_013.jpg'
    }, {
      url: 'http://cued.xunlei.com/demos/publ/img/P_013.jpg'
    }]
  },

  getDataList(){
    const { list } = this.data;
    let postData = {
      type: 6
    }
    getResourceList(postData).then(({ code, msg, data }) => {
      if (+code === 10000) {
        if (data.resourceInfoList && data.resourceInfoList.length > 0) {
          this.setData({
            list: [...data.resourceInfoList]
          })
        }
      } else {
        wx.showToast({
          title: msg,
          duration: 2000
        })
      }
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList()
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})