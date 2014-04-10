---
layout: post
comments: true
title: 遍历DOM精简实现
activePage: blogItem
tags: ["JavaScript", "JavaScript DOM"]
---

在不用框架/库*（jQuery/mootools）*前提下，用比较精简代码实现遍历*DOM*树。

{%highlight javascript linenos%}
function travel(node, fn){
    var next = node.firstChild;
    while ((node = next)) {
        fn && fn(node);
        next = node.firstChild || node.nextSibling;
        while (!next && (node = node.parentNode)){
            next = node.nextSibling;
        }
    }
}
//打印出所有的p标签
travel(document.body, function(node){
    if(node.nodeName.toLowerCase() == 'p'){ 
        console.log(p);
    }
});
//模拟getElementsByTagName
function getElementsByTagName(node, tagName){
    var  i = 0,
         result, 
         elements = [], 
         everyTag = !tagName || (tagName === '*');

    !everyTag && (tagName = tagName.toLowerCase()); 
    travel(node, function(node){
        if(node.nodeType === 1 && everyTag 
               || node.nodeName.toLowerCase() === tagName){
            elements[i++] =  node;
        }
    });

    result = elements.slice(0);//拷贝一份
    elements = null;//因travel函数形成一个闭包引用到elements,所以应该将elements设置为null,防止内存泄露
    return result;
}
{%endhighlight%}
<!--more-->

