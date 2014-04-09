---
layout: post
comments: true
title: jQuery源码分析之extend方法
activePage: blogItem
tags: ["JavaScript", "jQuery"]
---

解析*jQuery*的*extend*方法之实现

{%highlight javascript linenos%}
/*
* 实现将源对象（source）复制到目标对象（target）
* 复制有深拷贝和浅拷贝(deep)
* this表示调用extend方法的对象,即方法的调用对象本身
* 以下为调用extend传入不同参数所表示的含义
* (1)extend(obj)-->deep=false;target=this;source=arguments[0];
* (2)extend(boolean,obj)-->deep=arguments[0];target=this;source=arguments[1];
* (3)extend(obj1,...objn)-->deep=false;target=arguments[0];source=[arguments[1],...arguments[n-1]](n>=2);
* (4)extend(boolean,obj1,obj2......)-->deep=arguments[0],target=arguments[1];source=[arguments[2],...arguments[n-1]](n>=3);
*/
jQuery.extend = jQuery.fn.extend = function() {
	  var   options, name, src, copy, copyIsArray, clone,
	        target = arguments[0] || {},
	        i = 1,
	        length = arguments.length,
	        deep = false;
	 　　　　// Handle a deep copy situation
	 　　　　//第一个参数是boolean类型则标识是否执行深拷贝
	        if ( typeof target === "boolean" ) {
	            deep = target;
	            target = arguments[1] || {};
	            // skip the boolean and the target
	            i = 2;
	        }
	 　　　　// Handle case when target is a string or something (possible in deep copy)
	 　　　　// 目标对象类型必须是对象（包含数组）或函数（函数也是对象，可以有属性和方法）
	 　　　　// 如果不是则将目标对象重置为空对象
	        if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
	            target = {};
	        }
	 　　　　// extend jQuery itself if only one argument is passed
	 　　　　// 目标对象为调用对象本身，只有(1)/(2)两种情况
	        if ( length === i ) {
	            target = this;
	            --i;
	        }
	        for ( ; i < length; i++ ) {
	    　　 　　// Only deal with non-null/undefined values
	   　　　　 // 非null/undefined值才处理
	            if ( (options = arguments[ i ]) != null ) {
	      　　　　　　// Extend the base object
	                for ( name in options ) {
	                    src = target[ name ];
	                    copy = options[ name ];
	        　　　　　　　// Prevent never-ending loop
	                    // 若目标对象为源对象本身，则跳过循环
	                    if ( target === copy ) {
	                        continue;
	                    }
	        　　　　　　  // Recurse if we're merging plain objects or arrays
	                    if ( deep && copy && ( jQuery.isPlainObject(copy) 
	　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　|| (copyIsArray = jQuery.isArray(copy)) ) ) {
	                        // 深拷贝。当源对象为普通对象(普通对象即Object实例)或数组对象时。
	                        if ( copyIsArray ) {
	                           copyIsArray = false;
	            　　　　　　　　　//源对象为数组，目标对象非数组，则目标对象重置为空数组
	                           clone = src && jQuery.isArray(src) ? src : [];
	                        } else {
	            　　　　　　　　　　//源对象为普通对象，目标对象非普通对象，则目标对象重置为空对象
	                            clone = src && jQuery.isPlainObject(src) ? src : {};
	                        }
	          　　　　　　　　 // Never move original objects, clone them
	                        // 递归调用extend，进行深拷贝
	                        target[ name ] = jQuery.extend( deep, clone, copy );
	                    } 
	        　　　　　　　// Don't bring in undefined values
	        　　　　　　 // 源对象为undefined则不拷贝
	                    else if ( copy !== undefined ) {
	          　　　　　　　　// 浅拷贝
	                        target[ name ] = copy;
	                    }
	                }
	        }
	    }
	　　// Return the modified object
	return target;
};
{%endhighlight%}