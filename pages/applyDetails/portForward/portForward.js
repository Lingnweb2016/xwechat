Page({
  data:{
    rules:[]
  },
  delChange: function(e){
    wx.showToast({
      icon:'loading',
      title:'保存中...',
      duration:7000
    })
    var that = this;
    var sport = e.currentTarget.dataset.sport;
    wx.request({
      url:that.data.url + "/cgi-bin/luci/admin/firewall/delPortForward",
      data:{
        wx:that.data.key,
        srcport:sport
      },
      header: {"content-type":"application/json"},
      success: function(res){
        if(res.data.code == 0){
          wx.showToast({
            title:'保存成功',
            duration:2000
          });
          wx.request({
            url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getForwardRules",
            data:{wx:that.data.key},
            header: {"content-type":"application/json"},
            success: function(res){
              that.setData({
                rules:res.data.rules
              })
            }
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
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getForwardRules",
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
                  rules:res.data.rules
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
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getForwardRules",
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
          rules:res.data.rules
        })
      },
      complete: function(){
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
  },
  onShow:function(){
    var that = this;
    wx.request({
      url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getForwardRules",
      data:{wx:that.data.key},
      header: {"content-type":"application/json"},
      success: function(res){
        that.setData({
          rules:res.data.rules
        })
      }
    });

  }
})