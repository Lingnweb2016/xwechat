var app = getApp();
Page({
  data:{
    proto:'dhcp',
    dnsSwitch:'none',
    primayDns:'',
    secondDns:'',
    isSwitchChecked:false
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
            primayDns:res.data[0].ipaddr,
            secondDns:res.data[1].ipaddr
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
  switchDnsChange: function(e){
    var that = this;
    if(e.detail.value){
      that.setData({
        dnsSwitch:'block'
      })
    }else{
      that.setData({
        primaryDns:'',
        secondDns:'',
        dnsSwitch:'none'
      })
    }
  },
  primayDnsInp: function(e){
    this.setData({
      primayDns:e.detail.value
    })
  },
  secondDnsInp: function(e){
    this.setData({
      secondDns:e.detail.value
    })
  },
  saveDhcpChange: function(){
    var that = this;
    var mydata = {};
    mydata.proto = that.data.proto;
    if(that.data.dnsSwitch == 'block'){
      if(that.data.primayDns == ''){
        wx.showToast({
          title:'首选DNS不能为空',
          duration:2000
        })
        return false;
      }
      if(!app.Vipaddr(that.data.primayDns)){
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
      mydata.primayDns = that.data.primayDns;
      mydata.secondDns = that.data.secondDns;
    }

    wx.showToast({
      icon:'loading',
      title:'保存中...'
    })
    wx.request({
      url:that.data.url + "/cgi-bin/luci/admin/network/set_wan_info",
      data:{
        wx:that.data.key,
        // wanset:{
        //   proto:that.data.proto,
        //   primayDns:that.data.primayDns,
        //   secondDns:that.data.secondDns
        // }
        wanset:mydata
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

                if(res.data.proto == 'dhcp'){
                  that.setData({
                    apClientSet:res.data.apClientSet
                  });
                  if(res.data.dns != undefined){
                    that.setData({
                      isSwitchChecked:'checked',
                      'dnsSwitch':'block',                  
                    })
                    if(res.data.dns.length == 2){
                      that.setData({
                        primayDns:res.data.dns[0],
                        secondDns:res.data.dns[1]
                      })
                    }else{
                      that.setData({
                        primayDns:res.data.dns
                      })
                    }
                  }else{
                    that.setData({
                      isSwitchChecked:false,
                      dnsSwitch:'none'                 
                    })
                  }
                }
                
              }
            });

          }
        })
      }
    });
  }
})