---
layout: post
title: jQuery源码分析之正则表达式
activePage: blogItem
---


*jQuery*源码中多处使用正则表达式处理字符串，挑选其中部分正则表达式加于研究，以加深对正则表达式的理解，巩固知识。本次涉及到的*JavaScript*正则表达式的概念有：*组合*、*选择*、*引用*。

<h5>1、quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/;</h5>

该正则表达式匹配以下两种情况：

1. *html*字符串：多个标签`selector = '<p><span>正则</span></p>';`单个标签`selector = '<span>正则</span>';`
2. 以*#*开头字符串：`selector = '#myId';`

{%highlight javascript%}
match = quickExpr.exec( selector );
{%endhighlight%}

方法*exec*：如果字符串与正则表达式匹配，则返回一个数组，该数组第一个元素为正则表达式所匹配的字符串值。第二个元素开始则是正则表达式的组合所匹配的子字符串值，所谓组合即是用括号括起来的部分，比如`(<[\w\W]+>)和([\w\-]*)`，`(?:)`括起来的部分也表示组合但不能引用它所匹配的字符串值，即它括起来的部分匹配的字符串不会放入*match*数组中，也不能通过*RegExp.$索引号*或*\索引号*的方式引用。引用的索引号是根据括号从左到右的顺序计算的，比如正则表达`/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/`中，由于`(?:)`括起来的的组合不能引用，因此`(<[\w\W]+>)`的索引号为*1*，`([\w\-]*)`的索引号为*2*。如果字符串与正则表达式不匹配，则返回*null*。根据以上分析
`match = quickExpr.exec( selector );`执行结果如下：

第一种情况：
{%highlight javascript%}
match = ['<p><span>正则</span></p>','<p><span>正则</span></p>',undefined];
match = ['<span>正则</span>','<span>正则</span>',undefined];
{%endhighlight%}

第二种情况：
{%highlight javascript%}
match = ['#myId',undefined,'myId'];
{%endhighlight%}

<h5>2、rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;</h5>

该正则表达式匹配单个html标签，有以下两种形式：

1. 有闭合标签：`selector = '<span></span>';`
2. 无闭合标签：`selector = '<img src="../image.jpg" />'`;  

`(\w+)`为第一个组合。`(?:<\/\1>)`为只组合不引用，与之匹配的字符串不能被引用。`\1`为反向引用，所引用的是第一个组合所匹配的值，这里的意思是必须与第一个组合的匹配的字符串配对，比如与`(\w+)`匹配的字符串是`span`，则`\1`匹配的字符串必须是`span`。

`ret = rsingleTag.exec( selector );`的执行结果如下

1. 有闭合标签情况：`ret = ['<span></span>','span'];`
2. 无闭合标签情况：`ret = ['<img />','img'];`

