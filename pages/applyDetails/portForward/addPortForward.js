var app = getApp();
Page({
  data:{
    protos:['TCP','UDP','TCP+UDP'],
    protoindex:0,
    ips:[],
    curname:'',
    cursrcport:'',
    curdestport:'',
    curproto:'tcp',
    curip:''
  },
  backBind: function(){
    wx.navigateBack({
      delta: 1
    })
  },
  bindProtoChange: function(e){
    var that = this;
    that.setData({
      protoindex:e.detail.value,
      curproto:that.data.protos[e.detail.value].toLowerCase()
    });
    if(e.detail.value == 2){
      that.setData({
        curproto:'tcpudp'
      })
    }
  },
  bindIpChange: function(e){
    var that = this;
    that.setData({
      ipindex:e.detail.value,
      curip:that.data.ips[e.detail.value]
    })
  },
  nameInp: function(e){
    this.setData({
      curname:e.detail.value
    })
  },
  srcportInp: function(e){
    this.setData({
      cursrcport:e.detail.value
    })
  },
  ipInp: function(e){
    this.setData({
      curip: e.detail.value
    })
  },
  destportInp: function(e){
    this.setData({
      curdestport:e.detail.value
    })
  },
  saveAddChange: function(){
    var that = this;
    if(that.data.curname == '' || that.data.cursrcport == '' || that.data.curdestport == '' || that.data.curip == ''){
      wx.showToast({
        title:'输入不能为空',
        duration:2000
      })
      return false;
    }
    if(!app.Vipaddr(that.data.curip)){
      wx.showToast({
        title:'IP地址格式错误',
        duration:2000
      })
      return false
    }
    if(!app.Vport(that.data.cursrcport)){
      wx.showToast({
        title:'外部端口输入不正确',
        duration:2000
      })
      return false
    }
    if(!app.Vport(that.data.curdestport)){
      wx.showToast({
        title:'内部端口输入不正确',
        duration:2000
      })
      return false;
    }

    wx.showToast({
      icon:'loading',
      title:'保存中...',
      duration:7000
    })
    wx.request({
      url:that.data.url + "/cgi-bin/luci/admin/firewall/setPortForward",
      data:{
        wx:that.data.key,
        ip:that.data.curip,
        name:that.data.curname,
        proto:that.data.curproto,
        sport:that.data.cursrcport,
        dport:that.data.curdestport
      },
      header: {"content-type":"application/json"},
      success: function(res){
        if(res.data.code == 0){
          wx.showToast({
            title:'保存成功',
            duration:2000
          });
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            })
          },2000)
        }else if(res.data.code == 1){
          wx.showToast({
            title:'参数不合法',
            duration:2000
          });
        }else if(res.data.code == 2){
          wx.showToast({
            title:'外部端口有重复',
            duration:2000
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

                var iparr = [];
                for(var i in res.data.clients){
                  iparr.push(res.data.clients[i].ipaddr);
                }
                that.setData({
                  ips:iparr
                });

              }
            });

          }
        })
      }
    });
  }
})