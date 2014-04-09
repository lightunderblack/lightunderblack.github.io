---
layout: post
comments: true
title: jQuery源码分析之ready方法
activePage: blogItem
tags: ["JavaScript", "jQuery"]
---

*ready*是在页面的*DOM*元素加载完成后执行回调函数（确切地说应该是回调函数列表）的方法，*ready*方法可多次被调用，传入的回调函数（单个或多个）将逐一放入回调函数列表*readyList*中，当*ready*事件（当然*DOM*事件中是没有所谓的*ready*事件的，这里只是为了解释自己起的）触发后，将逐一执行*readyList*中的回调函数

{%highlight javascript linenos%}
var //......代码省略
       //事件回调函数列表对象
        //为了便于解释暂且称之为ready事件回调函数列表对象，
        //当然DOM事件模型是没有所谓的ready事件的哦。
        readyList
        //......代码省略
 ;
jQuery.fn = jQuery.prototype = {
    //......代码省略
    ready: function( fn ) {
        // Attach the listeners
        // 绑定ready事件监听器，DOM标准里是无所谓ready事件，
        // 这里只是自己起的为了方便分析代码
        jQuery.bindReady();
        // Add the callback
        // 添加回调函数到回调函数列表中
        readyList.add( fn );
        return this;
    },
    //......代码省略
};
jQuery.extend({
    //......代码省略
    // Is the DOM ready to be used? Set to true once it occurs.
    // 标识页面DOM元素是否已加载完毕
    isReady: false,
    // A counter to track how many items to wait for before
    // the ready event fires. See #6781
    readyWait: 1,
    // Hold (or release) the ready event
    holdReady: function( hold ) {
        if ( hold ) {
            jQuery.readyWait++;
        } else {
            jQuery.ready( true );
        }
    },
    // Handle when the DOM is ready
    ready: function( wait ) {
        // Either a released hold or an DOMready/load event and not yet ready
        if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if ( !document.body ) {
                return setTimeout( jQuery.ready, 1 );
            }
            // Remember that the DOM is ready
            jQuery.isReady = true;
            // If a normal DOM Ready event fired, decrement, and wait if need be
            if ( wait !== true && --jQuery.readyWait > 0 ) {
                return;
            }
            // If there are functions bound, to execute
            readyList.fireWith( document, [ jQuery ] );
            // Trigger any bound ready events
            if ( jQuery.fn.trigger ) {
                jQuery( document ).trigger( "ready" ).off( "ready" );
            }
        }
    },
    bindReady: function() {
        //判断ready事件回调函数列表是否已初始化
        if ( readyList ) {
            //如是则返回
            return;
        }
        //创建ready事件回调函数列表对象
        //这里调用jQuery.Callbacks方法，
        //Callbacks的作用在上篇已说过，不再赘述
        readyList = jQuery.Callbacks( "once memory" );
        // Catch cases where $(document).ready() is called after the
        // browser event has already occurred.
        // 判断页面DOM元素是否已加载完毕
        if ( document.readyState === "complete" ) {
            // Handle it asynchronously to allow scripts the opportunity to delay ready
            // 如是则异步执行jQuery.ready方法
            // 调用setTimeout目的是异步执行jQuery.ready方法
            return setTimeout( jQuery.ready, 1 );
        }
        // Mozilla, Opera and webkit nightlies currently support this event
        // 支持W3C DOM标准的浏览器则用addEventListener绑定
        if ( document.addEventListener ) {
            // Use the handy event callback
            // 支持W3C DOM标准的浏览器一般是支持DOMContentLoaded事件
            // DOMContentLoaded是页面的DOM元素(仅仅只是DOM元素)全部加载完毕后触发
            document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
            // A fallback to window.onload, that will always work
            // 当然有些所谓支持W3C DOM标准的浏览器可能不支持DOMContentLoaded事件，
            // 为了不被坑爹，在此得留一手，为确保万无一失，再绑定window的load事件，
            // 因为window的load事件是所有浏览器都支持的，页面载入完成后是肯定会触发。
            // 在这里说明一下DOMContentLoaded和load事件的区别：
            // DOMContentLoaded事件是只要页面DOM元素全部加载完毕即触发
            // window的load事件是页面的所有DOM元素以及全部资源(如图片/flash)加载完毕即触发
            // 理论上，DOMContentLoaded要比window的load事件先触发
            window.addEventListener( "load", jQuery.ready, false );
        } 
        // If IE event model is used
        // 针对IE浏览器用attachEvent绑定事件
        // 题外话：IE遵循自己的一套DOM事件模型，与W3C DOM事件模型有很大不同
        // 故需特殊对待
        else if ( document.attachEvent ) {
            // ensure firing before onload,
            // maybe late but safe also for iframes
            // IE不支持DOMContentLoaded事件，但可使用onreadystatechange事件替代之
            document.attachEvent( "onreadystatechange", DOMContentLoaded );
            // A fallback to window.onload, that will always work
            // 为了避免被onreadystatechange事件坑爹，需留一手，
            // 绑定window的onload事件，这是页面载入完成后一定会触发的。
            window.attachEvent( "onload", jQuery.ready );
            // If IE and not a frame
            // continually check to see if the document is ready
            var toplevel = false;
            try {
                //使用window.frameElement判断是否是顶级页面
                toplevel = window.frameElement == null;
            } catch(e) {
                //抛异常，则当做不是顶级页面处理
            }
            //document.documentElement.doScroll
            //IE独有方法，模拟用户滚动条点击；
            //用此法判断IE下的DOM元素是否加载完成
            if ( document.documentElement.doScroll && toplevel ) {
                doScrollCheck();
            }
        }
    }
//......代码省略
});
//.....代码省略
// The DOM ready check for Internet Explorer
// 检测IE浏览器下的DOM元素是否加载完成
function doScrollCheck() {
    //判断页面是否已加载完毕
    //如是则无需再执行下面的检测代码
    if ( jQuery.isReady ) {
        return;
    }
    // 执行document.documentElement.doScroll方法
    // 若抛异常，表示IE的DOM元素未加载完毕，则继续异步执行doScrollCheck检测
    // 若不抛异常，表示IE的DOM元素加载完成，则将执行jQuery.ready方法
    try {
        // If IE is used, use the trick by Diego Perini
        // http://javascript.nwbox.com/IEContentLoaded/
        document.documentElement.doScroll("left");
    } catch(e) {
        setTimeout( doScrollCheck, 1 );
        return;
    }
    // and execute any waiting functions
    // IE的DOM元素加载完成调用jQuery.ready方法
    jQuery.ready();
}
//.....代码省略
// Cleanup functions for the document ready method
//支持W3C DOM标准浏览器
if ( document.addEventListener ) {
    //DOMContentLoaded事件回调函数实现
　　DOMContentLoaded = function() {
       //移除DOMContentLoaded事件绑定
　　　　document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
　　　　jQuery.ready();
　　};
} 
//支持微软DOM标准浏览器
else if ( document.attachEvent ) {
    //onreadystatechange事件回调函数实现
　　DOMContentLoaded = function() {
　　　　// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
　　　　if ( document.readyState === "complete" ) {
            //移除onreadystatechange事件绑定
　　　　　　　document.detachEvent( "onreadystatechange", DOMContentLoaded );
　　　　　　  jQuery.ready();
　　　　}
　　};
}
//.....代码省略
{%endhighlight%}

