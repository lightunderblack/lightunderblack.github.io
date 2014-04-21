---
layout: post
comments: true
title: 将颜色值转换为十六进制
activePage: blogItem
tags: ["JavaScript", "CSS"]
---

在*CSS*中，有多种形式表示颜色值，例如红色，可用十六进制：*#FF0000*，或*rgb(255,0,0)*，或颜色关键字*red*等表示。在符合*W3C*标准的浏览器下，通过函数*getComputedStyle()*会返回*RGB*/*RGBA*形式的颜色值，但在*IE9*以下浏览器，由于不支持该函数，必须自行实现颜色值的转换。这里举例大神*DE*的实现。

<script src="https://gist.github.com/lightunderblack/c9ba777d1de821ad8795.js"></script>

<!--more-->

还需对支持*getComputedStyle*返回结果为*RGB*/*RGBA*形式的颜色值转换为十六进制，结合*DE*的代码，以兼容各大浏览器。

<script src="https://gist.github.com/lightunderblack/f62d9c211ac27d852481.js"></script>