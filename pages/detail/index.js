const interfaces = require("../../utils/urlconfing.js");
// pages/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    partData:{},
    biatiao:[],
    baitiaoSelectItem:{
      desc:"【白条支付】首单享立减优惠"
    },
    hideBaitiao:true,
    hideBuy:true,
    badgeCount:0
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
        // console.log(result);
        self.setData({
          partData:result.partData,
          baitiao:result.baitiao
        })
        wx.hideLoading();
      }
    })
  },

  popBaitiaoView(){
    // console.log("显示白条")
    this.setData({
      hideBaitiao:false
    })
  },

  popBuyView() {
    // console.log("显示商品")
    this.setData({
      hideBuy:false
    })
  },

  updateSelectItem(e){
    this.setData({
      baitiaoSelectItem:e.detail
    })
  },

  updateCount(e){
    let partData = this.data.partData;
    partData.count = e.detail.val;
    this.setData({
      partData
    })
  },

  addCart(){
    // console.log("加入购物车")
    let self = this;
    wx.getStorage({
      key: 'cartInfo',
      //查到cartInfo这个数据了，判断数组中是否拥有当前添加的商品
      success(res) {
        // console.log(res)
        let cartArray = res.data;
        //拿到现在添加的商品对象
        let partData = self.data.partData;
        let isExit = false;// 判断数组是否存在该商品

        //匹配本地数组和当前对象的id是否一致
        cartArray.forEach(cart =>{
          if(cart.id == partData.id){
            isExit = true;
            cart.total += self.data.partData.count;
            wx.setStorage({
              key: 'cartInfo',
              data: cartArray,
            })
          }
        })
        if(!isExit){ //不存在商品
          partData.total = self.data.partData.count;
          cartArray.push(partData);
          wx.setStorage({
            key: 'cartInfo',
            data: cartArray,
          })
        }

        //商品数量
        self.setBadge(cartArray)
      },
      fail(){
        let partData = self.data.partData;
        partData.total = self.data.partData.count;
        // console.log(partData);
        let cartArray = [];
        cartArray.push(partData);
        wx.setStorage({
          key: 'cartInfo',
          data: cartArray,
        })

        //商品数量
        self.setBadge(cartArray);
      }
    }),
    wx.showToast({
      title: '加入购物车成功',
      icon:"success",
      duration:3000
    })
  },

  //商品数量方法
  setBadge(cartArray){
    this.setData({
      badgeCount:cartArray.length
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
    const self = this;
    wx.getStorage({
      key: 'cartInfo',
      success: function(res) {
        const cartArray = res.data;
        self.setBadge(cartArray);
      },
    })
  },
  showCartView(){
    wx.switchTab({
      url: '/pages/cart/index',
    })
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