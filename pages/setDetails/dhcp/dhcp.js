var app = getApp();
Page({
  data:{
    "lanIpAddr": '',
    "time": ['小时', '分钟'],
    'index':0,

    'start':'',
    'end':'',
    'timenum':'',
    "timeSelect":"h",
    'primaryDns':'',
    'secondDns':'',

    'dnsSwitch':'none',
    isChecked:false
  },
  startInp: function(e){
    this.setData({
      'start':e.detail.value
    })
  },
  endInp: function(e){
    this.setData({
      'end':e.detail.value
    })
  },
  timenumInp: function(e){
    this.setData({
      'timenum':e.detail.value
    })
  },
  primaryDnsInp: function(e){
    this.setData({
      'primaryDns': e.detail.value
    })
  },
  secondDnsInp: function(e){
    this.setData({
      'secondDns': e.detail.value
    })
  },
  switchDnsChange: function(e){
    var that = this;
    if(e.detail.value){
      that.setData({
        dnsSwitch:'block',
        isChecked:'checked'
      })
    }else{
      that.setData({
        'primaryDns':'',
        'secondDns':'',
        dnsSwitch:'none',
        isChecked:false
      })
    }
  },
  bindTimePickerChange: function(e) {
    var that = this;
    that.setData({
      'index': e.detail.value
    })
    if(that.data.index == '0'){
      that.setData({
        timeSelect:'h'
      })
    }else{
      that.setData({
        timeSelect:'m'
      })
    }
  },
  saveDhcpChange: function(){
    var that = this;
    if(that.data.start == '' || that.data.end == ''){
      wx.showToast({
        title: "起始地址或结束地址不能为空",
        duration: 2000
      })
      return false;
    }
    var reg = /^[0-9]+$/;
    if(!reg.test(String(that.data.start)) || !reg.test(String(that.data.end)) || parseInt(that.data.start)<1 || parseInt(that.data.start)>254 || parseInt(that.data.end)<1 || parseInt(that.data.end)>254 || parseInt(that.data.start) >= parseInt(that.data.end)){
      wx.showToast({
        title:'起始地址或结束地址数据无效',
        duration:2000
      })
      return false;
    }
    if(that.data.timenum == ''){
      wx.showToast({
        title:'租约不能为空',
        duration:2000
      })
      return false;
    }else if(!reg.exec(that.data.timenum) || that.data.timenum == 0){
      wx.showToast({
        title:'租约无效',
        duration:2000
      })
      return false;
    }else if(that.data.timeSelect == 'h'){
      if(parseInt(that.data.timenum)>24){
        wx.showToast({
          title:'租约不能超过24小时',
          duration:2000
        })
        return false;
      }
    }else if(that.data.timeSelect == 'm'){
      if(parseInt(that.data.timenum) >1440){
        wx.showToast({
          title:'租约不能超过24小时',
          duration:2000
        })
        return false;
      }
      if(parseInt(that.data.timenum)<=1){
        wx.showToast({
          title:'DHCP最小租约为2分钟',
          duration:2000
        })
        return false;
      }
    }

    if(that.data.dnsSwitch == 'block'){
      if(that.data.primaryDns == ''){
        wx.showToast({
          title:'首选DNS不能为空',
          duration:2000
        })
        return false;
      }
      if(!app.Vipaddr(that.data.primaryDns)){
        wx.showToast({
          title:'首选DNS格式不正确',
          duration:2000
        })
        return false;
      };
      if(that.data.secondDns != '' && !app.Vipaddr(that.data.secondDns)){
        wx.showToast({
          title:'备用DNS格式不正确',
          duration:2000
        })
        return false;
      }
    }

    wx.showToast({
      icon:'loading',
      title:'保存中...'
    })
    wx.request({
      url:that.data.url + "/cgi-bin/luci/admin/system/dhcp_setup",
      data:{
        wx:that.data.key,
        reqdata:{
          start:that.data.start,
          limit:parseInt(that.data.end)-parseInt(that.data.start),
          leasetime:that.data.timenum+that.data.timeSelect,
          primaryDns:that.data.primaryDns,
          secondDns:that.data.secondDns
        }
      },
      header: {"content-type":"application/json"},
      success: function(res){
        if(res.data.result){
          wx.showToast({
            title: "保存成功",
            duration: 2000
          });
          setTimeout(function(){
            wx.switchTab({
              url: '../../set/set'
            })
          },2000)
        }else{
          wx.showToast({
            title: "保存失败",
            duration: 2000
          });
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
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getDhcpInfo",
              data:{wx:that.data.key},
              header: {"content-type":"application/json"},
              success: function(res){

                if(typeof(res.data) == 'string' && res.data.indexOf('Incorrect password') != -1){
                  wx.redirectTo({
                    url: '../../login/login'
                  });
                  return false;
                }
                
                that.setData({
                  start:res.data.start,
                  limit:res.data.limit,
                  end:parseInt(res.data.limit)+parseInt(res.data.start),
                  leaseTime:res.data.leaseTime,
                  timenum:parseInt(res.data.leaseTime),
                  ipaddr:res.data.ipaddr,

                  lanIpAddr:(res.data.ipaddr).substring(0,res.data.ipaddr.lastIndexOf('.'))+'.'
                });
                if(res.data.leaseTime.indexOf("h")>0){
                  that.setData({
                    "index":0
                  })
                }else if(res.data.leaseTime.indexOf("m")>0){
                  that.setData({
                    "index":1
                  })
                }
                //console.log(res.data.dns1);
                if(res.data.dns1){
                  that.setData({
                    isChecked:'checked',
                    dnsSwitch:'block',
                    primaryDns:res.data.dns1
                  })
                }
                if(res.data.dns2){
                  that.setData({
                    secondDns:res.data.dns2
                  })
                }
              }
            });

          }
        })
      }
    });
  }
})