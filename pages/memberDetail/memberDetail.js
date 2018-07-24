// pages/MemberDetail/MemberDetail.js
import {
  getCommentPage,
  getCustomerInfo,
  getOrganByManagerId,
  getOrganExhibitionList,
  getOrganProductList,
  getArtistInfo,
  getOrganArtistList,
  getProductStatisticsList,
  getMyBestComment,
  getArtistDetails
} from './memberDetail.service';

const { login, myNavigateTo, globalData: { isIpx } } = getApp();

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
    isLoadMore:true,
    organId:'',
    artistName:'',
    productName:'',
    status:'',
    dataList: [],
    bestCommentArr:[],
    organList: [],//机构展览列表
    productList:[],  //馆藏
    userInfo:{},
    artistProductList:[],
    organInfo:{},
    artistInfo:{},
    artistList:[],  
    type:1,
    isVip:true,
    presentCustomerId:0,
    sort:'',
    artistId:0,
    sortField:'',
    beVisitorId:0,
    artistTotalItems:0,
    organTotalItems:0,
    artistListTotal:0,
    productListTotal:0,
    exhibitionList: [
    ]
  },

  // 获取优秀评论

  getBestComment(){
    const { dataList, bestCommentArr} = this.data;
    let postData = {
      customerId: this.data.beVisitorId
    }
    getMyBestComment(postData).then(({code,data,msg})=>{

      if(+code ===10000){
        if(data && data.length>0){
          this.setData({
            bestCommentArr:this.operateBestList(data)
          })
          console.log(this.data.bestCommentArr)
        }else{
          if(!data){
            this.getDataList()
          }
        }
      }
    })
  },


  operateBestList(list){
    list.map(item=>{
      item.isGood = true;
      item.gmtCreate = timeFormat2(item.gmtCreate);
    })
    return list;
  },



  // 获取评论列表
  getDataList() {
    const { customerId, isEmpty, pageNo, pageSize, dataList, isLoaded, loadLock, isLoading, sort, sortField, presentCustomerId } = this.data

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
        searchInfo:JSON.stringify({
          customerId: this.data.beVisitorId
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
              let id1, id2,id3,id4,id5;
              if (this.data.bestCommentArr[0]){
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
             
              let index = tempArr.findIndex((item)=>{

              return item.id == id1 || item.id == id2 || item.id == id3 || item.id == id4 || item.id == id5;
                
              })
             if(index>=1){
               tempArr.splice(index, 1);
             }
             
             this.setData({
               isLoading: false,
               loadLock: false
             })
              this.setData({
                dataList: [...dataList, ...(this.operateList(tempArr))]
              })
             
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

  
  // 获取机构信息
  getOrgan(){
    const userSign = 'organInfo.signature';
    getOrganByManagerId({ managerId: this.data.beVisitorId }).then(({ code, data, msg }) => {
      // 该用户不存在
      if (code == '10001') {
        wx.hideLoading();
        toast('该机构不存在！', 2000);
        timer = setTimeout(() => {
          wx.navigateBack();
        }, 2000);
        return;
      }
      this.setData({ organInfo: data });
      this.setData({
        'organId':data.id
      })
      this.setData({
        [userSign]: this.data.organInfo.signature ? this.data.organInfo.signature : ''
      });

      //获取机构展览
      this.getOrganExhibition();
      this.getProduct();
      this.getOrganArtist();
    });
  },




  //获取机构展览

  getOrganExhibition() {
    const { isEmpty, pageNo, pageSize, organList, isLoaded, loadLock, isLoading, sort, sortField } = this.data

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
        (postData).then(({ code, msg, data, totalItems }) => {
          if (code === 10000) {
            if (data.data && data.data.length > 0) {
              
              this.setData({
                organList: [...organList, ...data.data],
                organTotalItems:totalItems
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

  //获取馆藏

  getProduct(){
    const { pageNo, pageSize, productList, sort, sortField } = this.data
    let postData = {
      searchInfo: JSON.stringify({
        organId: this.data.organId
      }),
      pageNo,
      pageSize:5,
      sort,
      sortField
    }
    getOrganProductList(postData).then(({code,msg,data})=>{
      if(+code ===10000){
        if(data.data && data.data.length>0){
          this.setData({
            productList: [...productList, ...this.operateListName(data.data)],

            productListTotal: data.totalItems
          })
        }
      }else{
        wx.showToast({
          title: msg,
          duration: 2000
        })
      }
    })
  },

  // 获取签约艺术家

  getOrganArtist() {
    const { pageNo, pageSize, artistList, sort, sortField } = this.data
    let postData = {
      searchInfo: JSON.stringify({
        organId: this.data.organId
      }),
      pageNo,
      pageSize: 5,
      sort,
      sortField
    }
    getOrganArtistList(postData).then(({ code, msg, data }) => {
      if (+code === 10000) {
        if (data.data && data.data.length > 0) {
          this.setData({
            artistList: [...artistList, ...this.operateListName(data.data)],
            artistListTotal:data.totalItems
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

  //获取个人信息
  getUser(){
    const userSign = 'userInfo.signature';
    getCustomerInfo({ customerId: this.data.beVisitorId }).then(({code,data,msg}) => {
      // 该用户不存在
      if (+code == 10001) {
        wx.hideLoading();
        toast('该用户不存在！', 2000);
        timer = setTimeout(() => {
          wx.navigateBack();
        }, 2000);
        return;
      }
      this.setData({ userInfo: this.addBackgroundImage(data) });
      this.setData({
        [userSign]: this.data.userInfo.signature ? this.data.userInfo.signature : '这个用户很懒,什么东西都没有留下'
      });
    });
  },

  addBackgroundImage(obj) {
    if (!obj.backgroundImage) {
      obj.backgroundImage = 'https://img.kanhua.yiwaiart.com/pictures/myBg1.jpg'
    }
    return obj;
  },

// 获取艺术家信息
  getArtist(){
    const { artistInfo} = this.data;
    let postData = {
      customerId: this.data.beVisitorId
    }
    getArtistInfo(postData).then(({code,msg,data})=>{
      if(+code ===10000){
        this.setData({
          artistInfo: this.replaceStr(data)
        })
        this.setData({
          'artistName':data.name
        })
        this.getArtistList()

      }else{
        wx.showToast({
          title: msg,
          duration: 2000
        })
      }
    })
  },

  replaceStr(obj){
    if(typeof obj !="object"){
      return 
    }
    obj.artDescription = obj.artDescription.replace(/<\/?[^>]*>/g, "");
    return obj;
  },

  // 评论头像跳到个人中心

  navigationPersonalArtistPage({ currentTarget: { dataset: { type, beVisitorId, isArtist } } }) {
    myNavigateTo({ url: `../memberDetail/memberDetail?type=${type}&beVisitorId=${beVisitorId}&isArtist=${isArtist}` });
  }, 

  navigateToProductDetails({ currentTarget: { dataset: { id } } }) {
    myNavigateTo({ url: `../Picture/Detail?id=${id}` })
  },

  init() {
    //this.getUser()
    // 执行个人主页
    const {type} = this.data;
    if(type==1){         // 个人主页
      //this.getDataList();  //获取个人评论列表
      this.getBestComment();
      this.getUser();
    }else if(type==2){  // 艺术家主页
    if(this.data.artistId>0){
      this.getArtistDetail();
    }else{
      this.getUser();
      this.getArtist();
    }
     
     
    } else if(type==3){
      this.getOrgan();
      // this.getOrganExhibition();
    }else{
      this.getDataList();  //获取个人评论列表
      this.getUser();
    }
  },

  // 普通方法获取艺术家详情
  getArtistDetail(){
    const {userInfo} = this.data;
    let postData={
      customerId:0,
      artistId:this.data.artistId
    }

    getArtistDetails(postData).then(({code,data,msg})=>{
      if(+code ===10000){
        this.setData({
          'artistName': data.name
        })
        this.setData({
          userInfo: this.operateObj(data),
          artistInfo:this.operateObj(data)
        })
        this.getArtistList();

      }
    })
  },

  operateObj(obj){
     obj.backgroundImage = 'https://img.kanhua.yiwaiart.com/pictures/myBg1.jpg';
     obj.avatarUrl = obj.imageUrl;
     obj.nickName = obj.name;
     obj.artDescription = obj.artDescription.replace(/<\/?[^>]*>/g, "");
     return obj;
  },

  operateList(list) {
    list.map((item) => {
      item.gmtCreate = timeFormat2(item.gmtCreate);
    });
    return list;
  },

  operateListArray(list){
    let id1,id2,id3,id4,id5;
    if (this.data.bestCommentArr[0]){
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

    
   let index = list.findIndex((item)=>{

      item.id == id1 || item.id == id2 || item.id == id3 || item.id == id4 || item.id == id5;
    })

    if(index>-1){
      list.splice(index, 1);
    }
  
    return list;
  },

  // getNewArray(resultArr,receiveArray){
  //   for(let i=0;i<receiveArray.length;i++){
  //     if(this.check(resultArr,receiveArray[i])==-1){
  //       resultArr.push(receiveArray[i]);
  //     }
  //   }
  //   return resultArr;
  // },

//  check(receiveArray, checkItem){
//    if(receiveArray.length>0){
//      let index = -1;  // 函数返回值用于布尔判断

//      for (let i = 0; i < receiveArray.length; i++) {
//        if (receiveArray[i].id == checkItem.id) {
//          index = i;
//          break;
//        }
//      }
//      return index;
//    }else{
//      return -1;
//    }
//   },

  operateListName(list){
    list.map((item)=>{
      item.name = item.productName;
      item.imageUrl = item.productImage;
      item.id = item.productId;
    });
    return list;
  },

//获取艺术家作品
  getArtistList(){
    const { pageNo, productName,artistName,status, pageSize, artistProductList, sort, sortField}  = this.data;

    let postData= {
      pageNo,
      pageSize:5,
      searchInfo:JSON.stringify({
        artistName,
        productName,
        status
      }),
      sort,
      sortField
    }

    getProductStatisticsList(postData).then(({code,data,msg})=>{
      if(+code===10000){
        
        this.setData({
          artistProductList: this.operateBestListProduct(data.productList),
          artistTotalItems:data.totalItems
        })

      }else{
        wx.showToast({
          title: msg,
          duration: 2000
        })
      }
    })
  },

  operateBestListProduct(list){
    list.map(item=>{
      item.name= item.productDto.name
      item.imageUrl = item.productDto.imageUrl
      item.id = item.productDto.id
    })
    return list;
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.isArtist==1){
      this.setData({
        type: options.type == "undefined" ? "2" : options.type,
        artistId:options.beVisitorId
      })
    }else{
        this.setData({
          type: options.type == "undefined" ? "2" : options.type,
          beVisitorId: options.beVisitorId
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
    const {type} = this.data
    if(type ==1){
      this.getDataList()
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})