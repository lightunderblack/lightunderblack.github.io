---
layout: post
title: execScript与eval区别
activePage: blogItem
---

详细分析*execScript*与*eval*异同。

* 相同点
	1. *execScript*与*eval*接收一个字符串，若是表达式*expression*，则执行时求得该表达式的值并返回；若是一个或多个语句*statements*，则执行时运行这些语句。
* 不同点
	1. *execScript*是*IE*浏览器独有；*eval*则是所有浏览器都支持。
	2. *execScript*无论是在*global*或*local*作用域内被调用，它所接受到的表达式*expression*或语句*statements*字符串都将在全局作用域*global*内执行；*eval*则是在它被调用时所在的作用域内运行它所接受到的表达式*expression*或语句*statements*字符串。
	
#####先看*eval*例子：#####

{%highlight javascript linenos%}
eval('var global = "global";');//全局作用域内调用eval,则var global = "global";是在全局作用域内被运行的，最终是得到一个global全局变量
(function(){
	//这个匿名函数块内生成了一个局部作用域
	eval('var local = "local";');//局部作用域内调用eval，则var local = "local";是在局部作用域内被运行的，最终是得到一个local局部变量
	console.log(local);//输出local
	console.log(global);//输出global,因为它是全局变量
})();
console.log(global);//输出global
console.log(local);//报错,提示local为声明,因为local是局部变量,外部无法访问
{%endhighlight%}

#####再看*execScript*例子：#####

{%highlight javascript linenos%}
//注意，以下代码必须在IE浏览器下运行
execScript('var global = "global";');//这里声明并初始化了一个global全局变量
(function(){
    //这个匿名函数块内生成了一个局部作用域
    execScript('var local = "local";');//这里其实还是声明并初始化了一个local的全局变量,不要误认为local是一个局部变量哦。
    alert(local);//输出local
    alert(global);//输出global
})();
alert(local);//输出local
alert(global);//输出global
{%endhighlight%}

#####如何在不支持*execScript*浏览器下实现在全局作用内执行字符串？#####

以*jQuery*源码为例：

{%highlight javascript linenos%}
function globalEval( data ) {
    if ( data ) {
    　　// We use execScript on Internet Explorer
    　　// We use an anonymous function so that context is window
    　　// rather than jQuery in Firefox
    　　( window.execScript || function( data ) {
        　　window[ "eval" ].call( window, data );
    　　} )( data );
    }
}
{%endhighlight%}
 