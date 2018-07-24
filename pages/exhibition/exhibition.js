// pages/Exhibition/Exhibition.js
import {
  getOrganExhibitionList,
  getArtistExhibitionList

} from './exhibition.service';

const {
  login,
  myNavigateTo
} = getApp();
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
    isLoadMore:true,
    organId: 1,
    artistId:0,
    sort:'',
    type:0,
    sortField:'',
    dataList:[
      // {
      //   title: 'skjfsk',
      //   img: 'https://img.kanhua.yiwaiart.com/Ey_logo_flat.png',
      //   duration: '2017-09-23 ~ 2018-03-12',
      //   num:2333
      // },
      // {
      //   title: 'skjfsk',
      //   img: 'https://img.kanhua.yiwaiart.com/Ey_logo_flat.png',
      //   duration: '2017-09-23 ~ 2018-03-12',
      //   num: 2333
      // }
    ]
  },




  // 获取艺术家展览
  getArtistExhibition() {
    const { isEmpty, pageNo, pageSize, dataList, isLoaded, loadLock, isLoading, sort, sortField } = this.data

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
          artistId: this.data.artistId
        }),
        pageNo: pageNoTemp,
        pageSize,
        sort,
        sortField
      }

      getArtistExhibitionList
        (postData).then(({ code, msg, data }) => {
          if (code === 10000) {
            if (data.data && data.data.length > 0) {

              this.setData({
                dataList: [...dataList, ...this.operateList(data.data)]
              })


              this.setData({
                isLoading: false,
                loadLock: false
              })
              if (data.data.length < 10) {
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
            loadLock: false,
            isLoading: false
          })
        })
    }
  },

  //获取机构展览
  getOrganExhibition() {
    const { isEmpty, pageNo, pageSize, dataList, isLoaded, loadLock, isLoading, sort, sortField } = this.data

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
          organId: this.data.organId
        }),
        pageNo: pageNoTemp,
        pageSize,
        sort,
        sortField
      }

      getOrganExhibitionList
        (postData).then(({ code, msg, data }) => {
          if (code === 10000) {
            if (data.data && data.data.length > 0) {

              this.setData({
                dataList: [...dataList, ...this.operateList(data.data)]
              })

              this.setData({
                isLoading: false,
                loadLock: false
              })
              if (data.data.length < 10) {
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
            loadLock: false,
            isLoading: false
          })
        })
    }
  },

  operateList(list){
    list.map(item=>{
      item.url = `/pages/exhibitionDetails/exhibitionDetails?id=${item.exhibitionId}`
    })
    return list;
  },

  goApplyexhibition(){
    const url = `../applyExhiibition/applyExhibition`;
    myNavigateTo({ url });
  },

  init(){
    if (this.data.type == 2) {
      this.getArtistExhibition();
    }
    if (this.data.type == 3) {
      this.getOrganExhibition();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { type, organId,artistId} = this.data;
    if(options.type){
      this.setData({
          type:options.type
      })
    }
    if(options.organId){
      this.setData({
        organId:options.organId
      })
    }

    if(options.artistId){
      this.setData({
        artistId:options.artistId
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
    this.init()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})