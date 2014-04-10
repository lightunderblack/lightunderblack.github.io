---
layout: post
comments: true
title: 神奇JavaScript之正则
activePage: blogItem
tags: ["JavaScript", "RegExp"]
---

今朝在技术群里，碰到有人问这样一个问题：使用正则去掉字符串中相邻的重复字符，比如字符串*"ddssssaaaadkslsls"*，去除相邻重复字符后，结果为*"dsadksls"*。

仔细琢磨后，实现如下：

{%highlight javascript linenos%}
'ddssssaaaadkslsls'.replace(/(\w+?)(?:\1+)/g, '$1');//运行结果为dsadksls
{%endhighlight%}
<!--more-->

这里涉及到正则表达式的知识点有：*分组*、*反向引用*、*非捕获分组*、*懒惰匹配*、*全局模式*。对于具体知识点描述，本文不会在此赘述，详细请翻阅*《JavaScript权威指南》*正则表达式一章。

如上题算是较简单字符串处理功能，但不用正则表达式的话，逻辑就会变得相当复杂，倘若各位闲得蛋疼可试着去实现。

*jQuery*源码的选择器*selector*实现就使用大量复杂正则表达式，有很多我至今还没弄明白，到时抽空回去看看后再写篇读后感。

