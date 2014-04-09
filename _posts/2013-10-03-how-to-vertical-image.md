---
layout: post
comments: true
title: image居中显示
activePage: blogItem
tags: ["CSS"]
---

实现*image*居中显示。

{%highlight css linenos%}
//注：.imgContainer为容器的样式，.imgContainer img为容器里的img样式
.imgContainer{ 
     /*非IE的主流浏览器识别的垂直居中的方法*/ 
     display: table-cell; 
     vertical-align:middle; 
     /*设置水平居中*/ 
     text-align:center; 
     /* 针对IE的Hack */ 
     *display: block; 
     *font-size:78px;/*约为高度的0.873，200*0.873 约为175*/ 
     *font-family:Arial;/*防止非utf-8引起的hack失效问题，如gbk编码*/ 
     width:94px; 
     height:94px; 
     border: 1px solid #eee; 
} 
.imgContainer img {
     /*设置图片垂直居中*/ 
     vertical-align:middle;
}
{%endhighlight%}
