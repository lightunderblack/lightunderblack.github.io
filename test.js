  var hasOwnProperty = Object.prototype.hasOwnProperty;

SmoothScroll.prototype = {
constructor: SmoothScroll,
_init: function(config){
var me = this; 
me._config = $.extend({
  //container 滚动条的容器
  //go2Top 返回顶部jQuery对象
  //destination 需滚动位置的jQuery对象
  duration: 500,//动画因子 
  scrollTop: 10
}, config);
me._cacheParam()._bindEventListener();
return me;   
},
    _cacheParam: function(){
      var i,
          me = this,
          config = me._config;
    
      for(i in config){
        if(hasOwnProperty.call(config, i)){
            me['_' + i] = config[i];
            config[i] = null;
            delete config[i];   
        }
      }
    
      return me;
    },
    _bindEventListener: function(){
      var me = this,
          $go2Top = me._go2Top,
          $container = me._container;
    
      me._showOrHideGo2Top();    
      $container.on('scroll.smoothccroll', function(e){
        me._showOrHideGo2Top();
      });
      $go2Top.on('click.smoothccroll', function(e){
        me._smoothScroll();
        return false;
      }); 
    
      return me;   
    },
    _smoothScroll: function(duration){
      var step,
          distance,
          me = this,
          $container = me._container,
          destination = me._destination.offset().top;
    
      duration = duration == null ? me._duration : duration;
      if(duration < 0){
        me._showOrHideGo2Top();
        return;
      }
      distance = destination - $container.scrollTop();
      step = distance / duration * 10;
      me._smoothScrollTime = setTimeout(function(){
        if(!isNaN(parseInt(step, 10))) {
          $container.scrollTop($container.scrollTop() + step);
          me._smoothScroll(duration - 10); 
        }else{
          me._showOrHideGo2Top();
        }   
      }, 10);  
    
      return me;                  
    },
    _showOrHideGo2Top: function(){
      var me = this,
          $go2Top = me._go2Top;
      me._container.scrollTop() > me._scrollTop ? $go2Top.show() : $go2Top.hide();
      return me;
    }
  };
  window.SmoothScroll = SmoothScroll;