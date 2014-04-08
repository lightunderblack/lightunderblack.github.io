---
layout: post
title: JavaScript之Publish/Subscribe模式
activePage: blogItem
---

发布/订阅，是一种由两个部分构成:发布者和订阅者的消息传递模式。发布者将消息发布到特定频道，而订阅者接听频道，当频道上有消息发布时将接收到通知。

实现Pub/Sub模式代码：

{%highlight javascript%}
var PubSub = {
	//订阅
	subscribe : function(ev,callback){
	    this._callback || (this._callback = {});
	    (this._callback[ev] || (this._callback[ev] = [])).push(callback);
	    return this;
	},
	//取消订阅
	unsubscribe : function(ev){
	    if(!this._callback || !this._callback[ev]){
	        return this;
	    }
	    this._callback[ev] = null;
	    delete this._callback[ev];
	    return this;
	},
	 //发布
	publish : function(){
	    var callback, list, i, length, args = [].slice.call(arguments,0), ev = args.shift();
	    if(!(callback = this._callback) || !(list = this._callback[ev])){
	        return this;
	    }
	    for(i = 0, length = list.length; i < length; i++){
	          list[i].apply(this, args);
	    }
	    return this;
	}
};
PubSub.subscribe('wen',function(){alert('Wen!!!');}).publish('wen').unsubscribe('wen').publish('wen');
{%endhighlight%}