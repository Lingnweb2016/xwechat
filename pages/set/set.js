Page({
  data:{},
  onLoad:function(options){
    
  },
  bindExit: function(){
    wx.showModal({
      title: '是否确定退出？',
      success: function(res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../login/login'
          })
        }
      }
    })
  },
  bindRestart: function(){
    var that = this;
    wx.showModal({
      title: '是否确定重启路由器？',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({
            icon:'loading',
            title:'正在重启，请稍后...'
          });
          wx.getStorage({
            key: 'password',
            success: function(res){
              that.setData({
                key:res.data
              });
              wx.request({
                url:"https://wifi.kunteng.org/cgi-bin/luci/admin/system/reboot",
                data:{wx:that.data.key},
                header: {"content-type":"application/json"},
                success: function(res){
                  console.log(res.data);
                  wx.redirectTo({
                    url:'../login/login'
                  })
                }
              });

            }
          });
          

        }
      }
    })

    
  }
})