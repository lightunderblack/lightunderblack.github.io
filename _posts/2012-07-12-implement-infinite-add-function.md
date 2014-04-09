---
layout: post
comments: true
title: javascript实现add方法无限调用
activePage: blogItem
tags: ["JavaScript"]
---

*javascript*实现*add*方法无限调用

{%highlight javascript linenos%}
function add(){
    var slice = Array.prototype.slice,
          args = slice.call(arguments),
          add = add;
          add = function(){
                args = args.concat(slice.call(arguments));
                return add;
          };
          add.toString = function(){
                for(var result = 0, i = 0, length = args.length; i < length; i++){
                        result += args[i];
                }
                return result;
         };
        return add;
}
alert(add(1)(2)(3)(4));
alert(add(1,2,3,4,5)(6,7)(8)(9));
{%endhighlight%}