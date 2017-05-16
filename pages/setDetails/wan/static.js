var app = getApp();
Page({
  data:{
    proto:'static',
    choseLink:"",
    ipaddr:'',
    netmask:'',
    gateway:'',
    staticDns1:'',
    staticDns2:''
  },
  recommendDns: function(){
    var that = this;
    wx.showToast({
      icon:'loading',
      title:'数据获取中...'
    })
    wx.request({
      url: that.data.url + '/cgi-bin/luci/admin/network/publicDns',
      data: {wx:that.data.key},
      header: {"content-type":"application/json"},
      success: function(res){
        if(res.length == 0){
          wx.showToast({
            title: '获取失败，当前网络不可用',
            duration:2000
          })
        }else{
          wx.hideToast();
          console.log(res);
          that.setData({
            staticDns1:res.data[0].ipaddr,
            staticDns2:res.data[1].ipaddr
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title:'获取失败，当前网络不可用',
          duration:2000
        })
      }
    })
  },
  saveStaticChange: function(){
    var that = this;
    if(that.data.ipaddr == ''){
      wx.showToast({
        title:'IP地址不能为空',
        duration:2000
      })
      return false;
    }
    if(!app.Vipaddr(that.data.ipaddr)){
      wx.showToast({
        title:'IP地址格式错误',
        duration:2000
      })
      return false;
    }
    if(that.data.netmask == ''){
      wx.showToast({
        title:'子网掩码不能为空',
        duration:2000
      })
      return false;
    }
    if(!app.Vnetmask(that.data.netmask)){
      wx.showToast({
        title:'子网掩码格式错误',
        duration:2000
      })
      return false;
    }
    if(that.data.gateway == ''){
      wx.showToast({
        title:'默认网关不能为空',
        duration:2000
      })
      return false
    }
    if(!app.Vipaddr(that.data.gateway)){
      wx.showToast({
        title:'网关地址不正确',
        duration:2000
      })
      return false
    }
    if(that.data.staticDns1 == ''){
      wx.showToast({
        title:'首选DNS不能为空',
        duration:2000
      })
      return false;
    };
    if(!app.Vipaddr(that.data.staticDns1)){
      wx.showToast({
        title:'首选DNS格式不正确',
        duration:2000
      })
      return false;
    };
    if(that.data.staticDns2 != ''){
      if(!app.Vipaddr(that.data.staticDns2)){
        wx.showToast({
          title:'备用DNS格式不正确',
          duration:2000
        })
        return false;
      }
    }
    if(that.data.ipaddr == that.data.gateway){
      wx.showToast({
        title:'IP地址与内网IP处于同一网段',
        duration:2000
      })
      return false;
    }
    wx.showToast({
      icon:'loading',
      title:'保存中...'
    })
    wx.request({
      url:that.data.url + "/cgi-bin/luci/admin/network/set_wan_info",
      data:{
        wx:that.data.key,
        wanset:{
          proto:that.data.proto,
          ipaddr:that.data.ipaddr,
          netmask:that.data.netmask,
          gateway:that.data.gateway,
          primayDns:that.data.staticDns1,
          secondDns:that.data.staticDns2
        }
      },
      header: {"content-type":"application/json"},
      success: function(res){
        if(res.data.result){
          wx.showToast({
            title:'保存成功',
            duration:2000
          });
          setTimeout(function(){
            wx.switchTab({
              url: '../../set/set'
            })
          },2000)
        }else{
          wx.showToast({
            title:'保存失败',
            duration:2000
          })
        }
      }
    });
  },
  onLoad:function(options){
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
            wx.request({
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

                if(res.data.proto == 'static'){
                  that.setData({
                    choseLink: res.data.proto,
                    ipaddr:res.data.ipaddr,
                    netmask:res.data.netmask,
                    gateway:res.data.gateway,
                  });
                  if(res.data.dns.length == 2){
                    that.setData({
                      staticDns1:res.data.dns[0],
                      staticDns2:res.data.dns[1]
                    })
                  }else{
                    that.setData({
                      staticDns1:res.data.dns
                    })
                  }
                }
                
              }
            });

          }
        })
      }
    });
  },
  ipaddrInp: function(e){
    this.setData({
      ipaddr:e.detail.value
    })
  },
  netmaskInp: function(e){
    this.setData({
      netmask:e.detail.value
    })
  },
  gatewayInp: function(e){
    this.setData({
      gateway:e.detail.value
    })
  },
  staticDns1Inp: function(e){
    this.setData({
      staticDns1:e.detail.value
    })
  },
  staticDns2Inp: function(e){
    this.setData({
      staticDns2:e.detail.value
    })
  }
})