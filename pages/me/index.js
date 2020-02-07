// pages/me/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    hasUserInfo:false,
    canIUse:wx.canIUse("button.open-type.getUserInfo")

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //实现获取用户信息的方法
  getUserInfo:function(e){
    // console.log(e);
    this.setData({
      userInfo:e.detail.userInfo,
      hasUserInfo:true
    })
    console.log(this)
  }
})