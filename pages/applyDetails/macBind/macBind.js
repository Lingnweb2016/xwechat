Page({
  data:{
    "bindList": []
  },
  delChange: function(e){
    wx.showToast({
      icon:'loading',
      title:'删除中...',
      duration:7000
    })
    var that = this;
    var index = e.currentTarget.dataset.delindex;
    var bindedlist = that.data.bindList;
    var dellist = bindedlist.splice(index,1);//删除的数组，splice返回的是删除的项，并修改原数组
    var alllist = [];
    for(var i in bindedlist){
      alllist.push({ip:bindedlist[i].ipaddr,mac:bindedlist[i].macaddr,mask:bindedlist[i].mask})
    }

    wx.request({
      url:that.data.url + "/cgi-bin/luci/admin/application/macBind/setData",
      data:{
        wx:that.data.key,
        data:alllist
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
            url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getMacBind",
            data:{wx:that.data.key},
            header: {"content-type":"application/json"},
            success: function(res){
              that.setData({
                bindList:res.data.ethers
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
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getMacBind",
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

                that.setData({
                  bindList:res.data.ethers
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
      url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getMacBind",
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
          bindList:res.data.ethers
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
      url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getMacBind",
      data:{wx:that.data.key},
      header: {"content-type":"application/json"},
      success: function(res){
        that.setData({
          bindList:res.data.ethers
        })
      }
    });

  }
  
})