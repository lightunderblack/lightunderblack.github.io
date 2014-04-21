---
layout: post
comments: true
title: 返回顶部按钮的实现
activePage: blogItem
tags: ["JavaScript", "CSS3"]
---

返回顶部的快捷按钮在*web*页面中普遍存在，不过有些实现得并不理想，滚动条瞬间滚到页面顶部，过程不平滑而影响用户体验。在此列举实现返回顶部的若干方法，并分析优劣。

#####1. 使用锚点#####

页面顶部元素设置一个**id**值，返回顶部用**a**标签，设置**a**标签的**href**值为刚才的顶部元素**id**值。代码如下：

<script src="https://gist.github.com/lightunderblack/ae1a1829fb0fcc131800.js"></script>

利用浏览器**a**标签定位锚点功能，可以容易实现返回顶部，但滚动条滚动过程中并不平滑。
<!--more-->

#####2. 使用*DOM*的*scrollIntoView*方法#####

绑定返回顶部按钮的点击事件，在回调函数中调用页面顶部元素的*scrollIntoView*方法。代码如下：

<script src="https://gist.github.com/lightunderblack/1dc6a01c417235e1d31b.js"></script>

*scrollIntoView*接受一个参数，为*true*时滚动条将滚动到元素的**bottom**位置，为`false`或不传时滚动条将滚动到元素的**top**位置。

#####3.使用*scrollTo*方法#####

这里使用元素的*scrollTo*方法，并在调用该方法时使用动画，使得滚动条滚动过程平滑。我将次实现封装了组件，代码如下：

<script src="https://gist.github.com/lightunderblack/a10686b4116c57b6b846.js"></script>

*在线演示*

<iframe src="http://jsfiddle.net/shiny_bender/MwVp5/7/embedded" style="width:100%;height:300px;" frameborder="0" scrolling="no"></iframe>

[*源码下载*]({{site.url}}/downloads/files/smoothscroll.zip)




