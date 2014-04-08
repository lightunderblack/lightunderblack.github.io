---
layout: post
title: 返回顶部按钮的实现
activePage: blogItem
---

返回顶部的快捷按钮在*web*页面中普遍存在，不过有些实现得并不理想，滚动条瞬间滚到页面顶部，过程不平滑而影响用户体验。在此列举实现返回顶部的若干方法，并分析优劣。

#####1. 使用锚点#####

页面顶部元素设置一个**id**值，返回顶部用**a**标签，设置**a**标签的**href**值为刚才的顶部元素**id**值。代码如下：

{%highlight html linenos%}
<div id="container">
  <p>足够使container出现滚动条的内容</p>
</div>
<a href="#container" id="goToTop">返回顶部</a>
{%endhighlight%}

利用浏览器**a**标签定位锚点功能，可以容易实现返回顶部，但滚动条滚动过程中并不平滑。

#####2. 使用*DOM*的*scrollIntoView*方法#####

绑定返回顶部按钮的点击事件，在回调函数中调用页面顶部元素的*scrollIntoView*方法。代码如下：

{%highlight javascript linenos%}
$('#goToTop').on('click', function(e){
  //target为容器顶部元素id
  document.getElementById('target').scrollIntoView();
});
{%endhighlight%}

*scrollIntoView*接受一个参数，为*true*时滚动条将滚动到元素的**bottom**位置，为`false`或不传时滚动条将滚动到元素的**top**位置。

#####3.使用*scrollTo*方法#####

这里使用元素的*scrollTo*方法，并在调用该方法时使用动画，使得滚动条滚动过程平滑。我将次实现封装了组件，代码如下：

{%highlight javascript linenos%}
//SmoothScroll
(function($, window, undefined){
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  function SmoothScroll(config){
    return this._init(config);
  }

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
})(jQuery, this);
{%endhighlight%}

*在线演示*

<iframe src="http://jsfiddle.net/shiny_bender/MwVp5/7/embedded" style="width:100%;height:300px;" frameborder="0" scrolling="no"></iframe>

[*源码下载*]({{site.url}}/downloads/files/smoothscroll.zip)




