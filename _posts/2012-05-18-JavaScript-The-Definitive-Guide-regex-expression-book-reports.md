---
layout: post
comments: true
title: 《JavaScript权威指南》读书笔记之正则表达式
activePage: blogItem
tags: ["JavaScript"]
---

*《JavaScript权威指南》*读书笔记之正则表达式

#####1、定义#####

{%highlight javascript%}
//正则表达式直接量
var regex = /s/;
//正则表达式对象RegExp
var regex = new RegExp('s');
{%endhighlight%}

#####2、特殊字符#####

正则表达式中许多标点符号具有特殊的含义`:^$.*+?=!:|\/()[]{}`。若想把它们当做普通字符处理，则需转义，即在这些符号之前加`\`

#####3、字符类#####

* `[...]`位于中括号内的任意字符
* `[^..]`不在中括号内的任意字符
* `.`除换行符和其他*Unicode*行终止符之外的任意字符
* `\w`任何*ASCII*单字符，等价于`[a-zA-Z0-9_]`
* `\W`任何非*ASCII*单字符，等价于`[^a-zA-Z0-9_]`
* `\s`任何*Unicode*空白符
* `\S`任何非*Unicode*空白符的字符
* `\d`任何*ASCII*数字，等价于`[0-9]`
* `\D`任何非*ASCII*数字，等价于`[^0-9]`
<!--more-->
#####4、字符重复#####

* `{n,m}`匹配前一项至少*n*次，至多*m*次
* `{n,}`匹配前一项至少*n*次
* `{n}`匹配前一项至少*n*次
* `?`匹配前一项*0*次或*1*次，等价于`{0,1}`
* `*`匹配前一项至少*0*次，等价于`{0,}`
* `+`匹配前一项至少*1*次，等价于`{1,}`

#####5、选择、分组、引用#####

* `|`选择。匹配的是该符号左边子表达式或右边子表达式。
* `(...)`组合。将几个项组合为一个单元，可供`*`、`?`、`+`和`|`等符号使用，还可记住和这组合匹配的字符以供此后的引用使用。
* `(?..)`只组合不引用。把几个项组合为一个单元，但不记忆于该组合匹配的字符
* `\n`和第*n*个分组第一次匹配的字符相匹配。组是括号中的子表达式。组号从左到右计数，以`(?:)`形式分组的组不编号。

例子：

{%highlight javascript%}
//选择
var regex = /ab|cd|ef/;//匹配ab或者cd或者ef
//分组
var regex = /java(script)?/;//匹配java,script可有可无
//引用
var regex = /（['"]）[^'"]*\1/;//\1表示第一括号内的子模式。开始的引号和结尾的引号要相匹配，即开始是单引号则结尾也是单引号。
//只分组,不引用
var regex = /[Jj]ava(?:[Ss]cript)?/;//子表达式(?:[Ss]cript)仅用于分组，不会生成引用。所以\1在此子表达式无效。
{%endhighlight%}

#####6、锚字符#####

* `^`匹配字符串的开头，在多行匹配时，匹配一行的开头。
* `$`匹配字符串的结尾，在多行匹配时，匹配一行的结尾。
* `\b`匹配一个单词的边界，即是位于字符`\w`和`\W`之间的位置，或位字符`\w`和字符串的开头或结尾之间的位置。
* `\B`匹配非单词边界的位置
* `(?=p)`正前向声明，要求接下来的字符都与模式`p`匹配，但不包含匹配中的那些字符
* `(?!p)`反前向声明，要求接下来的字符不与模式p匹配。

例子：

{%highlight javascript%}
//选择
var regex = /ab|cd|ef/;//匹配ab或者cd或者ef
//分组
var regex = /java(script)?/;//匹配java,script可有可无
//引用
var regex = /（['"]）[^'"]*\1/;//\1表示第一括号内的子模式。开始的引号和结尾的引号要相匹配，即开始是单引号则结尾也是单引号。
//只分组,不引用
var regex = /[Jj]ava(?:[Ss]cript)?/;//子表达式(?:[Ss]cript)仅用于分组，不会生成引用。所以\1在此子表达式无效。
{%endhighlight%}


