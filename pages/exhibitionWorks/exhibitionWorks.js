// pages/ExhibitionWorks/ExhibitionWorks.js
import {
  getOrganProductList,
  getProductStatisticsList,
  findByExhibitionId
} from './exhibitionWorks.service';

const {
  login,
  myNavigateTo
} = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:0,
    pageNo:0,
    pageSize:10,
    productName:'',
    status:'',
    artistName:'',
    sort:'',
    sortField:'',
    list: [],
    organId:0,
    isLoaded: false,    //是否加载完毕，
    loadLock: false,
    isLoading: false,
    isEmpty: false,
    isLoadMore: true,
    emptyDataLike:{
      title:'快来勾搭“service@yiwaiart.com.cn”',
    },
    exhibitionId:0,
  },

// 获取艺术家作品
  getDataList() {
    const { isEmpty, pageNo, artistName, productName, status,sort,sortField, pageSize, list, isLoaded, loadLock, isLoading } = this.data

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
        pageNo: pageNoTemp,
        pageSize,
        searchInfo: JSON.stringify({
          artistName,
          productName,
          status
        }),
        sort,
        sortField
      }

      getProductStatisticsList(postData).then(({ code, msg, data }) => {
        if (code === 10000) {
          if (data.productList && data.productList.length > 0) {
            this.setData({
              list: [...this.operateListProduct(data.productList)]
            })

     

            this.setData({
              isLoading: false,
              loadLock: false
            })
            if (data.productList.length < 10) {
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

  operateListProduct(list) {
    list.map(item => {
      //item.name = item.productDto.name
      item.imageUrl = item.productDto.imageUrl
      item.id = item.productDto.id
    })
    return list;
  },


  operateListName(list) {
    list.map((item) => {
      //item.name = item.productName;
      item.imageUrl = item.productImage;
      item.id = item.productId;
    });
    return list;
  },

  goDetail({ currentTarget: { dataset: { id } } }){

    myNavigateTo({ url: `../Picture/Detail?id=${id}` })
  },

  //获取机构馆藏

  getOrganList() {
    const { isEmpty, sort, sortField, pageNo, pageSize, list, isLoaded, loadLock, isLoading } = this.data

    if (!isLoaded && !loadLock) {
      this.setData({
        loadLock: true,
        isLoading: true
      })
      let pageNoTemp = pageNo + 1
      this.setData({
        pageNo: pageNoTemp
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

      getOrganProductList(postData).then(({ code, msg, data }) => {
        if (code === 10000) {
          if (data.data && data.data.length > 0) {
            this.setData({
              list: [...this.operateListName(data.data)]
            })

            console.log(this.data.list)

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

  //获取展览作品

  getExhibitionList() {
    const { isEmpty, sort, sortField, pageNo, pageSize, list, isLoaded, loadLock, isLoading } = this.data

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
          exhibitionId: this.data.exhibitionId
        }),
        pageNo: pageNoTemp,
        pageSize,
        sort,
        sortField
      }

      findByExhibitionId(postData).then(({ code, msg, data }) => {
        if (code === 10000) {
          if (data.exhibitsList && data.exhibitsList.length > 0) {
            this.setData({
              list: [...this.operateListProduct(data.exhibitsList)]
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

  operateListImageUrl(list){
    list.map(item=>{
      item.imageUrl = item.productDto.imageUrl
    })
    return list;
  },

  init(){
    if (this.data.type == 2) {
      wx.setNavigationBarTitle({
        title: '我的作品'
      })
      this.getDataList();

    }
    if (this.data.type == 3) {
      wx.setNavigationBarTitle({
        title: '我的馆藏'
      })
      this.getOrganList();

    }
    if (this.data.type == 4) {
      wx.setNavigationBarTitle({
        title: '作品'
      })
      this.getExhibitionList()

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type){
      this.setData({
        'type':options.type
      })
    }
    if(options.artistName){
      this.setData({
        'artistName':options.artistName
      })
    }

    if(options.organId){
      this.setData({
        'organId': options.organId
      })
    }

    if (options.exhibitionId){
      this.setData({
        'exhibitionId': options.exhibitionId
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