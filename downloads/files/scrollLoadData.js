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