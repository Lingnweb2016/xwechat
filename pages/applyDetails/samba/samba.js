Page({
  data:{
    sambaList:[]
  },
  delChange: function(e){
    wx.showToast({
      icon:'loading',
      duration:6000
    })
    var that = this;
    var name = e.currentTarget.dataset.name;
    wx.request({
      url:that.data.url + "/cgi-bin/luci/admin/application/delSambaShare",
      data:{
        wx:that.data.key,
        name:name
      },
      header: {"content-type":"application/json"},
      success: function(res){
        if(res.data.code == 0){
          wx.showToast({
            title:'保存成功',
            duration:2000
          });
          //重新加载数据
          wx.request({
            url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getSambaShare",
            data:{wx:that.data.key},
            header: {"content-type":"application/json"},
            success: function(res){
              that.setData({
                sambaList:res.data.config
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
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getSambaShare",
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
                  sambaList:res.data.config
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
      url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getSambaShare",
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
          sambaList:res.data.config
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
      url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getSambaShare",
      data:{wx:that.data.key},
      header: {"content-type":"application/json"},
      success: function(res){
        that.setData({
          sambaList:res.data.config
        })
      }
    });
  }
})