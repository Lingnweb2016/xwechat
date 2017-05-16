Page({
  data:{
    upload:0,
    download:0
  },
  bindRetest: function(){
    var that = this;
    that.setData({
      upload:0,
      download:0
    })
    wx.request({
      url:that.data.url + "/cgi-bin/luci/admin/connect/speedTest",
      data:{wx:that.data.key},
      header: {"content-type":"application/json"},
      success: function(res){
        //console.log(res.data);
        that.setData({
          upload:(res.data.upload/100).toFixed(2),
          download:(res.data.download/100).toFixed(2)
        })
      },
      fail: function(){
        wx.showToast({
          title: "测速失败",
          duration: 2000
        })
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
            //获取测速数据
            wx.request({
              url:that.data.url + '/cgi-bin/luci/admin/connect/speedTest',
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
                  upload:(res.data.upload/100).toFixed(2),
                  download:(res.data.download/100).toFixed(2)
                })
              },
              fail: function(){
                wx.showToast({
                  title: "测速失败",
                  duration: 2000
                })
              }
            });

          }
        })
      }
    });
  }
})