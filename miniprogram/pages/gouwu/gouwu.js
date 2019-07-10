// pages/gouwu/gouwu.js
var oppid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodslist:[],
    goodsId:'',
    time:'',
    money:'',
    userid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database({});
    const goods = db.collection('goods');
    goods.get({
      success: (res) => {
        this.setData({
          goodslist:res.data
        })
        console.log(this.data.goodslist)
      }
    })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'time',
      // 传给云函数的参数
      data: {

      },
    }).then(res => {
      this.data.time = JSON.parse(res.result).sysTime2
      console.log(this.data.time)
    });
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        oppid = res.result.openid
        console.log(oppid)
        const db = wx.cloud.database({});
        const usercount = db.collection('usercount');
        usercount.where({
          _openid: oppid
        }).get().then(res => {
          this.setData({
            money: res.data[0].usercount_count,
            userid:res.data[0]._id
          })
          console.log(this.data.money)
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    });
  },
  goumai:function(e){
    if (e.currentTarget.id == "13dba11c5d25303c045126c56da1aa87"){
      this.setData({
        goodsId:0
      })
    } else if (e.currentTarget.id == "13dba11c5d25307d045140f46e54c117"){
      this.setData({
        goodsId: 1
      })
    } else if (e.currentTarget.id == "9afd9b6a5d253092044fec802a7f4c77"){
      this.setData({
        goodsId: 2
      })
    } else if (e.currentTarget.id == "3e1ef27b5d2530a80450089a633e56dc"){
      this.setData({
        goodsId: 3
      })
    } else if (e.currentTarget.id == "13dba11c5d2530c804515f9d17bca240"){
      this.setData({
        goodsId: 4
      })
    }
    console.log(this.data.goodsId)
    if (this.data.money * 1 >= this.data.goodslist[this.data.goodsId].goods_price*1){
      wx.showModal({
        title: this.data.goodslist[this.data.goodsId].goods_name,
        content: '本次兑换将扣除积分：' + this.data.goodslist[this.data.goodsId].goods_price+'，点击确定后可在我的订单中查看兑换码',
        success: (res) => {
          if (res.confirm) {
            const db = wx.cloud.database({});
            const usercount = db.collection('usercount');
            usercount.doc(this.data.userid).update({
              data: {
                usercount_count: this.data.money * 1 - this.data.goodslist[this.data.goodsId].goods_price * 1
              }
            })
            const goodsreserve = db.collection('goods-reserve')
            goodsreserve.add({
              data: {
                goods_name: this.data.goodslist[this.data.goodsId].goods_name,
                goodsreserve_time: this.data.time,
                goods_img: this.data.goodslist[this.data.goodsId].goods_img,
                goodsreserve_tag: true
              }
            })
            wx.navigateBack({
              delta: 1
            })
            usercount.where({
              _openid: oppid
            }).get().then(res => {
              this.setData({
                money: res.data[0].usercount_count
              })
              console.log(this.data.money)
            })
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '您的余额不足，无法兑换',
      })
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