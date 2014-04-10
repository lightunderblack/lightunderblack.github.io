---
layout: post
comments: true
title: 神奇的JavaScript之Function
activePage: blogItem
tags: ["JavaScript", "Function"]
---

众所周知，在*JavaScript*中，内置对象有*constructor*属性指向它的构造函数，如:

{%highlight javascript linenos%}
([]).constructor === Array;//true
({}).constructor === Object;//true
(/\./).constructor === RegExp;//true
{%endhighlight%}

这个很好理解，但是不知是否注意到*Function*不仅是构造函数，而且是对象，所以*Function*也有*constructor*属性，并且

{%highlight javascript linenos%}
Function.constructor === Function;//true
{%endhighlight%}

按上面等式得知：对象*Function*是构造函数*Function*的实例!
<!--more-->

对象会继承它的构造函数的*prototype*属性所包含方法/属性，即对象可以访问到它的原型对象里方法/属性，那么

{%highlight javascript linenos%}
Function.call === Function.prototype.call;//true
Function.apply === Function.prototype.apply;//true
{%endhighlight%}

若向*Function.prototype*添加自定义方法/属性，*Function*也可访问得到的，如

{%highlight javascript linenos%}
Function.prototype.sayHelloWorld = function(){
  console.log('Hello World!');
};
Function.sayHelloWorld();//输出Hello World!
{%endhighlight%}

很多*JavaScript*库的源码里都会出现诸如下面代码，比如*mootools*的*core.js*

{%highlight javascript linenos%}
Function.prototype.overloadSetter = function(usePlural){
    var self = this;
    return function(a, b){
        if (a == null) return this;
        if (usePlural || typeof a != 'string'){
            for (var k in a) self.call(this, k, a[k]);
            if (enumerables) for (var i = enumerables.length; i--;){
                k = enumerables[i];
                if (a.hasOwnProperty(k)) self.call(this, k, a[k]);
            }
        } else {
            self.call(this, a, b);
        }
        return this;
    };
};
Function.prototype.implement = function(key, value){
    this.prototype[key] = value;
}.overloadSetter();
//其实Function.implement === Function.prototype.implement
Function.implement({
    hide: function(){
        this.$hidden = true;
        return this;
    },
    protect: function(){
        this.$protected = true;
        return this;
    }
});
{%endhighlight%}

若弄明白原理，就不会对上面代码感到莫名其妙了。

