Page({
  data:{
    mtu:""
  },
  mtuInp: function(e){
    this.setData({
      mtu:e.detail.value
    })
  },
  saveMtuChange: function(){
    var that = this;
    var reg = /^[0-9]+$/;

    if(that.data.mtu == ''){
      wx.showToast({
        title: "输入不能为空",
        duration: 2000
      })
      return false;
    }else if(!reg.exec(String(that.data.mtu)) || that.data.mtu == 0){
      wx.showToast({
        title: "MTU值格式不正确",
        duration: 2000
      })
      return false;
    }else if(parseInt(that.data.mtu)<576 || parseInt(that.data.mtu)>1500){
      wx.showToast({
        title: "可设范围(576~1500)",
        duration: 2000
      })
      return false;
    }

    wx.showToast({
      icon:'loading',
      title:'保存中...'
    })
    wx.request({
      url:that.data.url + "/cgi-bin/luci/admin/network/set_wan_mtu",
      data:{wx:that.data.key,mtu_set:that.data.mtu},
      header: {"content-type":"application/json"},
      success: function(res){
        if(res.data.result){
          wx.showToast({
            title: "保存成功",
            duration: 2000
          });
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            })
          },2000)
        }else{
          wx.showToast({
            title: "保存失败",
            duration: 2000
          });
        }
        
      },
      fail: function(res){
        wx.showToast({
          title: "保存失败",
          duration: 2000
        });
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
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getMTUVaule",
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
                  mtu:res.data
                })
              }
            });

          }
        })
      }
    });
  }
})