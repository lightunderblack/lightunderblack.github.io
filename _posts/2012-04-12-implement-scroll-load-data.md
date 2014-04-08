---
layout: post
title: 实现滚动条触底加载数据
activePage: blogItem
---

实现滚动条触底加载数据

###1、背景###

当用户信息较多，页面在展示数据时为减少加载时间，传统方法是采用分页显示，用户查看上一页数据或下一页数据时，需要来回切换，影响体验。现各大微博网站使用新方法弥补分页的不足:如数据过多，页面无法全部展示则先展示部分数据并显示滚动条，用户滑动滚动条触底时再加载部分新数据，而页面之前的数据仍将保留。

###2、功能###

模拟实现各大微博网站所采用的当滚动条触底加载数据的技术。

###3、描述###

* v2.0版本

	`window.ScrollLoadData(id,callBack)`

	第一个参数必须:*id*为需要触发*scroll*事件的元素*id*。当传入的参数是*window*时,则*scroll*事件绑定在*window*上

	第二个参数可选:*scroll*事件触发的回调函数,需用户自行实现。

* <del>v1.0版本</del>

	`window.scrollLoadData(id/window,callBack)`

	第一个参数必须:*id*为需要触发*scroll*事件的元素*id*。当传入的参数是*window*时,则*scroll*事件绑定在*window*上

	第二个参数可选:*scroll*事件触发的回调函数,需用户自行实现。


###4、使用###

* v2.0版：约定俗成:凡是带有\_前缀的方法\/属性无特殊说明都为私有的，不能提供给外部调用。未带有\_前缀的方法/属性供外部调用。

######将*scroll*事件绑定到*id*为*test*的元素上######

{%highlight javascript%}
var sld = new window.ScrollLoadData('test',function(){alert('execute')});
sld.scrollLoadData();
{%endhighlight%}

######将*scroll*事件绑定到*window*上######

{%highlight javascript%}
var sld = new window.ScrollLoadData('window',function(){alert('execute')});
sld.scrollLoadData();
{%endhighlight%}

######调用*setIsScrollLoaded*设置私有属性*_isScrollLoaded*的值######

在向后台发送加载数据请求之前需调用*setIsScrollLoaded*方法将*_isScrollLoaded*设置为*false*;
当后台响应请求之后需调用*setIsScrollLoaded*方法将*_isScrollLoaded*设置为*true*,无论这个响应请求是成功还是失败的;

* <del>v1.0版：</del>

######将*scroll*事件绑定到*id*为*test*的元素上######

`window.scrollLoadData('test',function(){alert('execute')});`

######将*scroll*事件绑定到*window*上######

`window.scrollLoadData(window,function(){alert('execute')});`

######调用*setIsScrollLoaded*设置私有属性*_isScrollLoaded*######

在向后台发送加载数据请求之前需调用*setIsScrollLoaded*方法将*_isScrollLoaded*设置为*false*;当后台响应请求之后需调用*setIsScrollLoaded*方法将*_isScrollLoaded*设置为*true*,无论这个响应请求是成功还是失败的; 

###5、版本###

* <版本*V2.0*使用面向对象封装成*ScrollLoadData*类,实现了多个元素分别绑定.每绑定一个元素时都需重新*new*一个*ScrollLoadData*对象.
* <del>版本*V1.1*添加私有属性*_isScrollLoaded*,用于判断后台是否响应请求并返回结果.该控件只能绑定单个元素.后期版本将实现多元素绑定.</del>
* <del>版本*V1.0*主要实现滚动条触底事件的实现,但还未判断当滚动条触底时向后台发送请求后台响应是否完成的,后期版本将实现.</del>

###6、源码###

{%highlight javascript%}
(function(global){
    global.ScrollLoadData = function(id,callBack){
        this._id = id;//需绑定scroll事件的元素id,可传入window表示将事件绑定到window上
        this._callBack = callBack;//scroll的回调函数,需用户自行实现
        this._isScrollLoaded = true;//标识数据是否加载完成
    };
    global.ScrollLoadData.prototype = {
        constructor:global.ScrollLoadData,
        scrollLoadData:function(){
            var dom,that=this;
            if(this._id === window){
                dom = window;
            }
            else{
                dom = document.getElementById(this._id)
            }
            if(!dom){
                return;
            }
            if(document.attachEvent){
                dom.attachEvent('onscroll',function(e){
                    that._scrollHandler(e);
                });
            }
            else if(document.addEventListener){
                dom.addEventListener('scroll',function(e){
                    that._scrollHandler(e);
                },false);
            }
            else{
                var oldOnScroll = dom.onscroll;
                dom.onscroll = function(e){
                    that._scrollHandler(e);
                    if(oldOnScroll){oldOnScroll();}
                };
            }
        },
        getIsScrollLoaded:function(){
            return this._isScrollLoaded;
        },
        setIsScrollLoaded:function(value){
            this._isScrollLoaded = value;
        },
        _scrollHandler:function(e){
            e = e || window.event;
            if(!e){return;}
            var target = e.srcElement || e.target;
            var isExceed = false;
            if(this._id === window){
                isExceed = (document.body.clientHeight + document.body.scrollTop) >= document.body.scrollHeight;
            }
            else{
                isExceed = (this._getHeight(target) + this._getScrollTop(target)) >= this._getScrollHeight(target);
            }
            if(this._callBack && isExceed && this._isScrollLoaded){
                this._callBack.apply(global,[e,target]);
            }
        },
        _getHeight:function(target){
            var value = (this._getStyleValue(target, 'height')).trim();
            return value ? parseInt(value) : 0;
        },
        _getScrollTop:function(target){
            return target.scrollTop;
        },
        _getScrollHeight:function(target){
            return target.scrollHeight;
        },
        _getStyleValue:function(dom, attribute){
            if(!dom){
                return "";
            }
            var value = dom.style.attribute;
            if(value === undefined || value === null || value.trim() === ''){
                value = dom.currentStyle ? 
                            dom.currentStyle[attribute] : document.defaultView.getComputedStyle(dom,false)[attribute];
            }
            return value;
        }
    };
    String.prototype.trim = String.prototype.trim || function(){
        return this.replace(/^\s*(.*)\s*$/g,'$1');
    };
})(this);
{%endhighlight%}

[源码下载](/downloads/files/scrollLoadData.js)

	
	


