---
layout: post
comments: true
title: HTML之&lt;meta&gt;标签
activePage: blogItem
tags: ["HTML"]
---

*meta*是用来在*HTML*文档中模拟*HTTP*协议的响应头报文。*meta*标签用于网页的`<head>`与`</head>`中，*meta*标签的用处很多。*meta*的属性有两种：*name*和*http-equiv*。*name*属性主要用于描述网页，对应于*content*（网页内容），以便于搜索引擎机器人查找、分类（目前几乎所有的搜索引擎都使用网上机器人自动查找*meta*值来给网页分类）。这其中最重要的是*description*（站点在搜索引擎上的描述）和*keywords*（分类关键词），所以应该给每页加一个*meta*值。比较常用的有以下几个：

#####name属性#####

1. `<meta name="generator" contect="">`用以说明生成工具（如*Microsoft FrontPage 4.0*）等
2. `<meta name="keywords" contect="">`向搜索引擎说明你的网页的关键词
3. `<meta name="description" contect="">`告诉搜索引擎你的站点的主要内容  
4. `<meta name="author" contect="你的姓名">`告诉搜索引擎你的站点的制作的作者
5. `<meta name="robots" contect= "all|none|index|noindex|follow|nofollow">`，其中属性说明如下：
	+ 设定为*all*：文件将被检索，且页面上的链接可以被查询
	+ 设定为*none*：文件将不被检索，且页面上的链接不可以被查询
	+ 设定为*index*：文件将被检索
	+ 设定为*follow*：页面上的链接可以被查询
	+ 设定为*noindex*：文件将不被检索，但页面上的链接可以被查询
	+ 设定为*nofollow*：文件将不被检索，页面上的链接可以被查询

#####http-equiv属性#####

1. `<meta http-equiv="Content-Type" contect="text/html";charset=gb_2312-80">`和 `<meta http-equiv="Content-Language" contect="zh-CN">`用以说明主页制作所使用的文字以及语言；又如英文是*ISO-8859-1*字符集，还有*BIG5*、*utf-8*、*shift-Jis*、*Euc*、*Koi8-2*等字符集
2. `<meta http-equiv="refresh" contect="n;url=http://yourlink">`定时让网页在指定的时间*n*内，跳转到页面*http://yourlink*
3. `<meta http-equiv="expires" contect="Mon,12 May 2001 00:20:00 GMT">`可以用于设定网页的到期时间，一旦过期则必须到服务器上重新调用。需要注意的是必须使用*GMT*时间格式
4. `<meta http-equiv="pragma" contect="no-cache">`是用于设定禁止浏览器从本地机的缓存中调阅页面内容，设定后一旦离开网页就无法从*Cache*中再调出
5. `<meta http-equiv="set-cookie" contect="Mon,12 May 2001 00:20:00 GMT">`*cookie*设定，如果网页过期，存盘的*cookie*将被删除。需要注意的也是必须使用*GMT*时间格式
6. `<meta http-equiv="pics-label" contect="">`网页等级评定，在*IE*的*internet*选项中有一项内容设置，可以防止浏览一些受限制的网站，而网站的限制级别就是通过*meta*属性来设置的
7. `<meta http-equiv="windows-target" contect="_top">`强制页面在当前窗口中以独立页面显示，可以防止自己的网页被别人当作一个*frame*页调用
8. `<meta http-equiv="page-Enter" contect="revealTrans(duration=10,transtion= 50)">`和`<meta http-equiv="page-Exit" contect="revealTrans(duration=20，transtion=6)">`设定进入和离开页面时的特殊效果，这个功能即*FrontPage*中的“格式/网页过渡”，不过所加的页面不能够是一个*frame*页面