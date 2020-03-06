// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartArray:[],
    totalMoney:"0.00", //总价
    totalCount:0, //商品个数
    selectAll:false, //是否全选
    startX:0,
    startY:0
  },
  setAccount(){
    let shoppingList = [];

    this.data.cartArray.forEach(cart => {
      if(cart.select){
        shoppingList.push(cart)
      }
    })

    //总价 + 商品
    const accountInfo = {
      shoppingList,
      totalMoney:this.data.totalMoney
    }

    //跳转
    wx.navigateTo({
      url: '/pages/order/index?accountInfo=' + JSON.stringify(accountInfo)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let self = this;
    wx.getStorage({
      key: 'cartInfo',
      success(res) {
        const cartArray = res.data;
        cartArray.forEach(cart =>{
          cart.select = false; // 全不选中
          cart.isTouchMove = false; //是否滑动
        })
        self.setData({
          cartArray,
          selectAll:false,
          totalMoney:"0.00",
          totalCount:0
        })

        //设置Tabbar图标
        if (cartArray.length > 0){
          wx.setTabBarBadge({
            index: 2,
            text: String(cartArray.length)
          })
        }else{
          wx.removeTabBarBadge({
            index: 2,
          })
        }
      },
    })
  },
  getCount(e){
    const index = e.currentTarget.dataset.index;
    const cartArray = this.data.cartArray;
    cartArray[index].total = e.detail.val;

    //更新data
    this.setData({
      cartArray
    })
  },
  switchGoodsDetail(e){
    const index = e.currentTarget.dataset.index;
    const cartArray = this.data.cartArray;
    wx.navigateTo({
      url: '/pages/detail/index?id=' + cartArray[index].id,
    })
  },
  selectGood(e){
    const index = e.currentTarget.dataset.index;
    const cartArray = this.data.cartArray;
    
    //合计和数量
    let totalMoney = Number(this.data.totalMoney);
    let totalCount = this.data.totalCount;

    // 选中状态
    let selectAll = this.data.selectAll;
    //设置选中或者不选中状态
    cartArray[index].select = !cartArray[index].select;

    //如果选中
    if(cartArray[index].select){
      totalMoney += Number(cartArray[index].price) * cartArray[index].total;
      totalCount++;
    }else{
      //没有选中
      totalMoney -= Number(cartArray[index].price) * cartArray[index].total;
      totalCount--;
      selectAll = false;
    }

    //更新数据
    this.setData({
      cartArray,
      totalMoney:String(totalMoney.toFixed(2)),
      totalCount,
      selectAll
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //页面离开时更新storage
    const cartArray = this.data.cartArray;
    wx.setStorage({
      key: 'cartInfo',
      data: cartArray,
    })
  },
  subCount(e){
    const index = e.currentTarget.dataset.index;
    const cartArray = this.data.cartArray;
    //合计
    let totalMoney = Number(this.data.totalMoney);

    //计算金额
    if(cartArray[index].select){
      totalMoney -= Number(cartArray[index].price);
    }

    //更新数据
    this.setData({
      totalMoney: String(totalMoney.toFixed(2))
    })
  },
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    const cartArray = this.data.cartArray;
    //合计
    let totalMoney = Number(this.data.totalMoney);

    //计算金额
    if (cartArray[index].select) {
      totalMoney += Number(cartArray[index].price);
    }
    //更新数据
    this.setData({
      totalMoney: String(totalMoney.toFixed(2))
    })
  },
  selectAll(){
    const cartArray = this.data.cartArray;
    let totalMoney = 0;
    let totalCount = 0;
    let selectAll = this.data.selectAll;

    selectAll = !selectAll;
    cartArray.forEach(cart =>{
      //设置选中或不选中状态 和全选按钮是一样的状态
      cart.select = selectAll;
      //计算总金额和商品个数
      if(cart.select){
        totalMoney += Number(cart.price) * cart.total;
        totalCount++;
      }else{
        totalMoney = 0;
        totalCount = 0;
      }
    })

    //更新数据
    this.setData({
      cartArray,
      totalMoney: String(totalMoney.toFixed(2)),
      totalCount,
      selectAll
    })
  },
  touchstart(e){
    // console.log(e)
    //开始触摸时，重置所有删除
    this.data.cartArray.forEach(cart =>{
      if(cart.isTouchMove) //为true的时候
      cart.isTouchMove = false;;//其他对象都为false
    })
    this.setData({
      startX:e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      cartArray:this.data.cartArray
    })
    // console.log(this.data.startX)

  },
  touchmove(e){
    let index = e.currentTarget.dataset.index;
    //开始x 和 y 的坐标
    let startX = this.data.startX;
    let startY = this.data.startY;

    //移动的x和y坐标
    let touchMoveX = e.changedTouches[0].clientX;
    let touchMoveY = e.changedTouches[0].clientY;

    // console.log(touchMoveX,touchMoveY)
    //调用计算角度方法获取角度
    let angel = this.angel({X:startX,Y:startY},{X:touchMoveX,Y:touchMoveY});

    //遍历数组中的所有对象
    this.data.cartArray.forEach((cart,i) =>{
      cart.isTouchMove = false;
      //滑动的角度 > 30 直接 return
      if(Math.abs(angel) > 30) return;

      //匹配
      if(i == index){
        if(touchMoveX > startX){
          //右滑
          cart.isTouchMove = false;
        }else{
          //左滑
          cart.isTouchMove = true;
        }
      }
    })

    //更新数据
    this.setData({
      cartArray:this.data.cartArray
    })
  },
  angel(start,end){
    let _X = end.X - start.X;
    let _Y = end.Y - start.Y;

    //返回角度 Math.atan() 返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  del(e){
    let self = this;
    const index = e.currentTarget.dataset.index;
    wx.getStorage({
      key: 'cartInfo',
      success(res) {
        let partData = res.data;
        partData.forEach((cart,i) =>{
          if(cart.title == self.data.cartArray[index].title){
            partData.splice(i,1);
          }
        })

        //删完之后存储
        wx.setStorage({
          key: 'cartInfo',
          data: partData
        })

        //更新数据
        self.update(index);
      },
    })
  },
  update(index){
    let cartArray = this.data.cartArray;
    let totalMoney = Number(this.data.totalMoney);
    let totalCount = this.data.totalCount;

    //计算价格和数量
    if(cartArray[index].select){
      totalMoney -= Number(cartArray[index].price) * cartArray[index].total;
      totalCount--;
    }

    //删除
    cartArray.splice(index,1);

    //更新数据
    this.setData({
      cartArray:this.data,cartArray,
      totalMoney:String(totalMoney.toFixed(2)),
      totalCount
    })

    //设置tabBar图标
    cartArray.length > 0 ?
    wx.setTabBarBadge({
      index: 2,
      text: String(cartArray.length),
    }) :
    wx.removeTabBarBadge({
      index: 2,
    })
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