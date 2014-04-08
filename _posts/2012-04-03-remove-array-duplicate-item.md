---
layout: post
title: 剔除数组重复元素的简单方法
activePage: blogItem
---

实现剔除数组相同元素的方法

现有数组`var array = ['测试','学习','测试'];`其中`array[0]`与`array[2]`值相同，需剔除重复值并输出。依据*JavaScript*对象不能有相同键以及相同键值覆盖的特点。实现如下：

###1、简单版###
{%highlight javascript%}
var array = ['测试','学习','测试'];
var object = {};
for(var i = 0, length = array.length; i < length; i++){
    object[array[i]] = i;
}
for(var property in object){
    console.log(property);
}
{%endhighlight%}

*FireFox*输入结果为：*学习、测试*。总结：该方法虽简单，但输出结果的顺序随机。如上可能是*测试、学习*。

###2、改进版###

{%highlight javascript%}
var array = ['测试','学习','测试'];
var temp = [];
var result = [];
 
var object = {};
var j = 0;
for(var i = 0, length = array.length; i < length; i++){
    object[array[i]] = i;
}
for(var property in object){
   temp[object[property]] = property;
}
for(i = 0, length = temp.length; i < length; i++){
   if(temp[i]){
     result[j++] = temp[i];
   }
}
{%endhighlight%}

总结：该方法可确保数组重复值时后面元素覆盖前面元素，但需*3\*n*次循环。