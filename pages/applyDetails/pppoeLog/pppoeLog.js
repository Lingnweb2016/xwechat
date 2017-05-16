var timer = null;
Page({
  data:{},
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
              timer = setInterval(function(){
                wx.request({
                  url:that.data.url + "/cgi-bin/luci/admin/network/get_pppoe_log",
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
                      pppoeLog:res.data.log
                    })
                  },
                  fail: function(){
                    wx.showToast({
                      title: "获取失败",
                      duration: 2000
                    });
                  }
                });
              },3000)

            }
          })
        }
      });

  },
  onUnload:function(){
    clearInterval(timer);
  }
})