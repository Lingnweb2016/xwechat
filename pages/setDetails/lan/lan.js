var app = getApp();
Page({
  data:{
    ipAddr:'',
    netmask:''
  },
  lanInp: function(e){
    this.setData({
      ipAddr:e.detail.value
    })
  },
  saveLanChange: function(){
    var that = this;
    if(that.data.ipAddr == ""){
      wx.showToast({
        title:'IP地址不能为空',
        duration:2000
      })
      return false;
    }
    if(!app.Vipaddr(that.data.ipAddr)){
      wx.showToast({
        title:'IP地址格式不正确',
        duration:2000
      })
      return false;
    }
    wx.request({
      url:that.data.url + "/cgi-bin/luci/admin/network/set_lan_info",
      data:{
        wx:that.data.key,
        data:that.data.ipAddr,
        mask:that.data.netmask
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
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getLanInfo",
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
                  ipAddr:res.data.ipAddr,
                  netmask:res.data.netmask
                })
              }
            });

          }
        })
      }
    });
  }
})