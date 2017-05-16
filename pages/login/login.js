// pages/login/login.js
var app = getApp()
Page({
  data:{
    "key": 'wlife',
    "inputKey": '',
    "toast": false,

    "bodyStyle": "block",
    "tipStyle":"none",

    logigMsg:''

  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '轻松配置路由器',
      path: '/pages/login/login',
      success: function(res){
        console.log(res)
      },
      fail: function(res){
        console.log(res)
      }
    }
  },

  formSubmit: function(e){
    //console.log(e.detail.value)
  },
  bindKeyInput: function(e){
    this.setData({
      "inputKey": e.detail.value
    })
  },
  bindSubmit: function(e){
    var that = this;
    var key = this.data.inputKey;//保存用户输入



    //审核需要--若输入wlife-test则直接进入首页
    if(key == 'wlife-test'){
      wx.switchTab({
        url: '../index/index'
      })
      return false;
    }

    wx.request({
      url:that.data.url +'/cgi-bin/luci/wechat/miniProgram/sysauth',
      data:{password : that.data.inputKey},
      header: {"content-type":"application/json"},
      success: function(res){
        //console.log(res.data.user);
        if(res.data.user){
          //用户输入缓存
          wx.setStorage({
            key:"password",
            data:key
          })
          //用户跳转到首页
          wx.switchTab({
            url: '../index/index'
          })
        }else{
          wx.showToast({
            title: "密码错误",
            duration: 2000
          })
        } 
      },
      fail: function(){
        wx.showToast({
            title: "请连接正确的路由器",
            duration: 2000
        })
      }
    });

  },
  onLoad:function(options){
    var that = this;
    wx.getStorage({
      key: 'URL',
      success: function (res) {
        that.setData({
          url: res.data
        });
      }
    });

    //console.log(options);
    if(options.ssid){//本地管理
      that.setData({
        logigMsg:'无线名称: '+options.ssid
      })
    }else if(options.mac){//远程管理
      that.setData({
        logigMsg: '设备MAC: '+options.mac
      })
    }

    wx.getNetworkType({
      success: function(res) {
        if(res.networkType != "wifi"){
          that.setData({
            "bodyStyle":"none",
            "tipStyle":"block"
          })
        };
      }
    })

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})