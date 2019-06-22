// pages/mine/wallet/wallet.js
var oppid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record:'',
    bill:'',
    bill1:'',
    list: []
  },
  change(){
    bill = record / 100;
    record=0;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        oppid = res.result.openid
        console.log(oppid)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    });
    const db = wx.cloud.database({});
    const usercount = db.collection('usercount');
    usercount.where({
      _openid:this.oppid
    }).get({
      success: (res)=>{
        // console.log(res.data[0].usercount_count)
        // var bill1
        // this.bill1 = res.data[0].usercount_count
        this.setData({
          bill: res.data[0].usercount_count
        });
        console.log(this.data.bill)
      }
    })
    // const db = wx.cloud.database({});
    const integral = db.collection('integral');
    integral.where({
      _openid: this.oppid
    }).get({
      success: (res) => {
        // console.log(res.data[0].usercount_count)
        // var bill1
        // this.bill1 = res.data[0].usercount_count
        this.setData({
          record: res.data[0].integral_value
        });
        console.log(this.data.record)
      }
    });
    const flower = db.collection('flower');
    flower.where({
      _openid: this.oppid,
      flower_prcie: db.command.gt('0')
    }).get({
      success: (res) => {
        // console.log(res.data[0].usercount_count)
        // var bill1
        // this.bill1 = res.data[0].usercount_count
        this.setData({
          list:res.data
        });
        console.log(this.data.list)
      }
    });
  },
  open: function() {
    /* wx.showModal({
      title: '充值',
      content: '点击确定将为您的账户充值50元',
      success: (res)=> {
        if (res.confirm) {
          const db = wx.cloud.database({});
          const usercount = db.collection('usercount');
          usercount.doc(this.oppid).update({
            data: {
              usercount_count: this.data.bill+50
            }
          }).then(res=>{
            usercount.where({
              _openid: this.oppid
            }).get({
              success: (res) => {
                // console.log(res.data[0].usercount_count)
                // var bill1
                // this.bill1 = res.data[0].usercount_count
                this.setData({
                  bill: res.data[0].usercount_count
                });
                console.log(this.data.bill)
              }
            })
          })
        }
      }
    }) */
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