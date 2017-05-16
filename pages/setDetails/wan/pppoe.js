var app = getApp();
Page({
  data:{
    proto:"pppoe",
    eyeState:'eye_close',
    inputType:true,

    dnsSwitch:'none',
    primayDns:'',
    secondDns:'',
    username:'',
    password:'',
    isfocus:false
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
  changePwdShow: function(){
    var that = this;
    if(that.data.eyeState == 'eye_close'){
      that.setData({
        eyeState:'eye',
        inputType:false,
        isfocus:'focus'
      })
    }else{
      that.setData({
        eyeState:'eye_close',
        inputType:true,
        isfocus:'focus'
      })
    }
  },
  switchDnsChange: function(e){
    var that = this;
    if(e.detail.value){
      that.setData({
        dnsSwitch:'block',
        isSwitchChecked:'checked'
      })
    }else{
      that.setData({
        dnsSwitch:'none',
        isSwitchChecked:false,
        'primayDns':'',
        'secondDns':''
      })
    }
  },
  userInp: function(e){
    this.setData({
      username:e.detail.value
    })
  },
  pwdInp: function(e){
    this.setData({
      password:e.detail.value
    })
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

                if(res.data.proto == 'pppoe'){
                  that.setData({
                    username:res.data.username,
                    password:res.data.password
                  });
                  if(res.data.dns != ""){
                    that.setData({
                      isSwitchChecked:'checked',
                      dnsSwitch:'block',                  
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
                  }
                }
                
              }
            });

          }
        })
      }
    });
  },
  savePppoeChange: function(){
    var that = this;
    var mydata = {};
    mydata.proto = that.data.proto;
    mydata.username = that.data.username;
    mydata.password = that.data.password;
    if(that.data.username == ''){
      wx.showToast({
        title:'用户名不能为空',
        duration:2000
      })
      return false
    }
    if(that.data.password == ''){
      wx.showToast({
        title:'密码不能为空',
        duration:2000
      })
      return false
    }
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
        //   username:that.data.username,
        //   password:that.data.password,
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

  }
})