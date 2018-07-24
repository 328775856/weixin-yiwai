// pages/SignArtist/SignArtist.js
import {
  getOrganArtistList,
  getExhibitionArtistList
} from './signArtist.service';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    organId:1,
    pageNo: 0,
    pageSize: 10,
    isLoaded: false,    //是否加载完毕，
    loadLock: false,
    isLoading: false,
    isEmpty: false,
    sort: '',
    exhibitionId:1,
    sortField: '',
    emptyDataLike: {
      title: '快把自己的艺术家拉来啊'
    },
    dataList:[
    ]
  },

  getDataList() {
    const {organId, isEmpty, pageNo, pageSize, dataList, isLoaded, loadLock, isLoading, sort, sortField } = this.data

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
          organId
        }),
        pageNo: pageNoTemp,
        pageSize,
        sort,
        sortField
      }

      getOrganArtistList
        (postData).then(({ code, msg, data }) => {
          if (code === 10000) {
            if (data.data && data.data.length > 0) {

              this.setData({
                dataList: [...dataList, ...this.operateOrganList(data.data)]
              })
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

  // 展览艺术家
  getExhibitionList() {
    const { exhibitionId, isEmpty, pageNo, pageSize, dataList, isLoaded, loadLock, isLoading, sort, sortField } = this.data

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
          exhibitionId
        }),
        pageNo: pageNoTemp,
        pageSize,
        sort,
        sortField
      }

      getExhibitionArtistList
        (postData).then(({ code, msg, data }) => {
          if (code === 10000) {
            if (data.data && data.data.length > 0) {
              this.setData({
                dataList: [...dataList, ...this.operateList(data.data)]
              })
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

  operateOrganList(list){
    list.map(item => {
      item.url = `/pages/memberDetail/memberDetail?type=2&beVisitorId=${item.artistId}&isArtist=1`;
    })
    return list;
  },

  operateList(list){
    list.map(item=>{
      item.url = `/pages/memberDetail/memberDetail?type=2&beVisitorId=${item.artistId}&isArtist=1`;
      item.name = item.artistName;
      item.imageUrl = item.artistImageUrl;
    })
    return list;
  },


  // init(){
  //   this.getDataList();
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.organId){
      wx.setNavigationBarTitle({
        title: '签约艺术家'
      })
      const { organId } = options
      this.setData({
        organId
      })
      this.getDataList();
    }

    if(options.exhibitionId){
      const { exhibitionId } = options
      this.setData({
        exhibitionId
      })
      //展览艺术家
      this.getExhibitionList();
      wx.setNavigationBarTitle({
        title: '参展艺术家'
      })
    }

    //this.init()
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