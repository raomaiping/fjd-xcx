const interfaces = require("../../utils/urlconfing.js");
// pages/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    partData:{},
    biatiao:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    const id = options.id;
    const self = this;

    wx.showLoading({
      title: '加载中...',
    })

    wx.request({
      url: interfaces.productionDetail,
      success(res){
        // console.log(res.data);
        let result = null;
        res.data.forEach(data =>{
          if(data.partData.id == id){
            result = data;
          }
        })
        console.log(result);
        self.setData({
          partData:result.partData,
          baitiao:result.baitiao
        })
        wx.hideLoading();
      }
    })
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