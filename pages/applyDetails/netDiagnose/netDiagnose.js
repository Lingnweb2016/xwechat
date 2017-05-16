Page({
  data:{
    loading:"none",
    rescont:"none",
    btncont:"block",
    iconType:"success",
    btnText:"开始诊断",
    msg:""
  },
  bindDiagnose: function(){
    var that = this;
    that.setData({
      loading:"block",
      btncont:"none",
      rescont:"none"
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
              url:that.data.url + "/cgi-bin/luci/guest/netStatus",
              data:{wx:that.data.key},
              header: {"content-type":"application/json"},
              success: function(res){
                //console.log(res.data);
                if(typeof(res.data) == 'string' && res.data.indexOf('Incorrect password') != -1){
                  wx.redirectTo({
                    url: '../../login/login'
                  });
                  return false;
                }

                if(res.data.code == 0){
                  that.setData({
                    loading:"none",
                    rescont:"block",
                    btncont:"block",
                    btnText:"重新诊断",
                    msg:"恭喜！网络连接正常"
                  })
                }else{
                  that.setData({
                    loading:"none",
                    rescont:"block",
                    btncont:"block",
                    btnText:"重新诊断",
                    iconType:"warn",
                    msg:res.data.msg
                  })
                }
              }
            });

          }
        })
      }
    });
  }
})