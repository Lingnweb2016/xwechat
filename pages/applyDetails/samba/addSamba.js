Page({
  data:{
    mountList:[],
    pathindex:0,
    curname:'',
    curreadonly:'no',
    curguestok:'no',
    curdescription:''
  },
  nameInp: function(e){
    this.setData({
      curname: e.detail.value
    })
  },
  bindPathChange: function(e){
    var that = this;
    that.setData({
      pathindex:e.detail.value,
      curpath:that.data.mountList[e.detail.value]
    })
  },
  switchReadOnly: function(e){
    if(e.detail.value){
      this.setData({
        curreadonly:'yes'
      })
    }else{
      this.setData({
        curreadonly:'no'
      })
    }
  },
  switchGuestOk: function(e){
    if(e.detail.value){
      this.setData({
        curguestok:'yes'
      })
    }else{
      this.setData({
        curguestok:'no'
      })
    }
  },
  descriptionInp: function(e){
    this.setData({
      curdescription:e.detail.value
    })
  },
  backSamba: function(){
    wx.navigateBack({
      delta: 1
    })
  },
  saveAddChange: function(){
    var that = this;
    if(that.data.curname == ''){
      wx.showToast({
        title:'输入不能为空',
        duration:2000
      })
      return false;
    }
    wx.showToast({
      icon:'loading',
      title:'保存中...'
    })

    wx.request({
      url:that.data.url + "/cgi-bin/luci/admin/application/setSambaShare",
      data:{
        wx:that.data.key,
        path:that.data.curpath,
        name:that.data.curname,
        readOnly:that.data.curreadonly,
        guest:that.data.curguestok,
        description:that.data.curdescription
      },
      header: {"content-type":"application/json"},
      success: function(res){
        if(res.data.code == 0){
          wx.showToast({
            title:'添加成功',
            duration:2000
          });
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            })
          },2000)

        }else if(res.data.code == 2){
          wx.showToast({
            title:'名称不能有重复',
            duration:2000
          });
        }else{
          wx.showToast({
            title:'添加失败',
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
              url:that.data.url + "/cgi-bin/luci/wechat/miniProgram/getSambaShare",
              data:{wx:that.data.key},
              header: {"content-type":"application/json"},
              success: function(res){

                if(typeof(res.data) == 'string' && res.data.indexOf('Incorrect password') != -1){
                  wx.redirectTo({
                    url: '../../login/login'
                  });
                  return false;
                }
                
                var mountarr = [];
                for(var i in res.data.mount){
                  mountarr.push(res.data.mount[i].mountpoint);
                }
                that.setData({
                  mountList:mountarr,
                  curpath:mountarr[0]
                });
              }
            });

          }
        })
      }
    });
  }
})