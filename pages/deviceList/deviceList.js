// pages/deciveList/deciveList.js
var app = getApp();
var localUrl = getApp().globalData.localUrl;
var remoteUrl = getApp().globalData.remoteUrl
Page({
  data:{
    isNoDevice:'none',
    isAddDevice:'none',
    isHasDevice:'none',
    mac:'',
    isActive:'none',
    activeSsid:'',
    openid:'',

    macListArr: []
  },
  formShowInp: function(){
    var that = this;
    that.setData({
      // isNoDevice:'none',
      isAddDevice:'block'
    })
  },
  macInp: function(e){
    this.setData({
      mac:e.detail.value
    })
  },
  closeAddLayer: function(){
    var that = this;
    that.setData({
      isAddDevice:'none'
    })
  },
  clickDeviceList: function(e){
    var that = this;
    var isOnline = e.currentTarget.dataset.online;
    var mac = e.currentTarget.dataset.mac;
    if(isOnline == false){//设备不在线
      wx.showToast({
        title:'该设备不在线',
        duration:2000
      })
    }else{//远程管理

      wx.request({
        url: 'https://xwechat.xxxxxxxx.org:65443/api/v1/users/' + that.data.openid + '/opt/' + mac + '/reproxy/https',
        data:{},
        method:'POST',
        header:{'content-type':'application/json'},
        success: function(res){
          //console.log(res);
          that.setData({
            remoteport: res.data.remoteport
          });

          //用户输入缓存
          wx.setStorage({
            key: "URL",
            // data:remoteUrl
            data: 'https://xxxxxxxxxxxxxxxxxx:' + that.data.remoteport
          });
          wx.setStorage({
            key: 'mac',
            data: mac
          });

          //用户跳转到登录页
          wx.navigateTo({
            url: '../login/login?mac=' + mac
          })

        }
      })


    }
  },
  //删除设备
  clickDelMac: function(e){
    var that = this;
    var mac = e.currentTarget.dataset.mac;

    wx.showModal({
      title: '是否确定删除？',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({
            icon:'loading',
            title:'正在删除，请稍后...'
          });
          
          
          wx.request({
            url: 'https://xwechat.xxxxxxx.org:65443/api/v1/users/'+ that.data.openid +'/devices/'+ mac,
            //data: {},
            method: 'PUT', 
            header: {'content-type': 'application/json'},
            success: function(res){
              // success
              //console.log(res);
              if(res.data.state == '020'){
                wx.showToast({
                  title:'删除成功',
                  duration:2000
                });

                var index = 0;
                for (var j in that.data.macListArr) {
                  if (mac == that.data.macListArr[j].mac) {
                    index = j;
                    break;
                  }
                }
                var newArr = that.data.macListArr;
                newArr.splice(index,1);
                that.setData({
                  macListArr:newArr
                })


              }else{
                wx.showToast({
                  title:'删除失败',
                  duration:2000
                })
              }
            },
            fail: function(res) {
              // fail
            }
          })

        }
      }
    })

  },
  turnLogin: function(){
    var that = this;
    wx.setStorage({
        key:"URL",
        data:'https://xxxxxxxxxxxxxxxxxxxx'
      });
      wx.setStorage({
        key: 'mac',
        data: ''
      });

      //用户跳转到登录页
      wx.navigateTo({
        url: '../login/login?ssid=' + that.data.activeSsid
      })
  },
  //添加设备
  saveAddDevice: function(){
    var that = this;
    var mac;
    if(that.data.mac == ''){
      wx.showToast({
        title:'MAC不能为空',
        duration:2000
      })
      return false
    }
    if(that.data.mac.indexOf(':') >= 0){//用户输入冒号
      if(!app.Vmacaddr(that.data.mac)){
        wx.showToast({
          title:'MAC格式错误',
          duration:2000
        });
        that.setData({
          mac: ''
        })
        return false
      }
    }else{
      if(!app.Vmacaddr2(that.data.mac)){
        wx.showToast({
          title:'MAC格式错误',
          duration:2000
        });
        that.setData({
          mac: ''
        })
        return false
      }
    }
    if(that.data.mac.indexOf(':') >= 0){
      mac = (that.data.mac.split(':').join('')).toUpperCase();
    }else{
      mac = (that.data.mac).toUpperCase();
    }
    wx.request({
      url: 'https://xwechat.xxxxxxx.org:65443/api/v1/users/'+ that.data.openid +'/devices/'+ mac,
      //data: {syspwd:'wlife'},
      method: 'POST', 
      header: {'content-type': 'application/json'},
      success: function(res){
        if(res.data.state == '020'){
          wx.showToast({
            title:'添加成功',
            duration:2000
          });
          that.setData({
            isAddDevice:'none',
            isNoDevice:'none',
            mac:'',
            isHasDevice:'block'
          })

          var newArr = that.data.macListArr;
          newArr.push({mac:mac,online:'loading'});
          that.setData({
            macListArr: newArr
          });
          wx.request({
            url: 'https://xwechat.xxxxxxxxxxx.org:65443/api/v1/users/' + that.data.openid + '/opt/' + mac + '/ping',
            method: 'GET',
            header: { 'content-type': 'application/json' },
            success: function (res) {
              //console.log(res);
              for (var j in that.data.macListArr) {
                if (res.data.mac == that.data.macListArr[j].mac) {
                  var param = {};
                  var string = 'macListArr[' + j + '].online';
                  param[string] = res.data.online;
                  that.setData(param);
                  return false;
                }
              }
            },
            fail: function (res) {
              for (var j in that.data.macListArr) {
                if (mac == that.data.macList[j].mac) {
                  var param = {};
                  var string = 'macListArr[' + j + '].online';
                  param[string] = '未知';
                  that.setData(param);
                  return false;
                }
              }
            }
          })

        }else if(res.data.state == '021'){
          wx.showToast({
            title:'该MAC已添加',
            duration:2000
          });
        }
        


      },
      fail: function(res) {
        // fail
      }
    })


  },
  onShow: function(){
    wx.setStorage({
      key: 'mac',
      data: ''
    });
  },
  onLoad:function(options){

    var that = this;
    wx.setStorage({
      key: 'mac',
      data: ''
    });
    wx.login({
      success: function(res){
        //console.log(res);
        if (res.code) {
          var appid = 'wxxxxxxxxxxxxxxxxxxx';
          var secret = 'ffxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
          var code = res.code;
          //发起网络请求
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid='+ appid +'&secret='+ secret +'&js_code='+ code +'&grant_type=authorization_code',
            //data: {code: res.code},
            header: {'content-type': 'application/json'},
            success: function(res){
              //console.log(res);
              that.setData({
                openid:res.data.openid
              })
              var openid = res.data.openid;

              wx.request({
                url: 'https://xwechat.xxxxxxxx.org:65443/api/v1/users/'+ openid +'/devices',
                method: 'GET', 
                header: {"content-type":"application/json"}, 
                success: function(res){
                  //console.log(res);
                  if(res.data.devices.length == 0){
                    that.setData({
                      isNoDevice:'block'
                    })
                  }else{
                    var macListArr = [];
                    for (var i in res.data.devices) {
                      macListArr.push({mac:res.data.devices[i].mac,online:'loading'});
                    }
                    that.setData({
                      isHasDevice:'block',
                      macList:res.data.devices,
                      macListArr:macListArr
                    });

                    for(var i =0;i<that.data.macListArr.length;i++){
                      var activeMac = that.data.macListArr[i].mac;
                      wx.request({
                        url: 'https://xwechat.xxxxxxxx.org:65443/api/v1/users/' + that.data.openid + '/opt/' + that.data.macListArr[i].mac + '/ping',
                        method:'GET',
                        header:{'content-type':'application/json'},
                        success: function(res){
                          //console.log(res);
                          for(var j in that.data.macListArr){
                            if(res.data.mac == that.data.macListArr[j].mac){
                              var param = {};
                              var string = 'macListArr['+j+'].online';
                              param[string] = res.data.online;
                              that.setData(param);
                              return false;
                            }
                          }
                        },
                        fail: function(res){
                          for (var j in that.data.macListArr) {
                            if (activeMac == that.data.macListArr[j].mac) {
                              var param = {};
                              var string = 'macListArr[' + j + '].online';
                              param[string] = '未知';
                              that.setData(param);
                              return false;
                            }
                          }
                        }
                      })
                    }

                  }
                },
                fail: function(res) {
                  // fail
                  console.log(res);
                  wx.showToast({
                    title:'获取失败',
                    duration:4000
                  })
                }
              });

              wx.request({
                url:'https://xxxxxxxxxxxxxxxx.org/cgi-bin/luci/guest/info',
                header:{'content-type': 'application/json'},
                success: function(res){
                  //console.log(res);
                  if(res.statusCode == 200){//判断是否连接路由
                    that.setData({
                      isActive:'block',
                      activeSsid:res.data.SSID2G
                    })
                  }
                }
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
    

  },
  //下拉刷新
  onPullDownRefresh() {

    wx.showNavigationBarLoading();//在标题栏中宣誓加载

    var that = this;
    wx.setStorage({
      key: 'mac',
      data: ''
    });
    

    wx.request({
      url: 'https://xwechat.xxxxxxxxxxx.org:65443/api/v1/users/' + that.data.openid + '/devices',
      method: 'GET',
      header: { "content-type": "application/json" },
      success: function (res) {
        //console.log(res);
        if (res.data.devices.length == 0) {
          that.setData({
            isNoDevice: 'block'
          })
        } else {
          var macListArr = [];
          for (var i in res.data.devices) {
            macListArr.push({ mac: res.data.devices[i].mac, online: 'loading' });
          }
          that.setData({
            isHasDevice: 'block',
            macList: res.data.devices,
            macListArr: macListArr
          });

          for (var i = 0; i < that.data.macListArr.length; i++) {
            var activeMac = that.data.macListArr[i].mac;
            wx.request({
              url: 'https://xwechat.xxxxxxxxxxxxxxx.org:65443/api/v1/users/' + that.data.openid + '/opt/' + that.data.macListArr[i].mac + '/ping',
              method: 'GET',
              header: { 'content-type': 'application/json' },
              success: function (res) {
                //console.log(res);
                for (var j in that.data.macListArr) {
                  if (res.data.mac == that.data.macListArr[j].mac) {
                    var param = {};
                    var string = 'macListArr[' + j + '].online';
                    param[string] = res.data.online;
                    that.setData(param);
                    return false;
                  }
                }
              },
              fail: function (res) {
                for (var j in that.data.macListArr) {
                  if (activeMac == that.data.macListArr[j].mac) {
                    var param = {};
                    var string = 'macListArr[' + j + '].online';
                    param[string] = '未知';
                    that.setData(param);
                    return false;
                  }
                }
              }
            })
          }

        }
      },
      fail: function (res) {
        // fail
        console.log(res);
        wx.showToast({
          title: '获取失败',
          duration: 4000
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading();//加载完成
        wx.stopPullDownRefresh();//停止下拉刷新
      }
    });

    wx.request({
      url: 'https://xxxxxxxxxxxxxxx/cgi-bin/luci/guest/info',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        //console.log(res);
        if (res.statusCode == 200) {//判断是否连接路由
          that.setData({
            isActive: 'block',
            activeSsid: res.data.SSID2G
          })
        }
      }
    })

  },
  onReady:function(){
    // 页面渲染完成
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})