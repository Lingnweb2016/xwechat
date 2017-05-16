var app = getApp();
Page({
  data:{
    isOn:false,
    refreshText:'Updated 2017-02-22 14:34:22',

    server:'45.78.41.149',
    port:'443',
    encrypt:'rc4',
    encryptList:['rc4','rc4-md5','salsa20','chacha20','bf-cfb','des-cfb','idea-cfb','rc2-cfb','seed-cfb','cast5-cfb','aes-128-cfb','aes-192-cfb','aes-256-cfb','aes-128-ctr','aes-192-ctr','aes-256-ctr','chacha20-ietf','camellia-128-cfb','camellia-192-cfb','camellia-256-cfb'],
    encryptindex:1,
    password:'OGZhNzBlZG',
    ProxyType:'S',
    ProxyTypeList:['自动代理','全局代理'],
    ProxyTypeindex:0,

    isGFWList:'checked',
    Gfwlist:1,

    isCustom:false,
    Custom:0,

    CustomList:''
  },
  switchTurn: function(e){
    var that = this;
    
    if(e.detail.value){
      that.setData({
        isOn:'checked'
      })
    }else{
      wx.showToast({
        icon:'loading',
        title:'保存中...'
      })
      wx.request({
        url:that.data.url + "/cgi-bin/luci/admin/application/shadowsocks/turnOffService",
        data:{wx:that.data.key},
        header: {"content-type":"application/json"},
        success: function(res){
          if(res.data.code == 0){
            wx.showToast({
              title:'保存成功',
              duration:2000
            });
            that.setData({
              isOn:false
            });
          }else{
            wx.showToast({
              title:'保存失败',
              duration:2000
            })
          }
        }
      });

    }
  },
  switchCustom: function(e){
    if(e.detail.value){
      this.setData({
        isCustom:'checked',
        Custom:1
      })
    }else{
      this.setData({
        isCustom:false,
        Custom:0
      })
    }
  },
  serverInp: function(e){
    this.setData({
      server:e.detail.value
    })
  },
  portInp: function(e){
    this.setData({
      port:e.detail.value
    })
  },
  bindencryptChange: function(e){
    var that = this;
    that.setData({
      encryptindex:e.detail.value,
      encrypt:that.data.encryptList[e.detail.value]
    })
  },
  passwordInp: function(e){
    this.setData({
      password:e.detail.value
    })
  },
  bindProxyTypeChange: function(e){
    var that = this;
    that.setData({
      ProxyTypeindex: e.detail.value
    });
    if(e.detail.value == 0){
      that.setData({
        ProxyType:"S"
      })
    }else{
      that.setData({
        ProxyType:"F"
      })
    }
  },
  switchGFWList: function(e){
    var that = this;
    if(e.detail.value){
      that.setData({
        Gfwlist:1
      })
    }else{
      that.setData({
        Gfwlist:0
      })
    }
  },
  customlistInp: function(e){
    var that = this;
    that.setData({
      CustomList:e.detail.value
    })
  },

  bindRefreshTime: function(){
    var that = this;
    var timer = null;
    wx.showToast({
      icon:'loading',
      title:'更新中...',
      duration:7000
    })
    
    wx.request({
      url:that.data.url + "/cgi-bin/luci/admin/application/shadowsocks/updateGFWList",
      data:{
        wx:that.data.key,
        action:0
      },
      header: {"content-type":"application/json"},
      success: function(res){
        if(res.data.code == 1){
          wx.showToast({
            title:'保存成功',
            duration:2000
          });
        }else{
          timer = setTimeout(function(){
            wx.request({
              url:that.data.url + "/cgi-bin/luci/admin/application/shadowsocks/updateGFWList",
              data:{wx:that.data.key,action:1},
              header: {"content-type":"application/json"},
              success: function(res){
                if(res.data.code == 1){
                  that.setData({
                    refreshText:res.data.ver
                  })
                }else{
                  wx.showToast({
                    title:'更新失败',
                    duration:2000
                  })
                }
              }
            });

          },5000)
        }
      }
    });

  },
  saveShadowsocksChange: function(){
    var that = this;
    if(that.data.server == ''){
      wx.showToast({
        title:'服务器不能为空',
        duration:2000
      })
      return false;
    }
    if(!app.Vport(that.data.port)){
      wx.showToast({
        title:'服务器端口错误',
        duration:2000
      })
      return false;
    }

    var reqdata = {};
    reqdata.Server = that.data.server;
    reqdata.Port = that.data.port;
    reqdata.Encrypt = that.data.encrypt;
    reqdata.PassWord = that.data.password;
    reqdata.ProxyType = that.data.ProxyType;
    reqdata.Gfwlist = that.data.Gfwlist;
    reqdata.Custom = that.data.Custom;
    reqdata.CustomList = that.data.CustomList;
    
    wx.showToast({
        icon:'loading',
        title:'保存中...',
        duration:7000
    })
    wx.request({
      url:that.data.url + "/cgi-bin/luci/admin/application/shadowsocks/setShadowsocks",
      data:{
        wx:that.data.key,
        reqdata:reqdata
      },
      header: {"content-type":"application/json"},
      success: function(res){
        if(res.data.code == 0){
          wx.showToast({
            title:'保存成功',
            duration:2000
          });

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
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getShadowSocksInfo",
              data:{wx:that.data.key},
              header: {"content-type":"application/json"},
              success: function(res){
                
                if(typeof(res.data) == 'string' && res.data.indexOf('Incorrect password') != -1){
                  wx.redirectTo({
                    url: '../../login/login'
                  });
                  return false;
                }
                
                var server = res.data.config.server;
                that.setData({
                  server:server.address,
                  port:server.port,
                  encrypt:server.encryption,
                  encryptindex:that.data.encryptList.indexOf(server.encryption),
                  password:server.password,
                  ProxyType:res.data.config.proxy.proxy_mode
                });
                if(res.data.config.proxy.disabled == '0'){//开启
                  that.setData({
                    isOn:true
                  })
                }
                if(res.data.config.proxy.disabled == '1'){//功能关闭
                  that.setData({
                    isOn:false
                  })
                }
                if(res.data.config.proxy.proxy_mode == 'S'){
                  that.setData({
                    ProxyTypeindex:0
                  })
                }else{
                  that.setData({
                    ProxyTypeindex:1
                  })
                };
                if(res.data.config.proxy.gfwlist == '1'){
                  that.setData({
                    isGFWList:'checked',
                    Gfwlist:1
                  })
                }else if(res.data.config.proxy.gfwlist == '0'){
                  that.setData({
                    isGFWList:false,
                    Gfwlist:0
                  })
                };
                if(res.data.config.proxy.custom == '1'){
                  that.setData({
                    isCustom:'checked',
                    Custom:1
                  })
                }else if(res.data.config.proxy.custom == '0'){
                  that.setData({
                    isCustom:false,
                    Custom:0
                  })
                };
              }
            });

          }
        })
      }
    });
  }
})