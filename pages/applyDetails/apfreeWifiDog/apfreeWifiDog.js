var app = getApp();
Page({
  data:{
    navTab: ["基本设置","域名/IP访问规则",'MAC访问控制'],
    currentNavtab: "0",

    poolmode:['关闭','开启'],
    poolindex:1,
    wiredpass:['关闭','开启'],
    wiredindex:1,

    isOn:false,

    authserver:'',
    authport:'',
    authpath:'',
    threadnumber:'',
    queuesize:'',

    whiteExtdomain:'',
    whiteDomain:'',
    whiteIp:'',
    whiteMac:'',
    blackMac:''
  },
  switchTab: function(e){
    this.setData({
        currentNavtab: e.currentTarget.dataset.idx
    });
  },
  //portal开关操作
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
        url:that.data.url + "/cgi-bin/luci/admin/application/apfreeWifiDog/turnOffWifiDog",
        data:{
          wx:that.data.key
        },
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
  authserverInp: function(e){
    this.setData({
      authserver:e.detail.value
    })
  },
  authportInp: function(e){
    this.setData({
      authport: e.detail.value
    })
  },
  authpathInp: function(e){
    this.setData({
      authpath: e.detail.value
    })
  },
  bindPoolChange: function(e){
    this.setData({
      poolindex:e.detail.value
    })
  },
  threadnumbertInp: function(e){
    this.setData({
      threadnumber:e.detail.value
    })
  },
  queuesizeInp: function(e){
    this.setData({
      queuesize:e.detail.value
    })
  },
  bindWiredChange: function(e){
    this.setData({
      wiredindex:e.detail.value
    })
  },
  bindWhiteExtdomainInp: function(e){
    this.setData({
      whiteExtdomain:e.detail.value
    })
  },
  bindWhiteDomainInp: function(e){
    this.setData({
      whiteDomain:e.detail.value
    })
  },
  bindWhiteIpInp: function(e){
    this.setData({
      whiteIp:e.detail.value
    })
  },
  bindWhiteMacInp: function(e){
    this.setData({
      whiteMac:e.detail.value
    })
  },
  bindBlackMacInp: function(e){
    this.setData({
      blackMac:e.detail.value
    })
  },
  saveApfreeChange: function(){
    var that = this;
    //验证
    if(that.data.authport == '' || !app.Vport(String(that.data.authport))){
      wx.showToast({
        title:'服务器端口输入错误',
        duration:2000
      })
      return false
    }
    if(that.data.authpath == ''){
      wx.showToast({
        title:'路径不能为空',
        duration:2000
      })
      return false
    }
    if(that.data.poolindex == '1'){
      if(that.data.threadnumber == '' || !app.Vinteger(String(that.data.threadnumber))){
        wx.showToast({
          title:'线程数输入错误',
          duration:2000
        })
        return false;
      }
      if(that.data.queuesize == '' || !app.Vinteger(String(that.data.queuesize))){
        wx.showToast({
          title:'队列大小输入错误',
          duration:2000
        })
        return false
      }
    }

    var strwhiteExtdomain = app.TransferString(that.data.whiteExtdomain);
    var strwhiteDomain = app.TransferString(that.data.whiteDomain);
    var strwhiteIp = app.TransferString(that.data.whiteIp);
    var strwhiteMac = app.TransferString(that.data.whiteMac);
    var strblackMac = app.TransferString(that.data.blackMac);

    var arrwhiteExtdomain = strwhiteExtdomain.split(',');
    var arrwhiteDomain = strwhiteDomain.split(',');
    var arrwhiteIp = strwhiteIp.split(',');
    var arrwhiteMac = strwhiteMac.split(',');
    var arrblackMac = strblackMac.split(',');

    if(arrwhiteExtdomain.length>20 || arrwhiteDomain.length>20 || arrwhiteIp.length>20 || arrwhiteMac.length>20 || arrblackMac.length>20){
      wx.showToast({
        title: '输入条数不能超过20条',
        duration:2000
      })
      return false;
    }

    var flag = true;
    if(that.data.whiteExtdomain){
      for(var i in arrwhiteExtdomain){
        if(!app.Vdomain(arrwhiteExtdomain[i])){
          wx.showToast({
            title:'泛域名白名单地址错误',
            duration:2000
          })
          flag = false;
          that.setData({
            currentNavtab:1
          })
          return false
        }
      }
      if(!flag){return false}
    }
    if(that.data.whiteDomain){
      for(var i in arrwhiteDomain){
        if(!app.Vdomain(arrwhiteDomain[i])){
          wx.showToast({
            title:'域名白名单地址错误',
            duration:2000
          })
          flag = false;
          that.setData({
            currentNavtab:1
          })
          return false
        }
      }
      if(!flag){return false}
    }
    if(that.data.whiteIp){
      for(var i in arrwhiteIp){
        if(!app.Vipaddr(arrwhiteIp[i])){
          wx.showToast({
            title:'IP白名单地址错误',
            duration:2000
          })
          flag = false;
          that.setData({
            currentNavtab:1
          })
          return false
        }
      }
      if(!flag){return false}
    }
    if(that.data.whiteMac){
      for(var i in arrwhiteMac){
        if(!app.Vmacaddr(arrwhiteMac[i])){
          wx.showToast({
            title:'MAC白名单格式错误',
            duration:2000
          })
          flag = false;
          that.setData({
            currentNavtab:2
          })
          return false
        }
      }
      if(!flag){return false}
    }
    if(that.data.blackMac){
      for(var i in arrblackMac){
        if(!app.Vmacaddr(arrblackMac[i])){
          wx.showToast({
            title:'MAC黑名单格式错误',
            duration:2000
          })
          flag = false;
          that.setData({
            currentNavtab:2
          })
          return false
        }
      }
      if(!flag){return false}
    }

    var reqdata = {};
    reqdata.HostName = that.data.authserver;
    reqdata.Port = that.data.authport;
    reqdata.Path = that.data.authpath;
    reqdata.PoolMod = that.data.poolindex;
    if(that.data.poolindex == '1'){
      reqdata.ThreadNum = that.data.threadnumber;
      reqdata.QueueSize = that.data.queuesize;
    }
    
    reqdata.WiredPass = that.data.wiredindex;

    reqdata.TrustedPanDomains = strwhiteExtdomain;
    reqdata.TrustedDomains = strwhiteDomain;
    reqdata.TrustedIPList = strwhiteIp;

    reqdata.TrustedMACList = strwhiteMac;
    reqdata.UNTrustedMACList = strblackMac;

    wx.showToast({
      icon:'loading',
      title:'保存中...'
    })
    wx.request({
      url:that.data.url + "/cgi-bin/luci/admin/application/apfreeWifiDog/setWifiDog",
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
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getWifiDogInfo",
              data:{wx:that.data.key},
              header: {"content-type":"application/json"},
              success: function(res){

                if(typeof(res.data) == 'string' && res.data.indexOf('Incorrect password') != -1){
                  wx.redirectTo({
                    url: '../../login/login'
                  });
                  return false;
                }

                var dataList = res.data.config[0];
                that.setData({
                  authserver:dataList.auth_server_hostname,
                  authport:dataList.auth_server_port,
                  authpath:dataList.auth_server_path,
                  threadnumber:dataList.thread_number,
                  queuesize:dataList.queue_size,

                  poolindex:dataList.pool_mode,
                  wiredindex:dataList.wired_passed
                })
              }
            });

          }
        })
      }
    });
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

        wx.getStorage({
          key: 'URL',
          success: function (res) {
            that.setData({
              url: res.data
            });
            //获取路由信息
            wx.request({
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getWifiDogInfo",
              data:{wx:that.data.key},
              header: {"content-type":"application/json"},
              success: function(res){

                if(typeof(res.data) == 'string' && res.data.indexOf('Incorrect password') != -1){
                  wx.redirectTo({
                    url: '../../login/login'
                  });
                  return false;
                }

                var dataList = res.data.config[0];
                that.setData({
                  authserver:dataList.auth_server_hostname,
                  authport:dataList.auth_server_port,
                  authpath:dataList.auth_server_path,
                  threadnumber:dataList.thread_number,
                  queuesize:dataList.queue_size,

                  poolindex:dataList.pool_mode,
                  wiredindex:dataList.wired_passed
                })
              },
              complete: function(){
                wx.hideNavigationBarLoading();//加载完成
                wx.stopPullDownRefresh();//停止下拉刷新
              }
            });

          }
        })

      },
      fail: function(res){
        wx.showToast({
          title:'获取wlife失败',
          duration:2000
        })
      }
    });
  },
})