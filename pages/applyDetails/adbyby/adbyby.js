Page({
  data:{
    isOn:false,
    flag:0
  },
  onLoad:function(options){
    var that = this;
    wx.getStorage({
      key: 'password',
      success: function(res){

        if(typeof(res.data) == 'string' && res.data.indexOf('Incorrect password') != -1){
          wx.redirectTo({
            url: '../../login/login'
          });
          return false;
        }

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
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getAdbybyState",
              data:{wx:that.data.key},
              header: {"content-type":"application/json"},
              success: function(res){
                //console.log(res);
                if(res.data.disabled == '0'){//开启
                  that.setData({
                    isOn:true
                  })
                }
                if(res.data.disabled == '1'){//关闭
                  that.setData({
                    isOn: false
                  })
                }
                
              }
            });

          }
        })
      }
    });
  },
  switchTurn: function(e){
    var that = this;
    if(e.detail.value){
      that.setData({
        isOn:'checked'
      });
      wx.showToast({
        icon:'loading',
        title:'保存中...'
      })
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
                url:that.data.url + "/cgi-bin/luci/admin/application/adbyby/switchService",
                data:{
                  wx:that.data.key,
                  action:0
                },
                header: {"content-type":"application/json"},
                success: function(res){
                  if(res.data.code == 0){
                    wx.showToast({
                      title:'Adbyby服务已开启',
                      duration:2000
                    });
                  }else{
                    wx.showToast({
                      title:'开启失败',
                      duration:2000
                    })
                  }
                }
              });

            }
          })
        }
      });

    }else{
      that.setData({
        isOn:false
      });

      wx.showToast({
        icon:'loading',
        title:'保存中...'
      })
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
                url:that.data.url + "/cgi-bin/luci/admin/application/adbyby/switchService",
                data:{
                  wx:that.data.key,
                  action:1
                },
                header: {"content-type":"application/json"},
                success: function(res){
                  if(res.data.code == 0){
                    wx.showToast({
                      title:'Adbyby服务已关闭',
                      duration:2000
                    });
                  }else{
                    wx.showToast({
                      title:'关闭失败',
                      duration:2000
                    })
                  }
                }
              });

            }
          })
        }
      });

    }

  }
})