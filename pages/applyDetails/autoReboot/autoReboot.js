Page({
  data:{
    time:['天','周','月'],
    timeindex:0,
    week:['周一','周二','周三','周四','周五','周六','周日'],
    weekindex:0,
    day:['1日','2日','3日','4日','5日','6日','7日','8日','9日','10日','11日','12日','13日','14日','15日','16日','17日','18日','19日','20日','21日','22日','23日','24日','25日','26日','27日','28日','29日','30日','31日'],
    dayindex:0,
    hour:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
    hourindex:17,
    second:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'],
    secondindex:30,
    weekShow:'none',
    dayShow:'none',
    isSwitchChecked:false,

    cursecond:'30',
    curhour:'17',
    curday:'*',
    curstar:'*',
    curweek:'*'
  },
  bindTimeChange: function(e){
    this.setData({
      timeindex:e.detail.value
    });
    if(e.detail.value == 0){//选择每天
      this.setData({
        weekShow:'none',
        dayShow:'none',
        curday:'*',
        curweek:'*'
      })
    }else if(e.detail.value == 1){//选择每周
      this.setData({
        weekShow:'inline-block',
        dayShow:'none',
        curday:'*',
        curweek:'1'
      })
    }else if(e.detail.value == 2){//选择每月
      this.setData({
        weekShow:'none',
        dayShow:'inline-block',
        curday:'1',
        curweek:'*'
      })
    }
  },
  bindDayChange: function(e){
    this.setData({
      dayindex:e.detail.value,
      curday:parseInt(e.detail.value)+1,
      curweek:'*'
    })
  },
  bindHourChange: function(e){
    this.setData({
      hourindex:e.detail.value,
      curhour:e.detail.value
    })
  },
  bindSecondChange: function(e){
    this.setData({
      secondindex:e.detail.value,
      cursecond:e.detail.value
    })
  },
  switchTurnChange: function(e){
    var that = this;
    if(e.detail.value){
      this.setData({
        isSwitchChecked:'checked'
      })
    }else{
      wx.showToast({
        icon:'loading',
        title:'保存中...'
      })
      wx.request({
        url:that.data.url + "/cgi-bin/luci/admin/application/autoReboot/task",
        data:{
          wx:that.data.key,
          task:""
        },
        header: {"content-type":"application/json"},
        success: function(res){
          //console.log(res.data);
          if(res.data.code == 0){
            wx.showToast({
              title:'保存成功',
              duration:2000
            });
            that.setData({
              isSwitchChecked:false
            });
            setTimeout(function(){
              wx.switchTab({
                url: '../../apply/apply'
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

    }
  },
  bindWeekChange: function(e){
    this.setData({
      weekindex:e.detail.value,
      curweek:parseInt(e.detail.value)+1
    })
  },
  saveClockChange: function(){
    var that = this;
    var str = that.data.cursecond + ' ' + that.data.curhour + ' ' + that.data.curday + ' ' + that.data.curstar + ' ' + that.data.curweek;
    wx.showToast({
      icon:'loading',
      title:'保存中...'
    })
    wx.request({
      url:that.data.url + "/cgi-bin/luci/admin/application/autoReboot/task",
      data:{
        wx:that.data.key,
        task:str
      },
      header: {"content-type":"application/json"},
      success: function(res){
        if(res.data.code == 0){
          wx.showToast({
            title:'保存成功',
            duration:2000
          });
          setTimeout(function(){
            wx.switchTab({
              url: '../../apply/apply'
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
  //下拉刷新
  onPullDownRefresh(){

    wx.showNavigationBarLoading();//在标题栏中宣誓加载

    var that = this;

        //获取路由信息
        wx.request({
          url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getRebootTask",
          data:{wx:that.data.key},
          header: {"content-type":"application/json"},
          success: function(res){

            if(typeof(res.data) == 'string' && res.data.indexOf('Incorrect password') != -1){
              wx.redirectTo({
                url: '../../login/login'
              });
              return false;
            }

            if(res.data.task != ''){
              var arr = [];
              arr = res.data.task.split(" ");
              that.setData({
                isSwitchChecked:'checked',
                cursecond:arr[0],
                curhour:arr[1],
                curday:arr[2],
                curweek:arr[4],

                secondindex:arr[0],
                hourindex:arr[1]
              });
              if(arr[2] != "*"){
                that.setData({
                  timeindex:2,
                  weekShow:'none',
                  dayShow:'inline-block',
                  curday:arr[2],
                  dayindex:parseInt(arr[2])-1
                })
              }else{
                that.setData({
                  dayShow:'none'
                })
              };
              if(arr[4] != '*'){
                that.setData({
                  timeindex:1,
                  weekShow:'inline-block',
                  dayShow:'none',
                  weekindex:parseInt(arr[4])-1
                })
              }

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
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getRebootTask",
              data:{wx:that.data.key},
              header: {"content-type":"application/json"},
              success: function(res){

                if(typeof(res.data) == 'string' && res.data.indexOf('Incorrect password') != -1){
                  wx.redirectTo({
                    url: '../../login/login'
                  });
                  return false;
                }

                if(res.data.task != ''){
                  var arr = [];
                  arr = res.data.task.split(" ");
                  that.setData({
                    isSwitchChecked:'checked',
                    cursecond:arr[0],
                    curhour:arr[1],
                    curday:arr[2],
                    curweek:arr[4],

                    secondindex:arr[0],
                    hourindex:arr[1]
                  });
                  if(arr[2] != "*"){
                    that.setData({
                      timeindex:2,
                      weekShow:'none',
                      dayShow:'inline-block',
                      curday:arr[2],
                      dayindex:parseInt(arr[2])-1
                    })
                  }else{
                    that.setData({
                      dayShow:'none'
                    })
                  };
                  if(arr[4] != '*'){
                    that.setData({
                      timeindex:1,
                      weekShow:'inline-block',
                      dayShow:'none',
                      weekindex:parseInt(arr[4])-1
                    })
                  }

                }
                
              }
            });

          }
        })
      }
    });
  }
})