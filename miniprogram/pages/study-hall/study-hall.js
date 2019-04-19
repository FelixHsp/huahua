var util = require('../../utils/util.js');
var time;
var oppid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowYear: '',
    nowMou: '',
    nowDay: '',
    retationtime:''
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
  //页面初始，获取时间，温度，用户openid
  onLoad: function () {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'weather',
      // 传给云函数的参数
      data: {
        code: '101050101'
      },
    }).then(res => {
      console.log(JSON.parse(res.result).data[0])
      // console.log(JSON.parse(res.result).weatherinfo)
      // city = JSON.parse(res.result).weatherinfo.city
      // temp = JSON.parse(res.result).weatherinfo.temp
      this.setData({
        ['weather.city']: JSON.parse(res.result).city,
        ['weather.tem1']: JSON.parse(res.result).data[0].tem1,
        ['weather.tem2']: JSON.parse(res.result).data[0].tem2 + '-',
        ['weather.date']: JSON.parse(res.result).data[0].date,
        ['weather.week']: JSON.parse(res.result).data[0].week,
        ['weather.wea']: JSON.parse(res.result).data[0].wea
        // ['weather.temp']: JSON.parse(res.result).temp+'℃'
      })
    })
      .catch(console.error);
    this.setData({
      /* nowYear: util.formatYear(new Date()),
      nowMou: util.formatMou(new Date()),
      nowDay: util.formatDay(new Date()) */
    });
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
    usercount.doc(oppid).get({
      success: function (res) {
        console.log(res)
      },
      fail: function () {
        usercount.add({
          data: {
            usercount_count: '0'
          }
        })
      }
    })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'time',
      // 传给云函数的参数
      data: {

      },
    }).then(res => {
      // 计算时间戳
      this.time = Date.parse(new Date(JSON.parse(res.result).sysTime2.replace(/-/g, '/'))) / 1000
    })
  },
  //添加数据库
  /* const db = wx.cloud.database({});
    const table = db.collection('todos');
    table.add({
      data: {
        description: "我正在学习云开发！",
        due: new Date(),
        tags: [
          "cloud",
          "database"
        ],
      },
      success: function (res) {
        console.log(res._id)
      }
    }); */
  // 读取数据库
  /* queryData: function () {
    const db = wx.cloud.database({});
    const table = db.collection('todos');
    table.doc("XKhyWHffS3SWfGcV").get({
      success: function (res) {
        console.log(res)
      }
    })
  }, */
  //点击房子，判断是否可用，跳转到预定页面或弹框提示
  click1: function () {
    const db = wx.cloud.database({});
    const studyhalls = db.collection('studyhall-reserve');
    studyhalls.where({
      studyhallreserve_sid: '1'
    })
      .get({
        success: res => {
          /* console.log(typeof (res.data.reverse()[0].studyhallreserve_finishtime))
          console.log(typeof(this.time)) */
          this.data.retationtime = res.data.reverse()[0].studyhallreserve_finishtime
          // console.log(this.data.retationtime)
          // console.log(util.formatTime(this.data.retationtime, 'Y/M/D h:m:s'));
          if (this.data.retationtime * 1 >= this.time * 1) {
            wx.showModal({
              title: '提示',
              content: '当前自习室被占用,' + util.formatTime(this.data.retationtime, 'Y/M/D h:m:s') + '可预订',
              success: function () {
              }
            })
            // console.log(1)
          } else {
            wx.navigateTo({
              url: '../study-hall/study-hall-reserve/study-hall-reserve?id=1',
            })
            // console.log(2)
          }
        }
      })
  },
  click2: function () {
    const db = wx.cloud.database({});
    const studyhalls = db.collection('studyhall-reserve');
    studyhalls.where({
      studyhallreserve_sid: '2'
    })
      .get({
        success: res => {
          /* console.log(typeof (res.data.reverse()[0].studyhallreserve_finishtime))
          console.log(typeof(this.time)) */
          this.data.retationtime = res.data.reverse()[0].studyhallreserve_finishtime
          // console.log(this.data.retationtime)
          // console.log(util.formatTime(this.data.retationtime, 'Y/M/D h:m:s'));
          if (this.data.retationtime * 1 >= this.time * 1) {
            wx.showModal({
              title: '提示',
              content: '当前自习室被占用,' + util.formatTime(this.data.retationtime, 'Y/M/D h:m:s') + '可预订',
              success: function () {
              }
            })
            // console.log(1)
          } else {
            wx.navigateTo({
              url: '../study-hall/study-hall-reserve/study-hall-reserve?id=2',
            })
            // console.log(2)
          }
        }
      })
  },
  click3: function () {
    const db = wx.cloud.database({});
    const studyhalls = db.collection('studyhall-reserve');
    studyhalls.where({
      studyhallreserve_sid: '3'
    })
      .get({
        success: res => {
          /* console.log(typeof (res.data.reverse()[0].studyhallreserve_finishtime))
          console.log(typeof(this.time)) */
          this.data.retationtime = res.data.reverse()[0].studyhallreserve_finishtime
          // console.log(this.data.retationtime)
          // console.log(util.formatTime(this.data.retationtime, 'Y/M/D h:m:s'));
          if (this.data.retationtime * 1 >= this.time * 1) {
            wx.showModal({
              title: '提示',
              content: '当前自习室被占用,' + util.formatTime(this.data.retationtime, 'Y/M/D h:m:s') + '可预订',
              success: function () {
              }
            })
            // console.log(1)
          } else {
            wx.navigateTo({
              url: '../study-hall/study-hall-reserve/study-hall-reserve?id=3',
            })
            // console.log(2)
          }
        }
      })
  },
  click4: function () {
    const db = wx.cloud.database({});
    const studyhalls = db.collection('studyhall-reserve');
    studyhalls.where({
      studyhallreserve_sid: '4'
    })
      .get({
        success: res => {
          /* console.log(typeof (res.data.reverse()[0].studyhallreserve_finishtime))
          console.log(typeof(this.time)) */
          this.data.retationtime = res.data.reverse()[0].studyhallreserve_finishtime
          // console.log(this.data.retationtime)
          // console.log(util.formatTime(this.data.retationtime, 'Y/M/D h:m:s'));
          if (this.data.retationtime * 1 >= this.time * 1) {
            wx.showModal({
              title: '提示',
              content: '当前自习室被占用,' + util.formatTime(this.data.retationtime, 'Y/M/D h:m:s') + '可预订',
              success: function () {
              }
            })
            // console.log(1)
          } else {
            wx.navigateTo({
              url: '../study-hall/study-hall-reserve/study-hall-reserve?id=4',
            })
            // console.log(2)
          }
        }
      })
  },
  click5: function () {
    const db = wx.cloud.database({});
    const studyhalls = db.collection('studyhall-reserve');
    studyhalls.where({
      studyhallreserve_sid: '5'
    })
      .get({
        success: res => {
          /* console.log(typeof (res.data.reverse()[0].studyhallreserve_finishtime))
          console.log(typeof(this.time)) */
          this.data.retationtime = res.data.reverse()[0].studyhallreserve_finishtime
          // console.log(this.data.retationtime)
          // console.log(util.formatTime(this.data.retationtime, 'Y/M/D h:m:s'));
          if (this.data.retationtime * 1 >= this.time * 1) {
            wx.showModal({
              title: '提示',
              content: '当前自习室被占用,' + util.formatTime(this.data.retationtime, 'Y/M/D h:m:s') + '可预订',
              success: function () {
              }
            })
            // console.log(1)
          } else {
            wx.navigateTo({
              url: '../study-hall/study-hall-reserve/study-hall-reserve?id=5',
            })
            // console.log(2)
          }
        }
      })
  },
  click6: function () {
    const db = wx.cloud.database({});
    const studyhalls = db.collection('studyhall-reserve');
    studyhalls.where({
      studyhallreserve_sid: '6'
    })
      .get({
        success: res => {
          /* console.log(typeof (res.data.reverse()[0].studyhallreserve_finishtime))
          console.log(typeof(this.time)) */
          this.data.retationtime = res.data.reverse()[0].studyhallreserve_finishtime
          // console.log(this.data.retationtime)
          // console.log(util.formatTime(this.data.retationtime, 'Y/M/D h:m:s'));
          if (this.data.retationtime * 1 >= this.time * 1) {
            wx.showModal({
              title: '提示',
              content: '当前自习室被占用,' + util.formatTime(this.data.retationtime, 'Y/M/D h:m:s') + '可预订',
              success: function () {
              }
            })
            // console.log(1)
          } else {
            wx.navigateTo({
              url: '../study-hall/study-hall-reserve/study-hall-reserve?id=6',
            })
            // console.log(2)
          }
        }
      })
  },
  click7: function () {
    const db = wx.cloud.database({});
    const studyhalls = db.collection('studyhall-reserve');
    studyhalls.where({
      studyhallreserve_sid: '7'
    })
      .get({
        success: res => {
          /* console.log(typeof (res.data.reverse()[0].studyhallreserve_finishtime))
          console.log(typeof(this.time)) */
          this.data.retationtime = res.data.reverse()[0].studyhallreserve_finishtime
          // console.log(this.data.retationtime)
          // console.log(util.formatTime(this.data.retationtime, 'Y/M/D h:m:s'));
          if (this.data.retationtime * 1 >= this.time * 1) {
            wx.showModal({
              title: '提示',
              content: '当前自习室被占用,' + util.formatTime(this.data.retationtime, 'Y/M/D h:m:s') + '可预订',
              success: function () {
              }
            })
            // console.log(1)
          } else {
            wx.navigateTo({
              url: '../study-hall/study-hall-reserve/study-hall-reserve?id=7',
            })
            // console.log(2)
          }
        }
      })
  },
  click8: function () {
    const db = wx.cloud.database({});
    const studyhalls = db.collection('studyhall-reserve');
    studyhalls.where({
      studyhallreserve_sid: '8'
    })
      .get({
        success: res => {
          /* console.log(typeof (res.data.reverse()[0].studyhallreserve_finishtime))
          console.log(typeof(this.time)) */
          this.data.retationtime = res.data.reverse()[0].studyhallreserve_finishtime
          // console.log(this.data.retationtime)
          // console.log(util.formatTime(this.data.retationtime, 'Y/M/D h:m:s'));
          if (this.data.retationtime * 1 >= this.time * 1) {
            wx.showModal({
              title: '提示',
              content: '当前自习室被占用,' + util.formatTime(this.data.retationtime, 'Y/M/D h:m:s') + '可预订',
              success: function () {
              }
            })
            // console.log(1)
          } else {
            wx.navigateTo({
              url: '../study-hall/study-hall-reserve/study-hall-reserve?id=8',
            })
            // console.log(2)
          }
        }
      })
  },
  click9: function () {
    const db = wx.cloud.database({});
    const studyhalls = db.collection('studyhall-reserve');
    studyhalls.where({
      studyhallreserve_sid: '9'
    })
      .get({
        success: res => {
          /* console.log(typeof (res.data.reverse()[0].studyhallreserve_finishtime))
          console.log(typeof(this.time)) */
          this.data.retationtime = res.data.reverse()[0].studyhallreserve_finishtime
          // console.log(this.data.retationtime)
          // console.log(util.formatTime(this.data.retationtime, 'Y/M/D h:m:s'));
          if (this.data.retationtime * 1 >= this.time * 1) {
            wx.showModal({
              title: '提示',
              content: '当前自习室被占用,' + util.formatTime(this.data.retationtime, 'Y/M/D h:m:s') + '可预订',
              success: function () {
              }
            })
            // console.log(1)
          } else {
            wx.navigateTo({
              url: '../study-hall/study-hall-reserve/study-hall-reserve?id=9',
            })
            // console.log(2)
          }
        }
      })
  },
})