// pages/connect/setDetail.js
var app = getApp();
Page({
  data:{
    isVip:false
  },
  onLoad:function(options){
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      macaddr:options.macaddr,
      ipaddr: options.ipaddr,
      upSpeed: parseInt(options.up_quota)/1024,
      downSpeed: parseInt(options.down_quota)/1024,
      isWhiteList: options.is_vip,
      hostname:options.hostname
    });
    if(that.data.isWhiteList == '1'){
      that.setData({
        isVip:'checked'
      })
    }else{
      that.setData({
        isVip:false
      })
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

  bindUpSpeed: function(e){
    this.setData({
      "upSpeed": e.detail.value
    })
  },
  bindDownSpeed: function(e){
    this.setData({
      "downSpeed": e.detail.value
    })
  },
  bindLinkControl: function(){
    var that = this;
    wx.showModal({
      title: '是否确定禁用该设备的网络连接？',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({
            icon:'loading',
            title:'正在操作...'
          });
          //打印用户输入数据
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
                  //获取路由信息
                  wx.request({
                    url:that.data.url + "/cgi-bin/luci/admin/connect/addToBlackList",
                    data:{
                      wx:that.data.key,
                      mac:that.data.macaddr,
                      ip:that.data.ipaddr
                    },
                    header: {"content-type":"application/json"},
                    success: function(res){
                      console.log(res.data);
                      if(res.data.status == 0){
                        wx.showToast({
                          title:'设置成功',
                          duration:2000
                        });
                        setTimeout(function(){
                          wx.navigateBack({
                            delta: 1
                          })
                        },2000)
                      }else{
                        wx.showToast({
                          title:'设置失败',
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


  },
  switch1Change: function(e){
    var that = this;
    wx.showToast({
      icon:'loading',
      duration:6000
    })
    //console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    if(e.detail.value){
      that.setData({
        'hd':'add'
      })
    }else{
      that.setData({
        'hd':'del'
      })
    }

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
            //设置白名单
            wx.request({
              url:that.data.url + "/cgi-bin/luci/admin/connect/setVipList",
              data:{
                wx:that.data.key,
                mac:that.data.macaddr,
                ip:that.data.ipaddr,
                handle:that.data.hd
              },
              header: {"content-type":"application/json"},
              success: function(res){
                //console.log(res.data);
                if(res.data.status == 0){
                  wx.showToast({
                    title: "设置成功",
                    duration: 2000
                  });
                }else{
                  wx.showToast({
                    title: "设置失败",
                    duration: 2000
                  });
                }
              }
            });

          }
        })
      }
    });
  },
  saveChange: function(){
    var that = this;
    if(!app.Vlimit(String(that.data.upSpeed)) || !app.Vlimit(String(that.data.downSpeed))){
        wx.showToast({
          title:'输入不正确(0~38400)',
          duration:2000
        })
        return false;
    }


    wx.showToast({
      icon:'loading',
      duration:6000
    });
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
            //获取路由信息
            wx.request({
              url:that.data.url + "/cgi-bin/luci/admin/connect/setQosIpRule",
              data:{
                wx:that.data.key,
                mac:that.data.macaddr,
                ip:that.data.ipaddr,
                upSpeed:parseInt(that.data.upSpeed)*1024,
                downSpeed:parseInt(that.data.downSpeed)*1024
              },
              header: {"content-type":"application/json"},
              success: function(res){
                //console.log(res.data);
                wx.showToast({
                  title: "保存成功",
                  duration: 2000
                });
                setTimeout(function(){
                  wx.switchTab({
                    url:"connect"
                  })
                },2000)
              }
            });
          }
        })
      }
    });
  }
})