var app = getApp();
Page({
  data:{
    bindList:[],
    "ips": [],
    "ipindex":0,
    "macs": [],
    "macindex":0,
    masks:[],
    curip:'',
    curmac:'',
    "curmask":''
  },
  ipInp: function(e){
    this.setData({
      curip:e.detail.value
    })
  },
  macInp: function(e){
    this.setData({
      curmac:e.detail.value
    })
  },
  bindIpChange: function(e) {
    var that = this;
    this.setData({
      ipindex: e.detail.value,
      macindex:e.detail.value,
      curip:that.data.ips[e.detail.value],
      curmac:that.data.macs[e.detail.value],
      curmask:that.data.masks[e.detail.value]
    })
  },
  bindMacChange: function(e) {
    var that = this;
    that.setData({
      macindex: e.detail.value,
      curmac:that.data.macs[e.detail.value]
    })
  },
  maskInp: function(e){
    this.setData({
      curmask:e.detail.value
    })
  },
  bindBack: function(){
    wx.navigateBack({
      delta:1
    })
  },
  backBind:function(){
    wx.navigateBack({
      delta:1
    })
  },
  saveAddChange: function(){
    var that = this;
    if(that.data.curip == '' || that.data.curmac == '' || that.data.curmask == ''){
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
      return false;
    }
    if(!app.Vmacaddr(that.data.curmac)){
      wx.showToast({
        title:'MAC地址格式错误',
        duration:2000
      })
      return false;
    }

    //验证是否重复
    var flag = true;
    //console.log(that.data.bindedips);
    for(var i=0;i<that.data.bindedips.length;i++){
      if(that.data.curip == that.data.bindedips[i]){
        console.log(that.data.bindedips[i]);
        wx.showToast({
          title:'该IP地址已绑定',
          duration:2000
        })
        flag = false;
        return false;
      }
    }
    if(!flag){return false;}

    for(var i=0;i<that.data.bindedmacs.length;i++){
      if(that.data.curmac == that.data.bindedmacs[i]){
        wx.showToast({
          title:'该MAC地址已绑定',
          duration:2000
        })
        flag = false;
        return false;
      }
    }
    if(!flag){return false;}

    // var ipIsrepeat = [];
    // ipIsrepeat = that.data.ips.concat(that.data.curip);
    // console.log(that.data.ips);
    // console.log(ipIsrepeat);
    // var haship = {};
    // for(var i in ipIsrepeat){
    //   if(haship[ipIsrepeat[i]]){
    //     wx.showToast({
    //       title:'该IP地址已绑定',
    //       duration:2000
    //     })
    //     return false;
    //   };
    //   haship[ipIsrepeat[i]] = true
    // }
    // var macIsrepeat = [];
    // macIsrepeat = that.data.macs.concat(that.data.curmac);
    // console.log(macIsrepeat);
    // var hashmac = {};
    // for(var i in ipIsrepeat){
    //   if(hashmac[macIsrepeat[i]]){
    //     wx.showToast({
    //       title:'该MAC地址已绑定',
    //       duration:2000
    //     })
    //     return false;
    //   };
    //   hashmac[macIsrepeat[i]] = true
    // }

    wx.showToast({
      icon:'loading',
      title:'保存中...',
      duration:7000
    })
    
    var addlist = {};
    addlist.ip = that.data.curip;
    addlist.mac = that.data.curmac;
    addlist.mask = that.data.curmask || '';
    var bindedlist = that.data.bindList;
    var alllist = [];
    for(var i in bindedlist){
      alllist.push({ip:bindedlist[i].ipaddr,mac:bindedlist[i].macaddr,mask:bindedlist[i].mask})
    }
    alllist.push(addlist);
    //获取路由信息
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
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },2000)
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

                if(typeof(res.data) == 'string' && res.data.indexOf('Incorrect password') != -1){
                  wx.redirectTo({
                    url: '../../login/login'
                  });
                  return false;
                }

                that.setData({
                  bindList:res.data.ethers,
                  leaseList:res.data.leases,
                  curip:res.data.leases[0].ipaddr,
                  curmac:res.data.leases[0].macaddr,
                  curmask:res.data.leases[0].hostname
                });
                var iparr = [];
                for(var i in res.data.leases){
                  iparr.push(res.data.leases[i].ipaddr);
                }
                that.setData({
                  ips:iparr
                });

                var bindediparr = [];
                for(var i in res.data.ethers){
                  bindediparr.push(res.data.ethers[i].ipaddr);
                }
                that.setData({
                  bindedips:bindediparr
                })
                var bindedmacarr = [];
                for(var i in res.data.ethers){
                  bindedmacarr.push(res.data.ethers[i].macaddr);
                }
                that.setData({
                  bindedmacs:bindedmacarr
                })

                var macarr = [];
                for(var i in res.data.leases){
                  macarr.push(res.data.leases[i].macaddr);
                }
                that.setData({
                  macs:macarr
                });
                var maskarr = [];
                for(var i in res.data.leases){
                  maskarr.push(res.data.leases[i].hostname);
                }
                that.setData({
                  masks:maskarr
                });
              }
            });

          }
        })
      }
    });
  }
})