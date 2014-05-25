---
layout: post
comments: true
title: HTML5+CSS3实现抽屉菜单
activePage: blogItem
tags: ["JavaScript", "HTML5", "CSS3"]
---

抽屉菜单在手机*native*应用中很常见。比如下图酷狗手机版界面。左侧为操作菜单，默认不显示。需要时向右滑动界面，操作菜单将从左侧缓缓显示；不需要时向左滑动界面，操作菜单将隐藏在左侧边。操作菜单这种缓入缓出的用户体验非常不错。这里讲采用*css3*实现上述抽屉菜单效果。

<p class="image-container"><img src="/images/drawer_1.jpg" alt="抽屉菜单示例图" /></p>
<!--more-->

*(以下实例请在基于webkit手机浏览器下访问)*

#####*html*代码：#####

{%highlight javascript linenos%}
<div id="container" class="container">
	<div class="main"></div><!--主界面-->
	<div class="nav"></div><!--菜单-->
</div>
{%endhighlight%}

#####*css*代码：#####

<script src="https://gist.github.com/lightunderblack/124f027fd484729d2dde.js"></script>

#####组件Drawer代码(依赖*Zepto.js*)：#####

{%highlight javascript linenos%}
(function($, window, undefined){
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function Drawer(config){
		return this._init(config);
	}
	Drawer.prototype = {
		constructor: Drawer,
		_init: function(config){
			var me = this;
			me._config = $.extend({
				//container
				//nav
				//main
				dir: 'right',
				transition: '-webkit-transform .4s ease-in-out'
			}, config);
			me._cacheParam()._bindEventListener();
			return me;
		},
		_cacheParam: function(){
			var me = this, 
				config = me._config;
			for(var i in config){
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
				$nav = me._nav,
				$main = me._main,
				$container = me._container,
				direction = me._dir,
				position = {x : 0, y : 0},
				navWidth = $nav.width(),
				transition = me._transition;
			$nav.attr('data-'+direction, '0');
			$container.on('touchstart', function(e){
				var target = e.touches.item(0);
				$main.css('-webkit-transition', 'none');
				position.x = target.clientX;
				position.y = target.clientY;
				return false;						
			}).on('touchmove', function(e){
				var target = e.touches.item(0),
					different = target.clientX - position.x,
					distant = parseInt($main.attr('data-'+direction)||0, 10);
				//滑动距离太短,则不处理
				if(Math.abs(different) >= 5){
					distant += different;
					if(direction === 'left'){
						//左侧菜单栏
						if(distant <= 0){
						  distant = 0;
						}
						if(distant >= navWidth){
						  distant = navWidth; 
						}							
					}else{
						//右侧菜单栏
						if(distant >= 0){
						  distant = 0;
						}
						if(distant <= -navWidth){
						  distant = -navWidth; 
						}
					}
					$main
					  .attr('data-'+direction, distant)
					  .css('-webkit-transform', 'translate(' + distant + 'px,0)');
				}					
				position.x = target.clientX;
				position.y = target.clientY;				
				return false;
			}).on('touchend', function(e){
				var distant = parseInt($main.attr('data-'+direction), 10);
				if(direction === 'left'){
					distant = distant > navWidth/2 ? navWidth : 0;
				}else{
					distant = distant > -navWidth/2 ? 0 : -navWidth;
				}
				$main.css({
					'-webkit-transform': 'translate(' + distant + 'px,0)',
					'-webkit-transition': transition
				}).attr('data-'+direction, distant);
				return false;
			});
			return me;	
		}
	};	
	window.Drawer = Drawer;
})(Zepto, this);
{%endhighlight%}

#####初始化代码：#####

{%highlight javascript linenos%}
$(function(){
  var $container = $('#container');
  new Drawer({
    dir: 'right',//表示菜单位于右侧,默认为左侧
    container: $container,
    nav: $container.children('.nav'),
    main: $container.children('.main')			
  });
});
{%endhighlight%}

[*源码下载*](/downloads/files/drawer.zip)

