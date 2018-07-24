## 意外小程序 v3.0

### 编程注意点

#### 页面涉及到用户id(customerId)的，必须要进行授权后才能显示页面，需要调用 auth 模板来进行授权登陆
#### 注意:不需要被分享的页面,看此页的来源页，如果此页的来源页已经授权登陆过，那么此页就不需要授权登陆

不需要被分享的页面必须删除掉 onShareAppMessage 这个方法
onShareAppMessage() {
    return {
      title: '点我！10分钟提升你的艺术认知',
      path: 'pages/Index/Index'
    };
},
- 在js文件中引入
/* 授权:引入 */
import { auth, loginBefore } from '../../template/auth/auth';
const { login } = getApp();
...
 /** 
  * 在onLoad里面这样调用 
  * onLoad 是页面只执行一次如果跳转到其他页面再返回就不执行，onShow为每次显示页面都会调用
  * auth(login,this.init); 方法必须写在onLoad方法中
  * loginBefore(); 可以不写在onLoad方法中，可以写在onShow中，具体看业务场景
  */
 onLoad() {
    /* 授权:登录方法 */
    auth(login,this.init);
    /* 授权: 判断是否显示弹框 */
    loginBefore();
    if (wx.getStorageSync('user').id)
      this.init();
 },
 /** 
  * 页面初始化一些参数，接口 等
  */
 init() {
    const { id: customerId } = wx.getStorageSync('user');
    this.setData({ customerId });
    ...
 },
...
- 在wxml文件中
<!-- 授权:ui模板 begin-->
<import src="../../template/auth/auth" />
<template is="auth" data="{{showAuthAlert}}"></template>
<!-- 授权:ui模板 end-->
一般要在页面的外部view层判断，因为如果没有用户的话，会弹起授权弹框，如果页面存在内容会闪过，导致不美观
<view wx:if="{{customerId!=0}}">
  // dom
</view>
即可！

#### 涉及到 列表 的页面看需要可以提取模板到template文件夹中
#### pages 所有文件夹/文件都用小写
#### images为存放一些小icon 需要经过 https://tinypng.com/ 压缩后存放
