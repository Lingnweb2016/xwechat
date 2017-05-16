// pages/connect/connect.js
var data2 = []
var app = getApp()
Page({
  data:{
    navTab: ["连接设备","禁用设备","限速设置"],
    currentNavtab: "0",
    devClassNav:{
      "all":"全部",
      "LAN":"有线",
      "2.4G":"2.4G",
      "5G":'5G',
      "offline":"离线"
    },
    deviceClass:["全部","有线","2.4G","5G","离线"],
    curDevTab: "all",
    showDevClass:"all",
    onlineNum:0,
    //deviceList: [{}] ,
    Organizations: {
      "Apple, Inc." : "apple.png",		
      "HTC Corporation" : "htc.png",
      "Nokia Corporation" : "nokia.png",	
      "zte corporation" : "zte.png",
      "Samsung Electronics Co.,Ltd" : "samsung.png",
      "LG ELECTRONICS INC" : "lg.png",
      "LG Electronics (Mobile Communications" : "lg.png",	
      
      "Dell Inc." : "dell.png",
      "ASUSTek COMPUTER INC." : "asus.png",
      "ACER PERIPHERALS, INC." : "acer.png",
      "Hewlett Packard Enterprise" : "hp.png",	
      "Shenzhen Forcelink Electronic Co, Ltd" : "hasee.png",	
      
      "HUAWEI TECHNOLOGIES CO.,LTD" : "huawei.png",
      "Xiaomi Communications Co Ltd" : "xiaomi.png",
      "Qihoo  360  Technology Co.,Ltd" : "360.png",
      "Qiku Internet Network Scientific (Shenzhen) Co., Ltd." : "360.png",
      "MEIZU Technology Co., Ltd." : "meizu.png",
      "Smartisan Technology Co., Ltd" : "smartisan.png",
      "GUANGDONG OPPO MOBILE TELECOMMUNICATIONS CORP.,LTD" : "oppo.png",
      "vivo Mobile Communication Co., Ltd." : "vivo.png",

      "Gionee Communication Equipment Co.,Ltd." : "gionee.png",
      "Gionee Communication Equipment Co,Ltd.ShenZhen" : "gionee.png",

      "Letv Mobile and Intelligent Information Technology (Beijing) Corporation Ltd." : "letv.png",
      "Lemobile Information Technology (Beijing) Co., Ltd" : "letv.png",
      "Yulong Computer Telecommunication Scientific (Shenzhen) Co.,Ltd" : "coolpad.png",	
      
      "Lenovo" : "lenovo.png",
      "Lenovo (Beijing) Co., Ltd." : "lenovo.png",
      "Lenovo Mobile Communication Technology Ltd." : "lenovo.png",
      "Lenovo Mobile Communication (Wuhan) Company Limited" : "lenovo.png",	
      "Motorola Mobility LLC, a Lenovo Company" : "moto.png",
      
      "Sony Corporation" : "sony.png",
      "Sony Mobile Communications AB" : "sony.png",
      "Sony Interactive Entertainment Inc." : "sony.png",
      
      "Fujian LANDI Commercial Equipment Co.,Ltd" : "landi.png",
  },
    curTabIndex:"0",
    upload:"0",
    download:"0",

    speedBox: "none",//tab限速设置中速率内容
    btnspeedBox: "none",
    upSpeed:"",
    downSpeed:'',
    enable: '',
    isEnable:false,

    disabledList:[]
  },
  switchTab: function(e){
    var that = this;
    that.setData({
        currentNavtab: e.currentTarget.dataset.idx
    });
    if(e.currentTarget.dataset.idx == '0'){
      wx.request({
        url: that.data.url + '/cgi-bin/luci/admin/connect/getAllClientList',
          data:{wx:that.data.key},
          header: {"content-type":"application/json"},
          success: function(res){
            that.setData({
              "deviceList": res.data
            });
          }
        });
    }
    if(e.currentTarget.dataset.idx == '1'){
      //获取禁用设备数据
      wx.request({
        url: that.data.url + '/cgi-bin/luci/admin/connect/getBlackList',
        data:{wx:that.data.key},
        header: {"content-type":"application/json"},
        success: function(res){
          //console.log(res.data);
          that.setData({
            disabledList:res.data
          })
        }
      });
    }
  },
  changeListTab: function(e){
    var curid = e.currentTarget.id;
    this.setData({
      curDevTab:e.currentTarget.dataset.idx
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },

  //////////////////////////限速设置////////////////////////////
  switchQosChange: function(e){
    var that = this;
    if(e.detail.value){
      that.setData({
        //speedBox:'block',
        isEnable:'checked',
        btnspeedBox:'block',
        enable:'1'
      })
    }else{
      that.setData({
        //speedBox:'none',
        isEnable:false,
        upSpeed:'',
        downSpeed:'',
        enable:'0'
      })
    }
  },
  upSpeedInp: function(e){
    this.setData({
      upSpeed:e.detail.value
    })
  },
  downSpeedInp: function(e){
    this.setData({
      downSpeed:e.detail.value
    })
  },
  disabledChange: function(e){
    var that = this;
    var mac = e.currentTarget.dataset.mac;
    wx.showToast({
      icon:'loading',
      title:'操作中...'
    });
    //打印用户输入数据
    wx.getStorage({
      key: 'password',
      success: function(res){
        that.setData({
          key:res.data
        });
        wx.request({
          url: that.data.url + '/cgi-bin/luci/admin/connect/delFromBlackList',
          data:{
            wx:that.data.key,
            mac:mac
          },
          header: {"content-type":"application/json"},
          success: function(res){
            //console.log(res.data);
            if(res.data.status == '0'){
              wx.showToast({
                title:'成功',
                duration:2000
              });
              //获取禁用设备数据
              wx.request({
                url: that.data.url + '/cgi-bin/luci/admin/connect/getBlackList',
                data:{wx:that.data.key},
                header: {"content-type":"application/json"},
                success: function(res){
                  console.log(res.data);
                  that.setData({
                    disabledList:res.data
                  })
                }
              });


            }else{
              wx.showToast({
                title:'失败',
                duration:2000
              })
            }
          }
        });
      }
    })

  },
  saveSetSpeed: function(){
    var that = this;
    if(that.data.isEnable == 'checked'){
      if(that.data.upSpeed == "" || that.data.downSpeed == ""){
        wx.showToast({
          title:'输入不能为空',
          duration:2000
        })
        return false;
      }else if(!app.Vlimit(String(that.data.upSpeed)) || !app.Vlimit(String(that.data.downSpeed))){
        wx.showToast({
          title:'输入不正确(0~38400)',
          duration:2000
        })
        return false;
      }
    }
    
    wx.showToast({
      icon:'loading',
      duration:6000
    })
    wx.getStorage({
      key: 'password',
      success: function(res){
        //console.log(res.data)
        that.setData({
          key:res.data
        });
        wx.request({
          url: that.data.url + '/cgi-bin/luci/admin/connect/setQosGlobalRule',
          data:{
            wx:that.data.key,
            enable:that.data.enable,
            upSpeed:that.data.upSpeed*1024,
            downSpeed:that.data.downSpeed*1024
          },
          header: {"content-type":"application/json"},
          success: function(res){
            //console.log(res.data);
            if(res.data.status == "1"){
              wx.showToast({
                title:"设置成功",
                duration:2000
              });
              setTimeout(function(){
                that.setData({
                  currentNavtab:0
                })
              },2000)
            }else{
              wx.showToast({
                title:"设置失败",
                duration:2000
              })
            }
          },
          fail: function(){
            wx.showToast({
              title: "设置失败",
              duration: 2000
            })
          }
        });
      }
    });

    
  },




  //下拉刷新
  onPullDownRefresh(){

    wx.showNavigationBarLoading();//在标题栏中宣誓加载

    var that = this;
    
        wx.request({
          url:that.data.url + '/cgi-bin/luci/admin/connect/getAllClientList',
          data:{wx:that.data.key},
          header: {"content-type":"application/json"},
          success: function(res){
            
            if(typeof(res.data) == 'string' && res.data.indexOf('Incorrect password') != -1){
              wx.redirectTo({
                url: '../login/login'
              });
              return false;
            }

            that.setData({
              "deviceList": res.data
            });
            that.setData({
                "onlineNum":0
            })
            for(var i in that.data.deviceList){
              //console.log(that.data.deviceList[i].mac_source);
              var offlineNum = 0;
              if(that.data.deviceList[i].mac_source != "offline"){
                that.setData({
                  "onlineNum":that.data.onlineNum+1
                })
              }
            }
          },
          fail: function(){
            wx.showToast({
              title: "获取列表失败",
              duration: 2000
            })
          },
          complete: function(){
            wx.hideNavigationBarLoading();//加载完成
            wx.stopPullDownRefresh();//停止下拉刷新
          }
        });


        //获取测速数据
        wx.request({
          url: that.data.url + '/cgi-bin/luci/wechat/miniProgram/getBandWidth',
          data:{wx:that.data.key},
          header: {"content-type":"application/json"},
          success: function(res){
            //console.log(res.data);
            that.setData({
              upload:res.data.upload,
              download:res.data.download
            })
          },
          fail: function(){
            wx.showToast({
              title: "获取失败",
              duration: 2000
            })
          },
          complete: function(){
            wx.hideNavigationBarLoading();//加载完成
            wx.stopPullDownRefresh();//停止下拉刷新
          }
        });
        //获取全网限速数据
        wx.request({
          url: that.data.url + '/cgi-bin/luci/admin/connect/getQosStatus',
          data:{wx:that.data.key},
          header: {"content-type":"application/json"},
          success: function(res){
            //console.log(res.data);
            that.setData({
              enable:res.data.enable,
              upSpeed:parseInt(res.data.upRate)/1024,
              downSpeed:parseInt(res.data.downRate)/1024,
            });
            if(res.data.enable == '1'){
              that.setData({
                isEnable:'checked',
                btnspeedBox:'block'
              })
            }
          },
          complete: function(){
            wx.hideNavigationBarLoading();//加载完成
            wx.stopPullDownRefresh();//停止下拉刷新
          }
        });

  },
  onLoad:function(options){
    var that = this;
    wx.getStorage({
      key: 'password',
      success: function(res){
        //console.log(res.data)
        that.setData({
          key:res.data
        });
        wx.getStorage({
          key: 'URL',
          success: function (res) {
            that.setData({
              url: res.data
            });
            //判断单双频设备
            wx.request({
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getWifiInfo",
              data:{wx:that.data.key},
              header: {"content-type":"application/json"},
              success: function(res){
                
                if(typeof(res.data) == 'string' && res.data.indexOf('Incorrect password') != -1){
                  wx.redirectTo({
                    url: '../login/login'
                  });
                  return false;
                }

                if(res.data.wifi5G.device){//有5g信息
                  that.setData({
                    deviceClass:["全部","有线","2.4G","5G","离线"],
                    devClassNav:{
                      "all":"全部",
                      "LAN":"有线",
                      "2.4G":"2.4G",
                      "5G":'5G',
                      "offline":"离线"
                    },
                  })
                }else{
                  that.setData({
                    deviceClass:["全部","有线","2.4G","离线"],
                    devClassNav:{
                      "all":"全部",
                      "LAN":"有线",
                      "2.4G":"2.4G",
                      "offline":"离线"
                    },
                  })
                }
              }
            })
            wx.request({
              url:that.data.url + '/cgi-bin/luci/admin/connect/getAllClientList',
              data:{wx:that.data.key},
              header: {"content-type":"application/json"},
              success: function(res){
                //console.log(res.data);
                that.setData({
                  "deviceList": res.data
                });
                for(var i in that.data.deviceList){
                  //console.log(that.data.deviceList[i].mac_source);
                  var offlineNum = 0;
                  if(that.data.deviceList[i].mac_source != "offline"){
                    that.setData({
                      "onlineNum":that.data.onlineNum+1
                    })
                  }
                }
              },
              fail: function(){
                wx.showToast({
                  title: "获取列表失败",
                  duration: 2000
                })
              }
            });

            //获取测速数据
            wx.request({
              url:that.data.url + '/cgi-bin/luci/wechat/miniProgram/getBandWidth',
              data:{wx:that.data.key},
              header: {"content-type":"application/json"},
              success: function(res){
                //console.log(res.data);
                that.setData({
                  upload:res.data.upload,
                  download:res.data.download
                })
              },
              fail: function(){
                wx.showToast({
                  title: "获取失败",
                  duration: 2000
                })
              },
              complete: function(){
                wx.hideNavigationBarLoading();//加载完成
                wx.stopPullDownRefresh();//停止下拉刷新
              }
            });

            //获取全网限速数据
            wx.request({
              url:that.data.url + '/cgi-bin/luci/admin/connect/getQosStatus',
              data:{wx:that.data.key},
              header: {"content-type":"application/json"},
              success: function(res){
                //console.log(res.data);
                that.setData({
                  enable:res.data.enable,
                  upSpeed:parseInt(res.data.upRate)/1024,
                  downSpeed:parseInt(res.data.downRate)/1024,
                });
                if(res.data.enable == '1'){
                  that.setData({
                    isEnable:'checked',
                    btnspeedBox:'block'
                  })
                }else{
                  that.setData({
                    isEnable:false,
                    btnspeedBox:'none'
                  })
                }
              }
            });
            //获取禁用设备数据
            wx.request({
              url:that.data.url + '/cgi-bin/luci/admin/connect/getBlackList',
              data:{wx:that.data.key},
              header: {"content-type":"application/json"},
              success: function(res){
                //console.log(res.data);
                that.setData({
                  disabledList:res.data
                })
              }
            });

          }
        })

      }
    });
  },
  onReady:function(){
    // 页面渲染完成

  },
  onShow:function(){
    var that = this;
    wx.getStorage({
      key: 'password',
      success: function(res){
        //console.log(res.data)
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
              url:that.data.url + '/cgi-bin/luci/admin/connect/getAllClientList',
              data:{wx:that.data.key},
              header: {"content-type":"application/json"},
              success: function(res){
                //console.log(res.data);
                that.setData({
                  deviceList: res.data
                });
              }
            });
          }
        })
      }
    });
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})