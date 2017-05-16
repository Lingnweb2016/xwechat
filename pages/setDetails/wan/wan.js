var app = getApp();
Page({
  data:{
    choseLink: "dhcp",

    isShowTime:false,
    msgColor:'#2573bf'
  },
  radioChange1: function(e){
    wx.navigateTo({
      url:'pppoe'
    })
  },
  radioChange2: function(e){
    wx.navigateTo({
      url:'dhcp'
    })
  },
  radioChange3: function(e){
    wx.navigateTo({
      url:'static'
    })
  },
  radioChange4: function(e){     
    wx.navigateTo({
      url:'relay'
    })
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
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getWanInfo",
              data:{wx:that.data.key,config:1},
              header: {"content-type":"application/json"},
              success: function(res){
                //console.log(res);
                if(res.data.proto == 'dhcp' && res.data.apClientSet == '1'){//中继
                  that.setData({
                    'choseLink': 'relay'
                  })
                }else{
                  that.setData({
                    "choseLink": res.data.proto
                  })
                }
              }
            });

            wx.request({
              url:that.data.url + '/cgi-bin/luci/admin/settings',
              data:{wx:that.data.key,status:1},
              header:{'content-type':'application/json'},
              success: function(res){
                //console.log(res);
                if(res.data.ipaddr){
                  that.setData({
                    ipv4addr:res.data.ipaddr + '/' + res.data.netmask
                  })
                }
                if(res.data.gateway){
                  that.setData({
                    gateway: res.data.gateway
                  })
                }
                if(res.data.dns){
                  if(res.data.dns[1]){
                    that.setData({
                        dnsaddr:res.data.dns[0] + '　' + res.data.dns[1]
                      });
                  }else{
                    that.setData({
                      dnsaddr:res.data.dns
                    })
                  }
                  if(res.data.uptime){
                    that.setData({
                      showTime:app.timeStamp(res.data.uptime),
                    })
                  }else{
                    that.setData({
                      isShowTime:true
                    })
                  }
                  if(res.data.is_up){
                    that.setData({
                      statusMsg: '已连接'
                    })
                  }else{
                    that.setData({
                      statusMsg: '未连接',
                      msgStyle:'redstyle'
                    })
                  }
                  if(res.data.proto == 'pppoe'){
                    wx.request({
                      url:that.data.url + '/cgi-bin/luci/admin/network/get_pppoe_status',
                      data:{wx:that.data.key},
                      header:{'content-type':'application/json'},
                      success: function(res){
                        //console.log(res);
                        if(res.data.code == 0){
                          that.setData({
                            statusMsg:'已连接'
                          })
                        }else if(res.data.code == 1){
                          if(res.data.msg){
                            that.setData({
                              statusMsg: res.data.msg,
                              msgColor:'red'
                            })
                          }else{
                            that.setData({
                              statusMsg:'连接中...'
                            })
                          }
                        }else{
                          that.setData({
                            statusMsg:'未连接',
                            msgColor:'red'
                          })
                        }
                      }
                    })
                  }
                }
              }
            })

          }
        })
      }
    });
  },
  onShow:function(){
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
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getWanInfo",
              data:{wx:that.data.key,config:1},
              header: {"content-type":"application/json"},
              success: function(res){
                if(res.data.proto == 'dhcp' && res.data.apClientSet == '1'){//中继
                  that.setData({
                    'choseLink': 'relay'
                  })
                }else{
                  that.setData({
                    "choseLink": res.data.proto
                  })
                }
              }
            });

            wx.request({
              url:that.data.url + '/cgi-bin/luci/admin/settings',
              data:{wx:that.data.key,status:1},
              header:{'content-type':'application/json'},
              success: function(res){
                //console.log(res);
                if(res.data.ipaddr){
                  that.setData({
                    ipv4addr:res.data.ipaddr + '/' + res.data.netmask
                  })
                }
                if(res.data.gateway){
                  that.setData({
                    gateway: res.data.gateway
                  })
                }
                if(res.data.dns){
                  if(res.data.dns[1]){
                    that.setData({
                        dnsaddr:res.data.dns[0] + '　' + res.data.dns[1]
                      });
                  }else{
                    that.setData({
                      dnsaddr:res.data.dns
                    })
                  }
                  if(res.data.uptime){
                    that.setData({
                      showTime:app.timeStamp(res.data.uptime),
                    })
                  }else{
                    that.setData({
                      isShowTime:true
                    })
                  }
                  if(res.data.is_up){
                    that.setData({
                      statusMsg: '已连接'
                    })
                  }else{
                    that.setData({
                      statusMsg: '未连接',
                      msgStyle:'redstyle'
                    })
                  }
                  if(res.data.proto == 'pppoe'){
                    wx.request({
                      url:that.data.url + '/cgi-bin/luci/admin/network/get_pppoe_status',
                      data:{wx:that.data.key},
                      header:{'content-type':'application/json'},
                      success: function(res){
                        //console.log(res);
                        if(res.data.code == 0){
                          that.setData({
                            statusMsg:'已连接'
                          })
                        }else if(res.data.code == 1){
                          if(res.data.msg){
                            that.setData({
                              statusMsg: res.data.msg,
                              msgColor:'red'
                            })
                          }else{
                            that.setData({
                              statusMsg:'连接中...'
                            })
                          }
                        }else{
                          that.setData({
                            statusMsg:'未连接',
                            msgColor:'red'
                          })
                        }
                      }
                    })
                  }
                }
              }

              
            })

          }
        })
      }
    })

  }
})