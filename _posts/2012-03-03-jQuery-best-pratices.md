---
layout: post
comments: true
title: jQuery性能最佳实践
activePage: blogItem
tags: ["JavaScript", "jQuery"]
---

jQuery性能最佳实践

#####1、使用最新的*jQuery*版本#####
<p></p>
#####2、用对选择器#####

1. 最快选择器：*id*选择器和标签选择器。`$('#id'),$('form'),$('p')`
2. 较慢选择器：*class*选择器。`$('.className')`
3. 最慢选择器：伪类选择器和属性选择器。`$(':hidden'),$('[attribute=value]')`

#####3、理解子元素和父元素的关系#####

	{%highlight javascript%}
	$('.child', $parent)
	 
	$parent.find('.child')
	 
	$parent.children('.child')
	 
	$('#parent > .child')
	 
	$('#parent .child')
	 
	$('.child', $('#parent'))  
	 
	/*以上写法最快的是$parent.find('.child'),最慢的是$('#parent .child')*/
	{%endhighlight%}

#####4、不要过度使用*jQuery*

*jQuery*速度再快，也无法于原生的*JavaScript*方法快。如果情况允许尽量使用*JavaScript*原生方法。

`$('a').click(function(){alert($(this).attr('id'));});`

优化

`$('a').click(function(){alert(this.id);});`

#####5、做好缓存#####

选中某个网页元素开销大，所以使用选择器的次数越少越好，并且尽量缓存选中结果，便于以后反复使用

`jQuery('#top').find('p.classA');jQuery('#top').find('p.classB');`

优化

`var cache = jQuery('#top');cache..find('p.classA');cache.find('p.classB');`

#####6、使用链式写法#####

采用链式写法时，*jQuery*自动缓存每一步的结果，因此比非链式写法要快。

#####7、事件的委托处理#####

*JavaScript*事件模型采用*冒泡*模式：子元素的事件会逐级向上*冒泡*，成为父元素的事件。利用这一点，可以大大简化事件的绑定。

` $('table > td').bind('click', function(){$(this).toggleClass('click');});`

优化

`$('table').delegate('td', 'click', function($(this).toggleClass('click');));`

#####8、少改动*DOM*结构#####

1. 改动*DOM*结构开销很大，不要频繁使用`append()`、`insertBefore()`、`insertAfter()`。如果要插入多个元素，就先把它们合并，然后一次性插入
2. 如果要对一个*DOM*元素进行大量处理，应该先用`detach()`方法，把这个元素从*DOM*中取出，处理完毕以后，重新插回文档。
3. 如果要在*DOM*元素上存储数据，不要写成下面这样:
`var elem = $('#elem'); elem.data(key, value);`
应该写成这样:
`var elem = $('#elem'); $.data(elem, key, value);`

#####9、正确处理循环#####

循环是一种比较耗时的操作，如果可以使用复杂的选择器直接选中元素，就不要使用循环，去一个个辨认元素。*JavaScript*原生循环方法`for`和`while`，要比*jQuery*的`each()`方法快，应该优先使用原生方法。

#####10、尽量少生成*jQuery*对象#####

每使用一次选择器，就会生成一个*jQuery*对象。*jQuery*对象是一个庞大的对象，带很多属性和方法，占用不少资源。比如许多*jQuery*方法都有两个版本，一个是供*jQuery*对象使用的版本，另一个是供*jQuery*函数使用的版本。

+ *jQuery*对象使用:

	`var $text = $("#text");var $ts = $text.text();`

+ *jQuery*函数使用:

	`var $text = $("#text");var $ts = $.text($text);`

后者要比前者快

[原文地址](http://www.ruanyifeng.com/blog/2011/08/jquery_best_practices.html)
