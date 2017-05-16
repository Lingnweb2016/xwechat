var app = getApp();
var base64 = require('../../utils/base64.js');
Page({
  data: {
    "key":"",
    "wanProto":"",
    sessionNum:0
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '轻松配置路由器',
      path: '/pages/index/index'
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //下拉刷新
  onPullDownRefresh(){

    wx.showNavigationBarLoading();//在标题栏中宣誓加载

    var that = this;
    //打印用户输入数据
    wx.getStorage({
      key: 'password',
      success: function(res){
        that.setData({
          key:res.data
        });

        //获取路由信息
        wx.request({
          url:that.data.url + '/cgi-bin/luci/admin/system/getDeviceInfo',
          // url:"https://wifi.feiger.net/cgi-bin/luci/admin/system/getDeviceInfo",
          data:{wx:that.data.key},
          header: {"content-type":"application/json"},
          success: function(res){
            
            if(typeof(res.data) == 'string' && res.data.indexOf('Incorrect password') != -1){
              wx.redirectTo({
                url: '../login/login'
              });
              return false;
            }

            var data = res.data;
            that.setData({
              "boardName":data.boardName,
              "romVersion":data.romVersion,
              "routerMac":data.routerMac,
              "runTime":app.timeStamp(data.runTime),
              "wanProto": data.wanInfo.proto,
              "lanAddr":data.lanAddr,
              "channel2":data.wifi0.channel,
              "ssid2":data.wifi0.ssid,
              "ssid5":data.wifi1.ssid,
              "sessionNum": data.sessionNum,
              "netmask":data.wanInfo.netmask,
              "ipaddr": data.wanInfo.ipaddr,
              "isUp": data.wanInfo.is_up,
            });
            if(data.wifi1.length == 0){
              that.setData({
                'wifi1': false
              })
            }else{
              that.setData({
                "channel5":data.wifi1.channel,
                "wifi1":true
              })
            }
          },
          complete: function(){
            wx.hideNavigationBarLoading();//加载完成
            wx.stopPullDownRefresh();//停止下拉刷新
          }
        });

      },
      fail: function(res){
        wx.showToast({
          title:'获取wlife失败',
          duration:2000
        })
      }
    });
  },
  
  onLoad: function () {
    //console.log(base64.encode('不要问我从哪里来'));
    //console.log(app.globalData.testUrl);
    var that = this;
    //打印用户输入数据
    wx.getStorage({
      key: 'password',
      success: function(res){
        //console.log(res.data)
        that.setData({
          key:res.data
        });
        wx.getStorage({
          key: 'URL',
          success: function(res) {
            that.setData({
              url:res.data
            });


            //获取路由信息
            wx.request({
              url: that.data.url + '/cgi-bin/luci/admin/system/getDeviceInfo',
              data: { wx: that.data.key },
              header: { "content-type": "application/json" },
              success: function (res) {
                //console.log(res.data);

                if (typeof (res.data) == 'string' && res.data.indexOf('Incorrect password') != -1) {//如果返回该字符串，则当前保存的密码和连接设备不相符，需重新输入密码
                  wx.redirectTo({
                    url: '../login/login'
                  });
                  return false;
                }

                var data = res.data;
                that.setData({
                  "boardName": data.boardName,
                  "romVersion": data.romVersion,
                  "routerMac": data.routerMac,
                  "runTime": app.timeStamp(data.runTime),
                  "wanProto": data.wanInfo.proto,
                  "lanAddr": data.lanAddr,
                  "channel2": data.wifi0.channel,
                  "ssid2": data.wifi0.ssid,
                  "ssid5": data.wifi1.ssid,
                  "sessionNum": data.sessionNum,
                  "netmask": data.wanInfo.netmask,
                  "ipaddr": data.wanInfo.ipaddr,
                  "isUp": data.wanInfo.is_up,
                })
                if (data.wifi1.length == 0) {
                  that.setData({
                    'wifi1': false
                  })
                } else {
                  that.setData({
                    "channel5": data.wifi1.channel,
                    "wifi1": true
                  })
                }
              },
              fail: function () {
                wx.showToast({
                  title: '数据获取失败',
                  duration: 2000
                })
              }
            });



          },
        })
        

      },
      fail: function(res){
        wx.showToast({
          title:'请登录路由',
          duration:2000
        });
        setTimeout(function(){
          wx.redirectTo({
            url: '../login/login'
          })
        },2000)
      }
      
    });
    
  },


})
