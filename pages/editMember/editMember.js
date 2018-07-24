// pages/EditMember/EditMember.js

import {
  setCustomer,
  getCustomerInfo,
  getArtistInfo,
  getResourceList,
  setArtist,
  setOrgan,
  getOrganByManagerId,
} from './editMember.service';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:false,
    areaInfo: '请选择',
    customerId: 0,
    nickName: '',
    avatarUrl: '',
    country: '',
    gender: 1,
    signature: '',
    trade: '',
    company: '',
    job: '',
    mobile: '',
    isVip: 0,
    isHideTextArea:true,
    vipInfo: '',
    isVirtual: 0,
    isOfficial: 0,
    age: '',
    backgroundImage:'',
    tempAreaText:'',
    province: '',
    city: '',
    artDescription:'',
    type:2,
    ageList: ['60后', '70后', '80后', '90后', '00后'],
    isYour:false,    //用户本人
    isBg:'' ,   //用户背景,
    list:[],
    artistInfo:{
      name: '',
      abbreviation: '',
      characterTag: '',
      figureTag: '',
      region: '',
      id: '',
      birthDate: '',
      deathDate: '',
      nationality: '',
      identityInfo: '',
      imageUrl: '',
      constellation: '',
      videoUrl: '',
      voiceUrl: '',
      artDescription: '',
      customerId: ''
    },
    formData:{},
    organInfo:{}
  },

  bindAgeChange: function (e) {

    this.setData({
      ageIndex: e.detail.value,
      age: this.data.ageList[e.detail.value]
    })

  },

  //获取艺术家信息
  getArtist() {
    const { customerId, formData, backgroundImage, artDescription } = this.data;
    let postData = {
      customerId
    }
    getArtistInfo(postData).then(({ code, msg, data }) => {
      if (+code === 10000) {
        this.setData({
          artDescription: this.replaceStr(data).artDescription,
          formData:this.replaceStr(data),
          backgroundImage: data.backgroundImage == "undefined" ? "https://img.kanhua.yiwaiart.com/pictures/myBg1.jpg" : data.backgroundImage
        })
      } else {
        wx.showToast({
          title: msg,
          duration: 2000
        })
      }
    })
  },

  handleTextArea(e){
    this.setData({
      'artDescription': e.detail.value
    })
    console.log(this.data.artDescription);
  },

  setOrganInfo(obj){
    let postData = {
      OrganInfo:JSON.stringify(obj)
    }
    setOrgan(postData).then(({code,data,msg})=>{
      if (+code === 10000) {
        wx.showToast({
          title: '保存成功',
        })
        setTimeout(()=>{
          wx.navigateBack();
        },1000)
        
      } else {
        wx.showToast({
          title: '保存失败',
        })
      }
    })
  },

  //获取机构简介
  getOrgan(){
    const { customerId, backgroundImage, artDescription, organInfo} = this.data;
    let postData={
      managerId:customerId
    }
    getOrganByManagerId(postData).then(({ code, data, msg }) => {

      if(+code ===10000){
        this.setData({ 
          organInfo: data,
          artDescription: data.briefIntroduction,
          backgroundImage: data.backgroundImage == "undefined" ? "https://img.kanhua.yiwaiart.com/pictures/myBg1.jpg" : data.backgroundImage
         });
      }
     
    });
  },

  replaceStr(obj) {
    if (typeof obj != "object") {
      return
    }
    // description = description.replace(/<\/?[^>]*>/g, "");
    obj.artDescription = obj.artDescription.replace(/<\/?[^>]*>/g, "");
    return obj;
  },

  setArtistInfo(obj){
    let postData = {
      artistInfo:JSON.stringify(obj)
    }
    setArtist(postData).then(({code,msg,data})=>{
      if(+code ===10000){
        wx.showToast({
          title: '保存成功',
        })
        setTimeout(() => {
          wx.navigateBack();
        }, 1000)
      }else{
        wx.showToast({
          title: '保存失败',
        })
      }
    })
  },

  getUser(){
    const { customerId} = this.data;
    let postData = {
      customerId
    }

    getCustomerInfo(postData).then(({code,msg,data})=>{
      if(+code ===10000){
         const {
           nickName,
           avatarUrl,
           country,
           province,
           city,
           gender,
           signature,
           trade,
           company,
           job,
           mobile,
           isVip,
           vipInfo,
           isVirtual,
           isOfficial,
           backgroundImage,
           age
         } = data;

         this.setData({
           customerId,
           nickName,
           avatarUrl,
           country: country || '',
           province: province || '',
           city: city || '',
           gender,
           signature: signature || '',
           trade: trade || '',
           company: company || '',
           job: job || '',
           mobile: mobile || '',
           isVip: isVip || 0,
           vipInfo: vipInfo || '',
           isVirtual: vipInfo || 0,
           isOfficial: isOfficial || 0,
           backgroundImage: backgroundImage || 'https://img.kanhua.yiwaiart.com/pictures/myBg1.jpg',
           age: age || '',
         });

      }else{
        wx.showToast({
          title: msg,
          duration: 2000
        })
      }
    })
  },

  

  handleSubmit(e){
    //const {value} = e.detail.value;

    const {
      customerId,
      nickName,
      avatarUrl,
      country,
      province,
      city,
      gender,
      signature,
      trade,
      company,
      job,
      mobile,
      isVip,
      vipInfo,
      isVirtual,
      isOfficial,
      type,
      backgroundImage,
      age
         } = this.data;

    let postData={
      id:customerId,
      nickName,
      avatarUrl,
      country,
      province,
      city,
      gender,
      signature,
      trade,
      company,
      job,
      mobile,
      isVip,
      vipInfo,
      isVirtual,
      isOfficial,
      backgroundImage,
      age,
      type,
      signature:e.detail.value.signature
    } 

    let customerInfo = {
      customerInfo:JSON.stringify(postData)
    }
    let obj,organobj;
    if(type==2){
      this.data.formData.artDescription = e.detail.value.artDescription;
      obj = Object.assign(this.data.artistInfo,this.data.formData);
    }
    if(type==3){
      this.data.organInfo.briefIntroduction = e.detail.value.artDescription;
      organobj = this.data.organInfo;
    }

    setCustomer(customerInfo).then(({code,data,msg})=>{
      if(+code ===10000){
        if(type==1){
          wx.showToast({
            title: '保存成功',
          })
          setTimeout(() => {
            wx.navigateBack();
          }, 1000)
        }
        if(type ==2){
          this.setArtistInfo(obj);
        }
        if(type ==3){
          this.setOrganInfo(organobj)
        }
      }else{
        wx.hideToast({
          title:'保存失败'
        })
      }
    })
  },

  changeBackground(){
    this.loadPictures()
    this.setData({
      'isShow':true,
      'isHideTextArea':false
    })
  },

   chooseImage(e){
     const { backgroundImage} = this.data;

     const {idx} = e.target.dataset;
      this.setData({
        backgroundImage: this.data.list[idx].url
      })
      this.setData({
        'isShow': false,
        'isHideTextArea':true
      })

   },

  loadPictures(){
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

        }else{

        }
      } else {
        wx.showToast({
          title: msg,
          duration: 2000
        })
      }
    }) 
  },

  handleInput(e){
    if(e.detail.value.length>=30){
      wx.showToast({
        title: '最多输入30个字',
        icon:'none'
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const {id:customerId} = options;
    this.setData({
      customerId
    })

    this.getUser()
    this.setData({
      type:options.type
    })
    if(options.type ==2){
      this.getArtist()
    }
    if(options.type==3){
      this.getOrgan()
    }
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