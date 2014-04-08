---
layout: post
title: jQuery源码分析之jQuery的定义
activePage: blogItem
---

*jQuery*源码分析之*jQuery*的定义

{%highlight javascript linenos%}
/*注:涉及到的知识点有作用域/Module Pattern/构造函数/this/prototype。*(1)JavaScript只有函数作用域。为防止全局变量污染，采用匿名函数包含块的方式生成局部作用域，在匿名函数块后面加入括号()就可直接调用该匿名**函数，这样可以在js文件载入时就可执行。*(2)该匿名函数有两个形参window和undefined，而只有一个实参window。传入全局变量window作为参数的好处是可将全局变量window变成匿名函数的*局部变量，减少匿名函数访问window的时间。由于undefined的值在一些浏览器中可能被修改，覆盖掉浏览器设置的默认值。所以第二实参未传入，以确**保第二个参数的值为浏览器默认设置的undefined值。*(3)全局变量的导入*(4)此模式即为Module Pattern
*/
(function(window, undefined){
    //此处也使用匿名函数块封装逻辑代码。
    var jQuery = (function(){
       /*构造函数jQuery显示返回值而非隐身返回值的好处：构造函数在new关键字调用的情况下，
　　　　　*this将默认绑定到新对象上并返回该新对象(如果构造函数未显示返回值的话)。倘若漏写new直接调用构造函数，
       　*则函数中的this将绑定到全局对象window上而非新对象上，所有定义为this的属性将变成全局属性，造成全局变量污染，
       　*如果构造函数未显示返回值，则将返回undefined。所以在定义供外部调用的构造函数时，最好显示返回值，如此一来，
       　*无论在调用构造函数时是否使用new关键字，都将返回新对象。
　　　　*/
　　　　var jQuery = function( selector, context ) {
          //init为初始化方法，此处将它作为构造函数，使用new关键字调用将会返回新的jQuery对象，新对象的原型指向
          //jQuery.fn.init.prototype。后面的代码:jQuery.fn.init.prototype = jQuery.fn;
          //而jQuery.fn = jQuery.prototype;所以jQuery.fn.init.prototype = jQuery.prototype;也就是说新对象的原型
          //指向jQuery.prototype。这其实是在绕了个大圈。为什么要绕个大圈呢？
          //这就拜new jQuery.fn.init( selector, context, rootjQuery );这行代码所赐。具体原因自己去想吧，不细说了。
　　　　　　return new jQuery.fn.init( selector, context, rootjQuery );
      };
      //定义jQuery对象的原型
      jQuery.fn = jQuery.prototype = function(){
           constructor: jQuery,
           init: function( selector, context, rootjQuery ) {
              //......
           }
           //......
      };
      jQuery.fn.init.prototype = jQuery.fn;
      //定义extend方法，方便扩展。jQuery.extend是在jQuery上扩展，jQuery.fn.extend是在jQuery的原型对象上扩展。
      jQuery.extend = jQuery.fn.extend = function(){
           //......
      };
      //......
      return jQuery;
    })();
    //局部变量导出
    //因为jQuery是在匿名函数中，属于局部变量，外部不能访问，所以通过下面代码将jQuery导出作为全局变量供外部调用。
    window.jQuery = window.$ = jQuery;
})(window);
{%endhighlight%}