var oppid;
var time;
var ls;
var ls2;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    list: [],
    list2:[],
    scrollHeight: 0
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
    wx.cloud.callFunction({
      // 云函数名称
      name: 'time',
      // 传给云函数的参数
      data: {

      },
    }).then(res => {
      // 计算时间戳
      this.time = Date.parse(new Date(JSON.parse(res.result).sysTime2.replace(/-/g, '/'))) / 1000
      const db = wx.cloud.database({});
      const reserve = db.collection('studyhall-reserve');
      const _ = db.command
      // console.log(this.time)
      reserve.where({
        _openid: oppid,
        studyhallreserve_finishtime: _.lt(this.time)
      }).orderBy('studyhallreserve_begintime', 'desc').get({
        success: (res) => {
          // console.log(res.data)
          this.ls2 = res.data
          this.setData({
            ['list2']: this.ls2
          })
          console.log(this.data.list2)
        }
      });
      reserve.where({
        _openid: oppid,
        studyhallreserve_finishtime: _.gte(this.time)
      }).orderBy('_id', 'desc').get({
        success: (res) => {
          // console.log(res.data)
          this.ls = res.data
          this.setData({
            ['list']: this.ls
          })
          console.log(this.data.list)
        }
      })
    });
  },
  onShow: function(){
    this.setData({
      scrollHeight:2000 
    })
    // console.log(this.ls1.length)
  },
  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;

    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        currentData: e.target.dataset.current
      })
    }
  }
})