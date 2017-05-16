var app = getApp();
Page({
  data:{
    "wifi2gencry": ['无密码', 'WPA2-PSK强加密'],
    "wifi2gChannel":['自动','1','2','3','4','5','6','7','8','9','10','11'],
    'wifi2gTxpower':['低','中','高','穿墙'],
    "wifi5gencry": ['无密码', 'WPA2-PSK强加密'],
    "wifi5gChannel":['149','153','157','161','165'],
    'wifi5gTxpower':['低','中','高','穿墙'],
    'txpower':[[32,50,63,100],[15,16,17,20]],
    wifi2g_encry:'none',
    wifi5g_encry:'none',
    disabled2g:0,
    disabled5g:0,
    sethidden2g:0,
    sethidden5g:0,
    "eyeState2g":'eye_close',
    iTxpower2g:0,
    iTxpower5g:0,
    'inputType2g':true,
    "eyeState5g":'eye_close',
    'inputType5g':true,
    'MergeData':{
      'title':"2.4G网络",
      'tip':'none',
      'cont5g':'block'
    },

    Box5g:"none",
    isfocus2g:false,
    isfocus5g:false,

    choseLink:''

  },
  ssid2gInp: function(e){
    this.setData({
      ssid2g:e.detail.value
    })
  },
  ssid5gInp: function(e){
    this.setData({
      ssid5g:e.detail.value
    })
  },
  key2gInp: function(e){
    this.setData({
      key2g:e.detail.value
    })
  },
  key5gInp: function(e){
    this.setData({
      key5g:e.detail.value
    })
  },
  switch2gChange: function(e){
    var that = this;
    if(e.detail.value){
      that.setData({
        sethidden2g:'1'
      })
    }else{
      that.setData({
        sethidden2g:'0'
      })
    }
  },
  switch2gDisable: function(e){
    var that = this;
    if(e.detail.value){
      that.setData({
        ischecked2g:'checked',
        disabled2g:0,
        switch2gcont:0
      })
    }else{
      that.setData({
        ischecked2g:false,
        disabled2g:1,
        switch2gcont:1
      })
    }
  },
  switch5gChange: function(e){
    var that = this;
    if(e.detail.value){
      that.setData({
        sethidden5g:'1'
      })
    }else{
      that.setData({
        sethidden5g:'0'
      })
    }
  },
  switch5gDisable: function(e){
    var that = this;
    if(e.detail.value){
      that.setData({
        ischecked5g:'checked',
        disabled5g:0,
        switch5gcont:0
      })
    }else{
      that.setData({
        ischecked5g:false,
        disabled5g:1,
        switch5gcont:1
      })
    }
  },
  bind2gEncry: function(e) {
    this.setData({
      index2gEncry: e.detail.value
    });
    if(e.detail.value == 0){
      this.setData({
        wifi2g_encry:'none',
        key2g: ''
      })
    }else{
      this.setData({
        wifi2g_encry:'psk-mixed+tkip+ccmp'
      })
    }
  },
  bind2gChannel: function(e) {
    var that = this;
    if(that.data.choseLink == 'relay'){
      wx.showToast({
        title:'中继模式无法设置信道',
        duration:2000
      })
      return false;
    }
    this.setData({
      index2gChannel: e.detail.value
    })
  },
  bind2gTxpower: function(e) {
    this.setData({
      index2gTxpower: e.detail.value
    });
  },
  bind5gEncry: function(e) {
    this.setData({
      index5gEncry: e.detail.value 
    });
    if(e.detail.value == 0){
      this.setData({
        wifi5g_encry:'none',
        key5g:''
      })
    }else{
      this.setData({
        wifi5g_encry:'psk-mixed+tkip+ccmp'
      })
    }
  },
  bind5gChannel: function(e) {
    var that = this;
    if(that.data.choseLink == 'relay'){//中继模式 无法设置信道
      wx.showToast({
        title:'中继模式无法设置信道',
        duration:2000
      });
      return false
    }
    this.setData({
      index5gChannel: e.detail.value
    })
  },
  bind5gTxpower: function(e) {
    this.setData({
      index5gTxpower: e.detail.value
    });
  },
  change2gPwdShow: function(){
    var that = this;
    if(that.data.eyeState2g == 'eye_close'){
      that.setData({
        eyeState2g:'eye',
        inputType2g:false,
        isfocus2g:'focus'
      })
    }else{
      that.setData({
        eyeState2g:'eye_close',
        inputType2g:true,
        isfocus2g:"focus"
      })
    }
  },
  change5gPwdShow: function(){
    var that = this;
    if(that.data.eyeState5g == 'eye_close'){
      that.setData({
        eyeState5g:'eye',
        inputType5g:false,
        isfocus5g:'focus'
      })
    }else{
      that.setData({
        eyeState5g:'eye_close',
        inputType5g:true,
        isfocus5g:'focus'
      })
    }
  },
  wifiMerge: function(e){
    var that = this;
    if(e.detail.value){
      that.setData({
        'MergeData':{
        'title':"网络开关",
        'tip':'block',
        'cont5g':'none'
        }
      })
    }else{
      that.setData({
        'MergeData':{
        'title':"2.4G网络",
        'tip':'none',
        'cont5g':'block'
        }
      })
    }
  },
  saveWifiChange: function(){
    var that = this;
    var myreg = new RegExp("[`~!@$%^&*()=+|{}':;',\\[\\]<>/?~！￥……（）【】‘；：”“'。，、？§№☆★○●◎◇◆℃‰€°¤〓↓↑←→※▲△■＃＆＠＼︿♂♀]");
		var reg2g = /^[0-9a-zA-Z]*$/g;
    var reg5g = /^[0-9a-zA-Z]*$/g;
    //验证
    if(that.data.ssid2g == ''){
      wx.showToast({
        title:'无线名称不能为空',
        duration:2000
      })
      return false;
    }
    if(that.data.ssid2g.indexOf(' ')>=0){
      wx.showToast({
        title:'无线名称不能包含空格',
        duration:2000
      })
      return false
    }
    if(myreg.test(that.data.ssid2g)){
      wx.showToast({
        title:'无线名称格式错误',
        duration:2000
      })
      return false;
    }
    var len2g = that.data.ssid2g.length;
    var reallen2g = 0;
    var charCode2g = -1;
    for(var i=0; i<len2g;i++){
      charCode2g = that.data.ssid2g.charCodeAt(i);
      if(charCode2g >= 0 && charCode2g <= 128){
        reallen2g += 1;
      }else{
        reallen2g += 3;
      }
    }
    if(reallen2g > 30){
      wx.showToast({
        title:'无线名称长度不合法',
        duration:2000
      })
      return false;
    }
    if(that.data.index2gEncry == '1'){
      if(that.data.key2g == '' || reg2g.test(that.data.key2g)!= true || that.data.key2g.indexOf(' ')>=0 || that.data.key2g.length<8 || that.data.key2g.length>63){
        console.log(that.data.key2g);
        wx.showToast({
          title:'2.4G密码输入错误',
          duration:2000
        })
        return false;
      }
    }


    if(that.data.Box5g == 'block'){
      if(that.data.ssid5g == ''){
        wx.showToast({
          title:'无线名称不能为空',
          duration:2000
        })
        return false;
      }
      if(that.data.ssid5g.indexOf(' ')>=0){
        wx.showToast({
          title:'无线名称不能包含空格',
          duration:2000
        })
        return false
      }
      if(myreg.test(that.data.ssid5g)){
        wx.showToast({
          title:'无线名称格式错误',
          duration:2000
        })
        return false;
      }
      var len5g = that.data.ssid5g.length;
      var reallen5g = 0;
      var charCode = -1;
      for(var i=0; i<len5g;i++){
        charCode = that.data.ssid5g.charCodeAt(i);
        if(charCode >= 0 && charCode <= 128){
          reallen5g += 1;
        }else{
          reallen5g += 3;
        }
      }
      if(reallen5g > 30){
        wx.showToast({
          title:'无线名称长度不合法',
          duration:2000
        })
        return false;
      }
      if(that.data.index5gEncry == '1'){
        if(that.data.key5g == '' || reg5g.test(that.data.key5g)!= true || that.data.key5g.indexOf(' ')>=0 || that.data.key5g.length<8 || that.data.key5g.length>63){
          console.log(that.data.key2g,that.data.key5g);
          wx.showToast({
            title:'5G密码输入错误',
            duration:2000
          })
          return false;
        }

      }

    }

    wx.showToast({
      icon:'loading',
      title:'保存中...',
      duration:7000
    })
    //获取路由信息
    wx.request({
      url:that.data.url + "/cgi-bin/luci/admin/wireless/wifi_setup",
      data:{
        wx:that.data.key,
        reqdata:{
          wifi0_ssid:that.data.ssid2g,
          wifi0_encryption:that.data.wifi2g_encry,
          wifi0_password:that.data.key2g,
          wifi0_channel:that.data.index2gChannel,
          wifi0_txpower:that.data.txpower[that.data.iTxpower2g][that.data.index2gTxpower],
          wifi0_hidden:that.data.sethidden2g,
          wifi0_disabled:that.data.disabled2g,

          wifi1_ssid:that.data.ssid5g,
          wifi1_encryption:that.data.wifi5g_encry,
          wifi1_password:that.data.key5g,
          wifi1_channel:that.data.wifi5gChannel[that.data.index5gChannel],
          wifi1_txpower:that.data.txpower[that.data.iTxpower5g][that.data.index5gTxpower],
          wifi1_hidden:that.data.sethidden5g,
          wifi1_disabled:that.data.disabled5g,

          merge:'0'
        }
      },
      header: {"content-type":"application/json"},
      success: function(res){
        if(res.data.code == '0'){
          wx.showToast({
            title:'保存成功',
            duration:2000
          });
          setTimeout(function(){
            wx.switchTab({
              url: '../../set/set'
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
            wx.request({//判断是否为中继模式，是则无法设置信道
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getWanInfo",
              data:{wx:that.data.key,config:1},
              header: {"content-type":"application/json"},
              success: function(res){
                //console.log(res);
                if(res.data.apClientSet == '0'){
                  that.setData({
                    'choseLink': res.data.proto
                  })
                }else{//中继模式
                  that.setData({
                    "choseLink": 'relay'
                  })
                }
              }
            });

            wx.request({
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getWifiInfo",
              data:{wx:that.data.key},
              header: {"content-type":"application/json"},
              success: function(res){
                
                if(typeof(res.data) == 'string' && res.data.indexOf('Incorrect password') != -1){
                  wx.redirectTo({
                    url: '../../login/login'
                  });
                  return false;
                }

                var data2g = res.data.wifi2G;
                var data5g = res.data.wifi5G;
                that.setData({
                  ssid2g:data2g.ssid,
                  //encry2g:data2g.encry,
                  channel2g:data2g.channel,
                  txpower2g:data2g.txpower,
                  //key2g:data2g.key
                });
                if(res.data.wifi2G.hidden != '0'){
                  that.setData({
                    hidden2g:"checked",
                  })
                }else{
                  that.setData({
                    hidden2g:false,
                  })
                };
                if(res.data.wifi2G.is_up == '1'){
                  that.setData({
                    ischecked2g:false,
                    switch2gcont:1,
                    disabled2g: 1
                  })
                }else{
                  that.setData({
                    ischecked2g:'checked',
                    switch2gcont:0,
                    disabled2g: 0
                  })
                };
                if(res.data.wifi2G.encry != 'none'){
                  that.setData({
                    index2gEncry : 1,
                    key2g:data2g.key,
                    wifi2g_encry:'psk-mixed+tkip+ccmp',
                  })
                }else{
                  that.setData({
                    index2gEncry : 0,
                    key2g:'',
                    wifi2g_encry:'none',
                  })
                };
                if(res.data.wifi2G.channel == '0'){
                  that.setData({
                    index2gChannel:'0'
                  })
                }else{
                  that.setData({
                    index2gChannel:data2g.channel
                  })
                };
                if(that.data.txpower[0].indexOf(parseInt(res.data.wifi2G.txpower))>-1){
                  var txp2gindex = that.data.txpower[0].indexOf(parseInt(res.data.wifi2G.txpower));
                  that.setData({
                    index2gTxpower: txp2gindex,
                    iTxpower2g:0
                  })
                }else if(that.data.txpower[1].indexOf(parseInt(res.data.wifi2G.txpower))>-1){
                  var txp2gindex = that.data.txpower[1].indexOf(parseInt(res.data.wifi2G.txpower));
                  that.setData({
                    index2gTxpower: txp2gindex,
                    iTxpower2g:1
                  })
                };
                //console.log(res.data.wifi5G.device);
                if(res.data.wifi5G.device){//有5g信息
                  that.setData({
                    Box5g:"block",

                    ssid5g:data5g.ssid,
                    //encry5g:data5g.encry,
                    channel5g:data5g.channel,
                    txpower5g:data5g.txpower,
                    //key5g:data5g.key
                  });
                  if(res.data.wifi5G.hidden != '0'){
                    that.setData({
                      hidden5g:"checked",
                    })
                  }else{
                    that.setData({
                      hidden5g:false,
                    })
                  };
                  if(res.data.wifi5G.is_up == '1'){
                    that.setData({
                      ischecked5g:false,
                      switch5gcont:1,
                      disabled5g: 1
                    })
                  }else{
                    that.setData({
                      ischecked5g:'checked',
                      switch5gcont:0,
                      disabled5g: 0
                    })
                  };
                  if(res.data.wifi5G.encry != 'none'){
                    that.setData({
                      index5gEncry : 1,
                      key5g:data5g.key,
                      wifi5g_encry:'psk-mixed+tkip+ccmp'
                    })
                  }else{
                    that.setData({
                      index5gEncry : 0,
                      key5g:'',
                      wifi5g_encry:'none'
                    })
                  };
                  if(res.data.wifi5G.channel == '0'){
                    that.setData({
                      index5gChannel:'0'
                    })
                  }else{
                    that.setData({
                      index5gChannel:(that.data.wifi5gChannel).indexOf(data5g.channel)
                    })
                  };
                  if(that.data.txpower[0].indexOf(parseInt(res.data.wifi5G.txpower))>-1){
                    var txp5gindex = that.data.txpower[0].indexOf(parseInt(res.data.wifi5G.txpower));
                    that.setData({
                      index5gTxpower: txp5gindex,
                      iTxpower5g:0
                    })
                  }else if(that.data.txpower[1].indexOf(parseInt(res.data.wifi5G.txpower))>-1){
                    var txp5gindex = that.data.txpower[1].indexOf(parseInt(res.data.wifi5G.txpower));
                    that.setData({
                      index5gTxpower: txp5gindex,
                      iTxpower5g:1
                    })
                  }
                }else{
                  that.setData({
                    Box5g:"none"
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