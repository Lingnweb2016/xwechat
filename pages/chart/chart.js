var wxCharts = require('../../utils/wxcharts.js');
var Charts = require('../../utils/charts.js');
var app = getApp();
var ringChart = null;
var areaChart = null;
var timer = null;
Page({
  data:{
    navTab: ["实时网络状态","CPU状态","内存状态"],
    currentNavtab: "2",


  },
  switchTab: function(e){
    var that = this;
    that.setData({
        currentNavtab: e.currentTarget.dataset.idx
    });
  },
  touchHandler: function (e) {
    console.log(ringChart.getCurrentDataIndex(e));
  }, 
  onLoad: function (e) {
      wx.showToast({
          icon:'loading',
          title:'加载中...',
          duration:7000
      })
    var that = this;
    //打印用户输入数据
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
            //获取路由信息
            timer = setInterval(function(){

              wx.request({
                url:that.data.url + '/cgi-bin/luci/admin/system/getDeviceInfo',
                data:{wx:that.data.key},
                header: {"content-type":"application/json"},
                success: function(res){
                  
                  if(typeof(res.data) == 'string' && res.data.indexOf('Incorrect password') != -1){
                    wx.redirectTo({
                        url: '../login/login'
                    });
                    return false;
                  }

                  var data = res.data.meminfo;
                  that.setData({
                    total: parseInt(data.total)/1024,
                    avl: (parseInt(data.free)+parseInt(data.buffered))/1024,
                    free: parseInt(data.free)/1024,
                    buff:parseInt(data.buffered)/1024,
                    use: parseInt(data.total)/1024 - ((parseInt(data.free)+parseInt(data.buffered))/1024),

                    atotle:Math.round(parseInt(data.total)/1024/1024/16)*16,
                    ause: ((parseInt(data.total)/1024 - ((parseInt(data.free)+parseInt(data.buffered))/1024))/1024).toFixed(2),
                    aavl: ((parseInt(data.free)+parseInt(data.buffered))/1024/1024).toFixed(2),
                    buff2: (parseInt(data.buffered)/1024/1024).toFixed(2),
                  });


                  var windowWidth = 750;
                      try {
                          var res = wx.getSystemInfoSync();
                          windowWidth = res.windowWidth;
                      } catch (e) {
                          console.error('getSystemInfoSync failed!');
                      }

                      ringChart = new wxCharts({
                          animation: true,
                          canvasId: 'ringCanvas',
                          type: 'ring',
                          title: {
                            //   name: '70%',
                            //   color: '#7cb5ec',
                              fontSize: 25
                          },
                        //   subtitle: {
                        //       name: '空闲',
                        //       color: '#666666',
                        //       fontSize: 15
                        //   },
                          series: [{
                              name: '空闲',
                              data: that.data.free,
                              stroke: true
                          }, {
                              name: '已用',
                              data: that.data.use,
                              stroke: false
                          }, {
                              name: '缓存',
                              data: that.data.buff,
                              stroke: false
                          }],
                          disablePieStroke: true,
                          width: windowWidth,
                          height: 200,
                          dataLabel: false,
                          legend: true,
                          padding: 0

                      });
                      ringChart.stopAnimation();

                    wx.hideToast();

                },
                fail: function(){
                    wx.showToast({
                        title:'数据获取失败',
                        duration:2000
                    })
                }
              });

            },5000)

          }
        })


      }
    });





    var windowWidth = 320;
        try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
        } catch (e) {
          console.error('getSystemInfoSync failed!');
        }
        
        areaChart = new wxCharts({
            canvasId: 'areaCanvas',
            type: 'area',
            categories: ['', '', '', '', '', ''],
            animation: false,
            series: [{
                name: 'CPU负载',
                data: [32, 45, 55, 56, 33, 34],
                format: function (val) {
                    // return val.toFixed(2) + '%';
                    return parseInt(val) + '%';
                },
                fontSize:'24rpx'
            }],
            yAxis: {
                // title: '成交金额 (万元)',
                format: function (val) {
                    // return val.toFixed(2);
                    return parseInt(val) + '%';
                },
                min: 0,
                fontSize:'34px',
                fontColor: '#999999',
                gridColor: '#dddddd',
                titleFontColor: '#cccccc'
            },
            xAxis: {
                fontColor: '#7cb5ec',
                gridColor: '#7cb5ec'
            },            
            width: windowWidth,
            height: 200
        });



        
    },


    onUnload:function(){
        clearInterval(timer);
    }
  
})


