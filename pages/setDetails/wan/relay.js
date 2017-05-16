Page({
  data:{

    aplist:[],
    index:0,
    ssids:[],
    pwdShow:'none',
    btnShow: 'none',
    contShow: 'none',
    checkedapclientData:{},
    ssidPwd:'',

    "eyeState":'eye_close',
    'inputType':true,

    ssid: '',
    isFocus:false

  },
  bindSsidChange:function(e){
    var that = this;
    that.setData({
      'index': e.detail.value,
      checkedapclientData:that.data.aplist[e.detail.value]
    });
    if(that.data.aplist[that.data.index].security != "NONE"){
      that.setData({
        pwdShow:'flex'
      })
    }else{
      that.setData({
        pwdShow:'none'
      })
    }
  },
  changePwdShow: function(){
    var that = this;
    if(that.data.eyeState == 'eye_close'){
      that.setData({
        eyeState:'eye',
        inputType:false,
        isFocus:true
      })
    }else{
      that.setData({
        eyeState:'eye_close',
        inputType:true,
        isFocus:true
      })
    }
  },
  bindPwdInpChange: function(e){
    this.setData({
      ssidPwd: e.detail.value
    })
  },
  saveChange: function(){
    var that = this;
    if(that.data.ssid == ''){
      wx.showToast({
        title:'请选择一个无线网络',
        duration:2000
      });
      return false;
    }
    if(that.data.pwdShow != "none" && that.data.ssidPwd ==""){
      wx.showToast({
        title: "请输入无线密码",
        duration: 2000
      });
      return false;
    }
    wx.showToast({
      icon:'loading',
      title:'正在配置...',
      duration:10000
    })
    
    wx.request({
      url:that.data.url + '/cgi-bin/luci/admin/wireless/set_apclient',
      data:{
        wx:that.data.key,
        ssid: that.data.ssid,
        bssid:that.data.bssid,
        authmode:that.data.authmode,
        channel:that.data.channel,
        key:that.data.ssidPwd
      },
      header: {"content-type":"application/json"},
      success: function(res){
        //console.log(res);
        wx.showToast({
          icon:'success',
          title:'配置成功',
          duration:2000
        });
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },2000)
      }
    })
  },
  bindRescan: function(){
    wx.showToast({
      icon:'loading',
      title:'正在扫描网络...',
      duration:10000
    })
    var that = this;
    that.setData({
      aplist:[],
      ssid:'',
      btnShow: 'none',
      contShow: 'none',
      pwdShow:'none'
    })
    wx.request({
      url:that.data.url + "/cgi-bin/luci/admin/wireless/scan_ap_list",
      data:{wx:that.data.key},
      header: {"content-type":"application/json"},
      success: function(res){
        wx.hideToast();
        that.setData({
          aplist:res.data.aplist,
          contShow:'block',
          btnShow:'block'
        });
        var arr = [];
        for(var i in res.data.aplist){
          arr.push(res.data.aplist[i].ssid);
        }
        that.setData({
          ssids:arr,
          checkedapclientData:res.data[0]
        })
      }
    });

  },


  ssidClick: function(e){
    var that = this;
    var ssid = e.currentTarget.dataset.ssid;
    var isLock = e.currentTarget.dataset.lock;
    var bssid = e.currentTarget.dataset.bssid;
    var channel = e.currentTarget.dataset.channel;
    that.setData({
      ssid: ssid,
      bssid: bssid,
      channel: channel,
      btnShow:'block',
      contShow:'none'
    })
    if(isLock != 'NONE'){
      that.setData({
        authmode:'WPA1PSKWPA2PSK/AES',
        pwdShow: 'flex'
      })
    }else{
      that.setData({
        authmode: 'NONE',
        pwdShow: 'none'
      })
    }
  },
  bindContShow: function(){
    var that = this;
    that.setData({
      contShow:'block'
    })
  },


  onLoad:function(options){

    wx.showToast({
      icon:'loading',
      title:'正在扫描网络...',
      duration:10000
    })

    var that = this;
    wx.getStorage({
      key: 'password',
      success: function(res){
        that.setData({
          key:res.data
        });
        wx.getStorage({
          key: 'URL',
          success: function (res) {
            that.setData({
              url: res.data
            });
            wx.request({//判断是否为中继模式
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getWanInfo",
              data:{wx:that.data.key,config:1},
              header: {"content-type":"application/json"},
              success: function(res){
                
                if(typeof(res.data) == 'string' && res.data.indexOf('Incorrect password') != -1){
                  wx.redirectTo({
                    url: '../../login/login'
                  });
                  return false;
                }

                if(res.data.apClientSet == '1'){
                  //console.log(res)
                  that.setData({
                    'choseLink': 'relay'
                  });
                  wx.request({//获取中继模式数据
                    url:that.data.url + '/cgi-bin/luci/admin/wireless/getApclientStatus',
                    data:{wx:that.data.key},
                    header: {"content-type":"application/json"},
                    success: function(res){
                      //console.log(res);
                      that.setData({
                        ssid:res.data.apcliSsid
                      });
                      if(res.data.apcliWpapsk){
                        that.setData({
                          pwdShow:'flex',
                          ssidPwd:res.data.apcliWpapsk
                        })
                      }
                    }
                  })


                }
              }
            })

            wx.request({
              url:that.data.url + "/cgi-bin/luci/admin/wireless/scan_ap_list",
              data:{wx:that.data.key},
              header: {"content-type":"application/json"},
              success: function(res){
                wx.hideToast();
                //console.log(res.data);
                that.setData({
                  aplist:res.data.aplist,
                  contShow:'block',
                  btnShow:'block'
                });
                var arr = [];
                for(var i in res.data.aplist){
                  arr.push(res.data.aplist[i].ssid);
                }
                that.setData({
                  ssids:arr,
                  checkedapclientData:res.data[0]
                })
              },
              fail: function(){
                wx.showToast({
                  title:'获取失败',
                  duration:2000
                })
              }
            });

          }
        })
      }
    });
  }
})