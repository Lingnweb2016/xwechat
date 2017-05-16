// pages/apply/apply.js
Page({
  data:{
    navTab: ["已安装应用","应用市场"],
    currentNavtab: "0",
    iconlist:[],
    appList: [{
      "app_name":"拨号日志",
      "app_icon":"pppoeLog",
      "app_url":"../applyDetails/pppoeLog/pppoeLog"
    },{
      "app_name":"DHCP静态绑定",
      "app_icon":"macBind",
      "app_url":"../applyDetails/macBind/macBind"
    },{
      "app_name":"网络测速",
      "app_icon":"speedTest",
      "app_url":"../applyDetails/speedTest/speedTest"
    },{
      "app_name":"网络诊断",
      "app_icon":"netDiagnose",
      "app_url":"../applyDetails/netDiagnose/netDiagnose"
    },{
      "app_name":"端口映射",
      "app_icon":"portForward",
      "app_url":"../applyDetails/portForward/portForward"
    },{
      "app_name":"Apfree_WifiDog",
      "app_icon":"apfreeWifiDog",
      "app_url":"../applyDetails/apfreeWifiDog/apfreeWifiDog"
    },{
      "app_name":"定时重启",
      "app_icon":"autoReboot",
      "app_url":"../applyDetails/autoReboot/autoReboot"
    },{
      "app_name":"Shadowsocks",
      "app_icon":"shadowsocks",
      "app_url":"../applyDetails/shadowsocks/shadowsocks"
    },{
      "app_name":"广告屏蔽大师",
      "app_icon":"adbyby",
      "app_url":"../applyDetails/adbyby/adbyby"
    },{
      "app_name":"文件共享",
      "app_icon":"samba",
      "app_url":"../applyDetails/samba/samba"
    }]
  },
  switchTab: function(e){
    this.setData({
        currentNavtab: e.currentTarget.dataset.idx
    });
  },
  onLoad:function(options){
    var that = this;
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
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getAppList",
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
                  iconlist:res.data
                })
              },
              fail: function(){
                wx.showToast({
                  title:'数据获取失败',
                  duration:2000
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

    wx.showNavigationBarLoading();//在标题栏中宣誓加载

    var that = this;
    wx.request({
      url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getAppList",
      data:{wx:that.data.key},
      header: {"content-type":"application/json"},
      success: function(res){
        //console.log(res.data);
        that.setData({
          iconlist:res.data
        })
      },
      complete: function(){
        wx.hideNavigationBarLoading();//加载完成
        wx.stopPullDownRefresh();//停止下拉刷新
      }
    });

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
  }
})