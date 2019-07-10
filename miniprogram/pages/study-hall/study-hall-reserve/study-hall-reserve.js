// pages/study hall/study hall-reserve/study hall-reserve.js
var util = require('../../../utils/util.js');
var study_price;
var study_name;
var oppid;
var time;
var rid;
var money;
var time2;
var relationtime;
if (getCurrentPages().length != 0) {
  //刷新当前页面的数据
  getCurrentPages()[getCurrentPages().length - 1].onLoad()
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx:'',
    timearray:['半小时','一小时','两小时','三小时'],
    openid:'',
    userid:'',
    book:{
      room_id:'',
      room_time:'',
      room_price_yuan:'',
      room_price:'',
      user_name:'',
      user_call:''
    }
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

  },
  /* 页面初始化，获得当前时间、用户openid、上一页面传参 */
  onLoad: function (option) {
    this.setData({
      idx: option.id,
      ['book.room_id']:option.id
    });
    const db = wx.cloud.database({});
    const studyhalls = db.collection('studyhalls');
    studyhalls.where({
      studyhall_id: option.id
    })
      .get({
        success(res) {
          // console.log(res)
            study_price = res.data[0].studyhall_price,
            study_name = res.data[0].studyhall_name
        }
      });
  },
  bindtime: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timeindex: e.detail.value,
    })
    if(e.detail.value==0){
      this.setData({
        ['book.room_price_yuan']:0.5*study_price+'积分',
        ['book.room_price']: 0.5 * study_price,
        ['book.room_time']:0.5
      })
    }
    if (e.detail.value == 1) {
      this.setData({
        ['book.room_price_yuan']: 1 * study_price + '积分',
        ['book.room_price']: 1 * study_price,
        ['book.room_time']: 1
      })
    }
    if (e.detail.value == 2) {
      this.setData({
        ['book.room_price_yuan']: 2 * study_price + '积分',
        ['book.room_price']: 2 * study_price,
        ['book.room_time']: 2
      })
    }
    if (e.detail.value == 3) {
      this.setData({
        ['book.room_price_yuan']: 3 * study_price + '积分',
        ['book.room_price']: 3 * study_price,
        ['book.room_time']: 3
      })
    }
    if (e.detail.value == 4) {
      this.setData({
        ['book.room_price_yuan']: 4 * study_price + '积分',
        ['book.room_price']: 4 * study_price,
        ['book.room_time']: 4
      })
    }
  },
  username (e) {
    // console.log(e.detail.value)
    this.setData({
      ['book.user_name']:e.detail.value
    })
  },
  usercall(e) {
    // console.log(e.detail.value)
    this.setData({
      ['book.user_call']: e.detail.value
    })
  },
  submit () {
    //表格完整检测
    if (this.data.book.user_name == '' || this.data.book.user_call == ''||this.data.book.room_time == ''){
      wx.showModal({
        title: '提示',
        content: '请将信息填写完整',
        success:function(){

        }
      })
    } else if (this.data.book.user_call.length != 11 || this.data.book.user_call[0]!=1){
      wx.showModal({
        title: '提示',
        content: '请填写正确的手机号',
        success: function () {

        }
      })
    }else{
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          oppid = res.result.openid
          // console.log(oppid)
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      });
      /* ****************************多并发处理**************************** */
      //防止两个用户同时进到预定页面，预定出错。
      const db = wx.cloud.database({});
      const usercount = db.collection('usercount');
      usercount.where({
        _openid: oppid
      }).get().then( res=> {
          if (res.data[0].usercount_count>=this.data.book.room_price){
            console.log(res.data[0])
            this.money = res.data[0].usercount_count
            this.setData({
              userid:res.data[0]._id
            })
            wx.cloud.callFunction({
              // 云函数名称
              name: 'time',
              // 传给云函数的参数
              data: {

              },
            }).then(res => {
              this.time2 = JSON.parse(res.result)
              console.log(Date.parse(new Date(this.time2.sysTime2.replace(/-/g, '/'))) / 1000)
              const db = wx.cloud.database({});
              const studyhalls = db.collection('studyhall-reserve');
              studyhalls.where({
                studyhallreserve_sid: this.data.idx
              })
                .get({
                  success: res => {
                    // console.log(this.relationtime)
                    if (res.data.reverse()[0].studyhallreserve_finishtime * 1 >= Date.parse(new Date(this.time2.sysTime2.replace(/-/g, '/'))) / 1000 * 1){
                      wx.showModal({
                        title: '提示',
                        content: '当前自习室被预定，点击将返回首页',
                        success:(res)=>{
                          if(res.confirm){
                            wx.navigateBack({
                              delta: 1
                            })
                          }
                        }
                      })
                      /* ****************************多并发处理**************************** */
                    }else{
                      wx.showModal({
                        title: '提示',
                        content: '本次将扣除' + this.data.book.room_price + '积分,' + '点击确定后在我的里可以查看自习室预定详情。若点取消，需重新进入该页面进行预定。',
                        success: (res) => {
                          if (res.confirm) {
                            usercount.doc(this.data.userid).update({
                              data: {
                                usercount_count: this.money - this.data.book.room_price
                              }
                            })
                            // console.log(this.data.idx)
                            wx.cloud.callFunction({
                              // 云函数名称
                              name: 'time',
                              // 传给云函数的参数
                              data: {

                              },
                            }).then(res => {
                              this.time = JSON.parse(res.result)
                              this.relationtime = util.formatTime(Date.parse(new Date(this.time.sysTime2.replace(/-/g, '/'))) / 1000 + this.data.book.room_time * 3600, 'Y/M/D h:m:s')
                              const db = wx.cloud.database({});
                              const reserve = db.collection('studyhall-reserve');
                              reserve.add({
                                data: {
                                  studyhallreserve_begintime: this.time.sysTime2,
                                  studyhallreserve_finishtime: Date.parse(new Date(this.time.sysTime2.replace(/-/g, '/'))) / 1000 + this.data.book.room_time * 3600,
                                  studyhallreserve_sid: this.data.book.room_id,
                                  studyhallreserve_hour: this.data.book.room_time,
                                  studyhallreserve_price: this.data.book.room_price,
                                  studyhallreserve_username: this.data.book.user_name,
                                  studyhallreserve_usercall: this.data.book.user_call,
                                  studyhallreserve_relationtime: this.relationtime,
                                  studyhallreserve_studyhallname: '自习室' + this.data.book.room_id
                                }
                              }).then(res => {
                                console.log(res)
                              })
                            })
                            wx.navigateBack({
                              delta: 1
                            })
                          } else if (res.cancel) {
                            wx.navigateBack({
                              delta: 1
                            })
                          }
                        }
                      })
                    }
                  }
                })
            })
          } else{
            wx.showModal({
              title: '提示',
              content: '余额不足请充值',
              success: function () {

              }
            })
          }
      })
    }
  }
})
