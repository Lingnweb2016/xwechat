var app = getApp();
Page({
  data:{
    'oldpwd':'',
    'newpwd':'',
    'renewpwd':''
  },
  oldInp: function(e){
    this.setData({
      'oldpwd':e.detail.value
    })
  },
  newInp: function(e){
    this.setData({
      'newpwd':e.detail.value
    })
  },
  reInp: function(e){
    this.setData({
      'renewpwd':e.detail.value
    })
  },
  savePwdChange: function(){
    var that = this;
    var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
		var reg2 = /^[0-9a-zA-Z]*$/g;
    if(that.data.oldpwd == '' || that.data.newpwd == '' || that.data.renewpwd == ''){
      wx.showToast({
        title: "输入不能为空",
        duration: 2000
      })
      return false;
    }else if(that.data.newpwd.indexOf(' ')>=0){
      wx.showToast({
        title:'新密码不能包含空格',
        duration:2000
      })
      return false;
    }else if(that.data.newpwd.length<3 || that.data.newpwd.length>32){
      wx.showToast({
        title:'新密码长度为3~32',
        duration:2000
      })
      return false;
    }else if(reg.test(that.data.newpwd)){
      wx.showToast({
        title:'新密码包含特殊字符',
        duration:2000
      })
			return false;
		}else if(!reg2.test(that.data.newpwd)) {
			wx.showToast({
        title:'新密码包含特殊字符',
        duration:2000
      })
			return false;
		}else if(that.data.newpwd != that.data.renewpwd){
      wx.showToast({
        title: "两次输入密码不一致",
        duration: 2000
      })
      return false;
    }
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
              url:that.data.url + "/cgi-bin/luci/admin/system/setSysPassword",
              data:{wx:that.data.key,newpwd:that.data.newpwd,oldpwd:that.data.oldpwd},
              header: {"content-type":"application/json"},
              success: function(res){
                //console.log(res.data);
                if(res.data.code == 0){
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
                    title: res.data.msg,
                    duration: 2000
                  });
                }
              },
              fail: function(res){
                wx.showToast({
                  title: "保存失败",
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