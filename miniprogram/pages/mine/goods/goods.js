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
    list2: [],
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
      const goodsreserve = db.collection('goods-reserve');
      const _ = db.command
      // console.log(this.time)
      goodsreserve.where({
        _openid: oppid,
        goodsreserve_tag:false

      }).get({
        success: (res) => {
          // console.log(res.data)
          this.ls2 = res.data.reverse()
          this.setData({
            ['list2']: this.ls2
          })
          console.log(this.data.list2)
        }
      });
      goodsreserve.where({
        _openid: oppid,
        goodsreserve_tag: true
      }).get({
        success: (res) => {
          // console.log(res.data)
          this.ls = res.data.reverse()
          this.setData({
            ['list']: this.ls
          })
          console.log(this.data.list)
        }
      })
    });
  },
  onShow: function () {
    this.setData({
      scrollHeight: 2000
    })
    const db = wx.cloud.database({});
    const goodsreserve = db.collection('goods-reserve');
    const _ = db.command
    // console.log(this.time)
    goodsreserve.where({
      _openid: oppid,
      goodsreserve_tag: false

    }).get({
      success: (res) => {
        // console.log(res.data)
        this.ls2 = res.data.reverse()
        this.setData({
          ['list2']: this.ls2
        })
        console.log(this.data.list2)
      }
    });
    goodsreserve.where({
      _openid: oppid,
      goodsreserve_tag: true
    }).get({
      success: (res) => {
        // console.log(res.data)
        this.ls = res.data.reverse()
        this.setData({
          ['list']: this.ls
        })
        console.log(this.data.list)
      }
    })
    // console.log(this.ls1.length)
  },
  onPullDownRefresh:function(){
    const db = wx.cloud.database({});
    const goodsreserve = db.collection('goods-reserve');
    const _ = db.command
    // console.log(this.time)
    goodsreserve.where({
      _openid: oppid,
      goodsreserve_tag: false

    }).get({
      success: (res) => {
        // console.log(res.data)
        this.ls2 = res.data.reverse()
        this.setData({
          ['list2']: this.ls2
        })
        console.log(this.data.list2)
      }
    });
    goodsreserve.where({
      _openid: oppid,
      goodsreserve_tag: true
    }).get({
      success: (res) => {
        // console.log(res.data)
        this.ls = res.data.reverse()
        this.setData({
          ['list']: this.ls
        })
        console.log(this.data.list)
        wx.stopPullDownRefresh();
      }
    })
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