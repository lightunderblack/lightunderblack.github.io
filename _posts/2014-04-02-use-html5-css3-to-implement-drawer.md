---
layout: post
comments: true
title: HTML5+CSS3实现抽屉菜单
activePage: blogItem
tags: ["JavaScript", "HTML5", "CSS3"]
---

抽屉菜单在手机*native*应用中很常见。比如下图酷狗手机版界面。左侧为操作菜单，默认不显示。需要时向右滑动界面，操作菜单将从左侧缓缓显示；不需要时向左滑动界面，操作菜单将隐藏在左侧边。操作菜单这种缓入缓出的用户体验非常不错。这里讲采用*css3*实现上述抽屉菜单效果。

<p class="image-container"><img src="/images/drawer_1.jpg" alt="抽屉菜单示例图" /></p>
<!--more-->

*(以下实例请在基于webkit手机浏览器下访问)*

#####*html*代码：#####

<script src="https://gist.github.com/lightunderblack/27b42a32ceef843c94e2.js"></script>

#####*css*代码：#####

<script src="https://gist.github.com/lightunderblack/e0ff18d11c09409119c6.js"></script>

#####组件Drawer代码(依赖*Zepto.js*)：#####

<script src="https://gist.github.com/lightunderblack/95e2ce7e5791b4fa0e49.js"></script>

#####初始化代码：#####

<script src="https://gist.github.com/lightunderblack/fa4fbce0ba91b7af6463.js"></script>

[*源码下载*](/downloads/files/drawer.zip)

