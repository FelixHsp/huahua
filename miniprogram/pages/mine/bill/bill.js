// pages/mine/bill/bill.js
// var oppid;
var ls;
Page({
  data: {
    list: [],
    list2:{},
    oppid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.setData({
          oppid: res.result.openid
        })
        // this.data.oppid=res.result.openid
        console.log(this.data.oppid)
        const db = wx.cloud.database({});
        const reserve = db.collection('studyhall-reserve');
        reserve.where({
          _openid: this.data.oppid
        }).orderBy('studyhallreserve_begintime', 'desc').get({
          success: (res) => {
            // console.log(res.data)
            this.ls = res.data
            this.setData({
              ['list']: this.ls
            })
            console.log(this.data.list)
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    });
    // console.log(this.data.list)
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