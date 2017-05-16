//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },
  onShow: function(){
    var openid;
    wx.login({
      success: function (res) {
        //console.log(res);
        if (res.code) {
          var appid = 'wx827ddb3ccdc79fcc';
          var secret = 'ffdd8b95901de55a0449f588997271c6';
          var code = res.code;
          //发起网络请求
          wx.request({//获取openid
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
            header: { 'content-type': 'application/json' },
            success: function (res) {
              //console.log(res);
              openid = res.data.openid;


              var timer = setInterval(function () {//获取缓存中的mac，如果存在则为远程管理，每隔 n 秒 ping 一次
                wx.getStorage({
                  key: 'mac',
                  success: function (res) {
                    //console.log(res);
                    if (res.data != '') {
                      // clearInterval(timer);
                      var mac = res.data;
                      var pingTimer = setInterval(function () {

                        wx.request({
                          url: 'https://xwechat.kunteng.org:65443/api/v1/users/' + openid + '/opt/' + mac + '/ping',
                          method: 'GET',
                          header: { 'content-type': 'application/json' },
                          success: function (res) {
                            //console.log(res);
                          }
                        })

                      }, 9000)//每隔15分钟ping一次
                    }
                  },
                })
              }, 10000)


            }
          })
        }
      }
    })

    
  },
  onHide: function(){
    wx.setStorage({
      key: 'mac',
      data: ''
    });
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

  //时间转换
  timeStamp: function( second_time ){
        var time = parseInt(second_time) + "秒";
        if( parseInt(second_time )> 60){
            var second = parseInt(second_time) % 60;
            var min = parseInt(second_time / 60);
            time = min + "分" + second + "秒";
            if( min > 60 ){
                min = parseInt(second_time / 60) % 60;
                var hour = parseInt( parseInt(second_time / 60) /60 );
                time = hour + "小时" + min + "分" + second + "秒";
                if( hour > 24 ){
                    hour = parseInt( parseInt(second_time / 60) /60 ) % 24;
                    var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );
                    time = day + "天" + hour + "小时" + min + "分" + second + "秒";
                }
            }
        }
        return time;
  },
  //textarea内容转换
  TransferString: function(str){
    var string = str;
    try {  
			string = string.replace(/\r\n/g, ",")  
			string = string.replace(/\n/g, ",");  
		}catch(e) {  
		  console.log(e.message);  
		}
		return string; 
  },

  //验证
  Vinteger: function(a){
    return null != a.match(/^-?[0-9]+$/);
  },
  Vlimit: function(a){
    function integer(a){
      return null != a.match(/^-?[0-9]+$/);
    }
    return integer(a) && 0 <= a && 38400 >= a;
  },
  Vipaddr: function(a){
    function ip4addr(a){
      return a.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)(\/(\d+))?$/) ? 0 < RegExp.$1 && 223 >= RegExp.$1 && 0 <= RegExp.$2 && 255 >= RegExp.$2 && 0 <= RegExp.$3 && 255 >= RegExp.$3 && 0 < RegExp.$4 && 255 > RegExp.$4 && (!RegExp.$5 || 0 <= RegExp.$6 && 32 >= RegExp.$6) : !1
    };
    function ip6addr(a){
      if (a.match(/^([a-fA-F0-9:.]+)(\/(\d+))?$/) && (!RegExp.$2 || 0 <= RegExp.$3 && 128 >= RegExp.$3)) {
            a = RegExp.$1;
            if ("::" == a) return ! 0;
            if (0 < a.indexOf(".")) {
                var b = a.lastIndexOf(":");
                if (!b || !ip4addr(a.substr(b + 1))) return ! 1;
                a = a.substr(0, b) + ":0:0"
            }
            if (0 <= a.indexOf("::")) {
                for (var b = 0,
                d = "0",
                c = 1; c < a.length - 1; c++)":" == a.charAt(c) && b++;
                if (7 < b) return ! 1;
                for (c = 0; c < 7 - b; c++) d += ":0";
                a.match(/^(.*?)::(.*?)$/) && (a = (RegExp.$1 ? RegExp.$1 + ":": "") + d + (RegExp.$2 ? ":" + RegExp.$2: ""))
            }
            return null != a.match(/^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/)
        }
        return ! 1
    };
    return ip4addr(a) || ip6addr(a);
  },
  Vport: function(a){
    function integer(a){
      return null != a.match(/^-?[0-9]+$/);
    };
    return integer(a) && 0<a && 65535>=a
  },
  Vmacaddr: function(a){
    return null != a.match(/^([a-fA-F0-9]{2}(:|-)){5}[a-fA-F0-9]{2}$/);
  },
  Vmacaddr2: function(a){
    return null != a.match(/^[a-fA-F0-9]{12}$/);
  },
  Vssid: function(a){
    var myreg = new RegExp("[！￥……（）【】‘；：”“'。，、？§№☆★○●◎◇◆℃‰€°¤〓↓↑←→※▲△■＆＠＼︿♂♀]");
    return myreg.test(a);
  },
  Vnetmask: function(a){
    return a.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)(\/(\d+))?$/) ? 0 <= RegExp.$1 && 255 >= RegExp.$1 && 0 <= RegExp.$2 && 255 >= RegExp.$2 && 0 <= RegExp.$3 && 255 >= RegExp.$3 && 0 <= RegExp.$4 && 255 >= RegExp.$4 && (!RegExp.$5 || 0 <= RegExp.$6 && 32 >= RegExp.$6) : !1
  },
  Vdomain: function(a){
    return null != a.match(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/g)
  },



  globalData:{
    userInfo:null,

    localUrl:'https://wifi.kunteng.org',
    remoteUrl:'https://xwechat.kunteng.org'
  },
  gloabalValue:1
})