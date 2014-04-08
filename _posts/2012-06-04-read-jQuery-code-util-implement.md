---
layout: post
title: jQuery源码分析之jQuery工具方法
activePage: blogItem
---

分析*jQuery*工具方法，学习高手编写代码技巧。其中*jQuery.type*、*jQuery.map*实现独特。

{%highlight javascript linenos%}
//...... 省略代码
var  　　//...... 省略代码
        trimLeft = /^\s+/,
        trimRight = /\s+$/,
    　　//...... 省略代码
    　　//_jQuery/_$分别保存全局变量jQuery/$，以防命名冲突
        _jQuery = window.jQuery,
        _$ = window.$,
    　　//...... 省略代码
    　　//缓存常用对象的方法为局部变量，提高访问效率
        toString = Object.prototype.toString,
        hasOwn = Object.prototype.hasOwnProperty,
        push = Array.prototype.push,
        slice = Array.prototype.slice,
        trim = String.prototype.trim,
        indexOf = Array.prototype.indexOf,
        class2type = {};
//...... 省略代码
jQuery.extend({
        　　　//解决命名冲突，将原先_$/_jQuery重新赋值给全局变量$/jQuery，并返回jQuery的本地实现。
        　　　//调用该方法后，外部不能通过$/jQuery名称访问jQuery的本地实现，只能用该函数返回值进行访问。
        　　　//此方法的妙处在于命名冲突时，可将返回值赋值给外部的变量，再继续访问jQuery的本地实现。
           　noConflict: function( deep ) {
                    if ( window.$ === jQuery ) {
                        window.$ = _$;
                    }
                    if ( deep && window.jQuery === jQuery ) {
                        window.jQuery = _jQuery;
                    }
                    return jQuery;
           　},
       　　//获取obj的数据类型
       　　//检查对象数据类型可用typeof操作符，但typeof得到的类型值不靠谱，比如Date/RegExp对象的结果为object，而不是date/regExp。
       　　//这里是调用toString(Object.prototype.toString)获取对象的类型信息，这样较为妥当。也是建议的写法。
       　　//Date对象，调用toString方法后返回字符串[object Date]；
       　　//RegExp对象，调用toString方法后返回字符串[object RegExp]。
       　　//变量class2type存储的key值为toString返回的字符串值(比如[object Function])，value值为类型名称(比如function)。
       　　//可通过class2type[toString.call(obj)]获取对象obj的类型。
            type: function( obj ) {
                    return obj == null ? String( obj ) : class2type[ toString.call(obj) ] || "object";
            },
            isFunction: function( obj ) {
                    return jQuery.type(obj) === "function";
            },
            //检测浏览器是否已实现Array.isArray，如是则无需再次实现。
            isArray: Array.isArray || function( obj ) {
                return jQuery.type(obj) === "array";
            },
            isWindow: function( obj ) {
                return obj && typeof obj === "object" && "setInterval" in obj;
            },
            isNumeric: function( obj ) {
                return !isNaN( parseFloat(obj) ) && isFinite( obj );
            },
       　　　//判断是否普通对象。以下为普通对象
       　　　//var obj = new Object();obj.XXX = XXXX;
       　　　//var obj = {XXX:XXXX};
            isPlainObject: function( obj ) {
         　　//非普通对象
         　　//值为''/0/false/null/undefined
         　　//非Object类型数据(RegExp,Date,Array,Function对象不属于Object类型的哦)
         　　//DOM对象(obj.nodeType来判断是否为DOM对象比较勉强，如果普通对象刚好有nodeType属性，那就杯具)
         　　//window对象
                if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
                        return false;
                }
                try {
              　　　　　　//自定义的数据类型生成的对象为非普通对象
              　　　　　　//所谓自定义数据类型即是构造函数的原型属性的值非指向Object.prototype
                        if ( obj.constructor && !hasOwn.call(obj, "constructor") 
                                && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                                return false;
                        }
                } catch ( e ) {
              　　　　　　//某些浏览器的内置对象调用hasOwn方法可能抛异常，做非普通对象处理
                        return false;
                }
         　　　　//for...in...会检索obj的原型链。该语句执行完后，
         　　　　//若key=undefined表示obj为空对象(obj={}或obj=new Object())，则obj必是普通对象；
         　　　　//若key值为仍属于obj的本地属性(ownProperty)而不是obj原型对象的属性，则obj必是普通对象。
                var key;
                for ( key in obj ) {}
                return key === undefined || hasOwn.call( obj, key );
            },
       　　　//object对象遍历执行callback
            each: function( object, callback, args ) {
                var name, i = 0,
         　　　　　　 //有length属性则将object当做数组处理(Arugments/Array等，String对象也有length属性)
                　　length = object.length,
         　　　　　　 //无length属性或为函数类型对象则将object当做对象处理
                　　isObj = length === undefined || jQuery.isFunction( object );
                if ( args ) {
                        if ( isObj ) {
                　　　　　　　//object为对象时则使用for...in...遍历各属性
                            for ( name in object ) {
                                    if ( callback.apply(object[ name ], args)===false ) {
                                        break;
                                    }
                            }
                        } else {
                 　　　　　　 //object为数组时则使用for遍历各元素
                            for ( ; i < length; ) {
                                    if ( callback.apply(object[ i++ ], args)===false ) {
                                        break;
                                    }
                            }
                        }
                } else {
                        if ( isObj ) {
                            for ( name in object ) {
                    　　　　　　　　　//未传args时，则将object对象的属性及属性值作为参数传入
                                    if ( callback.call(object[name], name, object[ name ])===false ) {
                                        break;
                                    }
                            }
                        } else {
                            for ( ; i < length; ) {
                    　　　　　　　　　 //未传args时，则将object数组的下标及元素值作为参数传入
                                    if ( callback.call(object[ i ], i, object[ i++ ])===false ) {
                                        break;
                                    }
                            }
                        }
                }
                return object;
            },
       　　  //去除开始结尾处空格
            //检测浏览器是否已实现trim函数，如是则无需再重新实现
            trim: trim ?
                function( text ) {
                    return text == null ?"" :trim.call( text );
                } :
                function( text ) {
                    return text==null?"":text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
                },
            makeArray: function( array, results ) {
                var ret = results || [];
                if ( array != null ) {
                    var type = jQuery.type( array );
                    if ( array.length == null || type === "string" 
                        || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
             　　　　　　 //非数组Array或非类数组(Arguments)时，则放入数组
                        push.call( ret, array );
                    } else {
             　　　　　　 //数组Array或类数组(Arguments)时，则合并数组
                        jQuery.merge( ret, array );
                    }
                }
                return ret;
            },
       　　　//获取数组array元素elem的下标，i为检索的开始下标值，默认为零。
            inArray: function( elem, array, i ) {
                var len;
                if ( array ) {
            　　　　 //检测indexOf方法浏览器是否已实现，如是则直接调用返回结果
                    if ( indexOf ) {
                        return indexOf.call( array, elem, i );
                    }
                    len = array.length;
                    i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;
                    for ( ; i < len; i++ ) {
                        if ( i in array && array[ i ] === elem ) {
                            return i;
                        }
                    }
                }
                return -1;
            },
       　　 //合并数据
            merge: function( first, second ) {
                var i = first.length,
                      j = 0;
                if ( typeof second.length === "number" ) {
            　　　　 //合并数组或类数组的对象
                    for ( var l = second.length; j < l; j++ ) {
                        first[ i++ ] = second[ j ];
                    }
                } else {
                   //合并属性名为数字的对象
                    while ( second[j] !== undefined ) {
                        first[ i++ ] = second[ j++ ];
                    }
                }
                first.length = i;
                return first;
            },
            //收集通过过滤器函数callback的数组(类数组)元素值
            grep: function( elems, callback, inv ) {
                var ret = [], retVal;
                 //!!的作用是将inv转化为boolean类型数据，等同于inv=Boolean(inv);
                //inv=''/0/undefined/null/false，则!!inv=false；inv=其他值，则!!inv=true;               
                inv = !!inv;
                for ( var i = 0, length = elems.length; i < length; i++ ) {
                    retVal = !!callback( elems[ i ], i );
                    if ( inv !== retVal ) {
                        ret.push( elems[ i ] );
                    }
                }
                return ret;
            },
            //数组(类数组)，对象遍历执行callback方法取得新数据后返回
            map: function( elems, callback, arg ) {
                var value, key, ret = [],
                       i = 0,length = elems.length,
                       //判断elems是否为数组（Array）对象或类数组（如Arguments）对象
                       isArray = elems instanceof jQuery
　　　　　　　　　　　　　　　　　　　　|| length !== undefined 
　　　　　　　　　　　　　　　　　　　　　　&& typeof length === "number" 
                              　　　　　　&& ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) 
　　　　　　　　　　　　　　　　　　　　　　　　　　|| length === 0 || jQuery.isArray( elems ) ) ;
                if ( isArray ) {
                    for ( ; i < length; i++ ) {
                        value = callback( elems[ i ], i, arg );
                       //若value=null/undefined时value!=null为false
                        if ( value != null ) {
                            //这句技巧性太强，完全可以用ret.push(value)替代
                            ret[ ret.length ] = value;
                        }
                    }
                } else {
                    for ( key in elems ) {
                        value = callback( elems[ key ], key, arg );
                        //若value=null/undefined时value!=null为false
                        if ( value != null ) {
                            //这句技巧性太强，完全可以用ret.push(value)替代
                            ret[ ret.length ] = value;
                        }
                    }
                }
                //concat方法的作用是将数组中内嵌数组元素展开，即是将多维数组转化为一维数组
                //[].concat.apply([],[1,[2,[3,4]],5,6,7])执行结果为一维数组[1,2,3,4,5,6,7]
                return ret.concat.apply( [], ret );
            }
       //...... 省略代码
});
//初始化class2type变量。该变量存储对象的toString方法返回的字符串(比如[object Object])
//与该对象类型名称(比如object)的映射关系。供jQuery.type方法使用。
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase();
});
//...... 省略代码
{%endhighlight%}