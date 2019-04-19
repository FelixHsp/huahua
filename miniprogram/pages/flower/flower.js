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
    oppid:''
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
    clearInterval(this.data.loading);
    num = 60; //重置标志位
    return
  },

  //定时器执行函数
  move() {
    console.log(this.data.min+1)
    if (this.data.min==0 && this.data.sec=='02'){
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
      const integral = db.collection('integral');
      integral.where({ _openid: this.data.oppid}).get({
        success: (res) => {
          // console.log(JSON.stringify(res.data))
          // this.data.value = res.data[0].integral_value;
          if(JSON.stringify(res.data)=='[]'){
            integral.add({
              data: {
                integral_value: '0'
              }
            })
          }else{
            this.data.value = res.data[0].integral_value;
            db.collection('integral').doc(this.oppid).update({
              // data 传入需要局部更新的数据
              data: {
                // 表示将 done 字段置为 true
                integral_value: this.data.value * 1 + this.data.price * 1
              },
              success(res) {
                // console.log(res.data)
              }
            })
          }
          console.log(this.data.value)
          /*this.data.tag=2;
          console.log(this.data.tag)
          if (this.data.tag == 2) {
            db.collection('integral').doc(this.oppid).update({
              // data 传入需要局部更新的数据
              data: {
                // 表示将 done 字段置为 true
                integral_value:this.data.value*1 + this.data.price*1
              },
              success(res) {
                console.log(res.data)
              }
            })
          }else{
            integral.add({
              data: {
                integral_value: '0'
              }
            })
          } */
        },
        fail:(err)=>{
          console.error(err)
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
      picture: 'https://6c65-learninglife-c8aa8e-1258848626.tcb.qcloud.la/flowers/1.png?sign=d2bbfa574e2b912c16ab6e1db5840b84&t=1555302606',
      _num: e.target.dataset.num
    })

  },
  click2: function(e) {
    this.setData({
      picture: 'https://6c65-learninglife-c8aa8e-1258848626.tcb.qcloud.la/flowers/2.png?sign=a15fd79a2538762dfbd9372d98c8c960&t=1555302683',
      _num: e.target.dataset.num

    })
  },
  click3: function(e) {
    this.setData({
      picture: 'https://6c65-learninglife-c8aa8e-1258848626.tcb.qcloud.la/flowers/3.png?sign=1daae1dd2bba22e26698edd09b8b8502&t=1555302696',
      _num: e.target.dataset.num

    })
  },
  click4: function(e) {
    this.setData({
      picture: 'https://6c65-learninglife-c8aa8e-1258848626.tcb.qcloud.la/flowers/4.png?sign=b7f9f3db0787a5d9e32f88f125bb5651&t=1555302716',
      _num: e.target.dataset.num

    })
  },
  click5: function(e) {
    this.setData({
      picture: 'https://6c65-learninglife-c8aa8e-1258848626.tcb.qcloud.la/flowers/5.png?sign=1c6f7e44745a4df05b307eef0980fc81&t=1555302730',
      _num: e.target.dataset.num

    })
  },
  click6: function(e) {
    this.setData({
      picture: 'https://6c65-learninglife-c8aa8e-1258848626.tcb.qcloud.la/flowers/6.png?sign=20bd2ca9ce8307375249dda952187dca&t=1555302743',
      _num: e.target.dataset.num
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
        console.log(this.data.oppid)
        const db = wx.cloud.database({});
        const integral = db.collection('integral');
        integral.where({ _openid: this.data.oppid }).get({
          success: (res) => {
            // console.log(JSON.stringify(res.data))
            // this.data.value = res.data[0].integral_value;
            if (JSON.stringify(res.data) == '[]') {
              integral.add({
                data: {
                  integral_value: '0'
                }
              })
            }
          }
        })
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
    
  }
})