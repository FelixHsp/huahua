// pages/flower/flower.js
var num = 60 //计时器计数标志
Page({
  /**
   * 页面的初始数据
   */
  data: {
    min: 45, //分
    sec: "00", //秒
    isAbled: false,
    isShow: true, //主页面和选花页面显隐切换
    picture: '', //图片选择
    isBtnShow: true, //按钮转换
    isFloShow: false, //默认图片显隐
    _num: 0, //选择花的时候点上会有特殊显示的标识位
    loading: '', //定时器
    long:'',
    price:'',
    time:'',
    value:'',
    tag:'',
    oppid:'',
    money:'',
    userid:''
  },

  //从前台切到后台的时候重置计时器
  onHide: function() {
    this.giveUp()
  },

  //滑动silder时间数字改变
  bindValue: function(e) {
    this.setData({
      min: e.detail.value
    })
  },

  //开始按钮
  ok: function() {
    this.setData({
      isShow: false
    })
  },

  //倒计时
  play: function() {
    this.setData({
      loading: setInterval(this.move, 1000)
    })
    // timer = setInterval(this.move, 1000);
  },

  //选花之后的确定按钮
  start: function(e) {
    const db = wx.cloud.database({});
    const usercount = db.collection('usercount');
    usercount.where({ _openid: this.data.oppid }).get({
      success: (res) => {
        this.setData({
          money: res.data[0].usercount_count
        })
        console.log(this.data.money)
      },
      fail: (err) => {
        console.error(err)
      }
    })
    this.setData({
      isAbled: true,
      isShow: true,
      isFloShow: true,
      isBtnShow: false,
      min: this.data.min - 1,
      // _crl: 1
    })
    clearInterval(this.data.loading);
    this.play()
    this.data.long=this.data.min + 1
    if (this.data.long>=15 && 30>this.data.long){
      this.data.price='10'
    } else if (this.data.long >= 30 && 60 > this.data.long){
      this.data.price='25'
    } else if (this.data.long >= 60 && 120 > this.data.long){
      this.data.price='55'
    }else if(this.data.long == 120){
      this.data.price=='120'
    }
    // console.log(this.data.price)
  },

  //放弃按钮
  giveUp() {
    this.setData({
      min: 45, //重置分
      sec: "00", //重置秒
      isBtnShow: true,
      isAbled: false,
      isFloShow: false,
      // _crl: 0
    })
    const db = wx.cloud.database({});
    const usercount = db.collection('usercount');
    usercount.where({ _openid: this.data.oppid }).get({
      success: (res) => {
        this.setData({
          money: res.data[0].usercount_count
        })
        console.log(this.data.money)
      },
      fail: (err) => {
        console.error(err)
      }
    })
    clearInterval(this.data.loading);
    num = 60; //重置标志位
    return
  },

  //定时器执行函数
  move() {
    console.log(this.data.min+1)
    if (this.data.min==14 && this.data.sec=='55'){
      /* console.log(this.data.long)
      console.log(this.data.price) */
      const db = wx.cloud.database({});
      const flower = db.collection('flower');
      flower.add({
        data:{
          flower_time: this.data.long,
          flower_prcie:this.data.price,
          flower_img:this.data.picture,
          flower_begin:this.data.time
        }
      });
      const usercount = db.collection('usercount');
      usercount.doc(this.data.userid).update({
          data:{
            usercount_count:this.data.money*1+this.data.price*1
          }
      })
    }
    
    //给秒补零
    var strS = this.zeroFill('' + parseInt(num % 60), 2)

    this.setData({
      sec: strS,
    })

    //当时间归零停止计时器
    if (this.data.min == 0 && num == 0) {
      this.giveUp()
      return
    }

    //秒到0了分-1
    if (num == 0) {
      this.setData({
        min: this.data.min - 1
      })
      num = 60
      return
    }
    //每秒递减
    num--
  },

  //补零函数
  zeroFill(str, n) {
    //补零方法，str为数字字符串 n为需要的位数，不够补零
    if (str.length < n) {
      str = '0' + str
    }
    return str
  },

  //选花
  click1: function(e) {
    this.setData({
      picture: 'https://6c65-learninglife-c8aa8e-1258848626.tcb.qcloud.la/flower%20new/36.png?sign=0d1452d52b41abf6c6f11ae2780d8d17&t=1561213915',
      _num: e.target.dataset.num
    })

  },
  click2: function(e) {
    this.setData({
      picture: 'https://6c65-learninglife-c8aa8e-1258848626.tcb.qcloud.la/flower%20new/32.png?sign=ad1887531a3657a401b712dfb333bb6a&t=1561213947',
      _num: e.target.dataset.num

    })
  },
  click3: function(e) {
    this.setData({
      picture: 'https://6c65-learninglife-c8aa8e-1258848626.tcb.qcloud.la/flower%20new/50.png?sign=df7f35d559b0816245c959c2c4cdf8dc&t=1561213958',
      _num: e.target.dataset.num

    })
  },
  click4: function(e) {
    this.setData({
      picture: 'https://6c65-learninglife-c8aa8e-1258848626.tcb.qcloud.la/flower%20new/42.png?sign=5080b0503b2b93a3a5f4cf8b98d92599&t=1561213972',
      _num: e.target.dataset.num

    })
  },
  click5: function(e) {
    this.setData({
      picture: 'https://6c65-learninglife-c8aa8e-1258848626.tcb.qcloud.la/flower%20new/41.png?sign=f22d8ff4e49c43c7cc2c2241b7e39282&t=1561213984',
      _num: e.target.dataset.num

    })
  },
  click6: function(e) {
    this.setData({
      picture: 'https://6c65-learninglife-c8aa8e-1258848626.tcb.qcloud.la/flower%20new/40.png?sign=8555462a365c1ab83bea1c92e1046e93&t=1561213995',
      _num: e.target.dataset.num
    })
  },
  gogouwu:function(){
    wx.navigateTo({
      url: '../gouwu/gouwu',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onLoad: function(){
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.setData({
          oppid:res.result.openid
        })
        this.oppid=res.result.openid
        console.log(this.oppid)
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
      this.data.time = JSON.parse(res.result).sysTime2
      console.log(this.data.time)  
    });
    const db = wx.cloud.database({});
    const usercount = db.collection('usercount');
    usercount.where({ _openid: this.data.oppid }).get({
      success: (res) => {
        this.setData({
          money: res.data[0].usercount_count,
          userid:res.data[0]._id
        })
        console.log(this.data.money)
      },
      fail: (err) => {
        console.error(err)
      }
    })
  }
})