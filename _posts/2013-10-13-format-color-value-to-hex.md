---
layout: post
comments: true
title: 将颜色值转换为十六进制
activePage: blogItem
tags: ["JavaScript", "CSS"]
---

在*CSS*中，有多种形式表示颜色值，例如红色，可用十六进制：*#FF0000*，或*rgb(255,0,0)*，或颜色关键字*red*等表示。在符合*W3C*标准的浏览器下，通过函数*getComputedStyle()*会返回*RGB*/*RGBA*形式的颜色值，但在*IE9*以下浏览器，由于不支持该函数，必须自行实现颜色值的转换。这里举例大神*DE*的实现。

{%highlight javascript linenos%}
function toHex(color) {
	var body  = createPopup().document.body,
	  	range = body.createTextRange();

	body.style.color = color;
	//这里用到非常精妙的技巧！！
	//使用TextRange对象的queryCommandValue获取ForeColor值
	//可以间接将各种形式颜色值转化成用十进制表示BGR的值
	//注意是BGR不是RGB,所以后面需要将BGR再转换成RGB
	var value = range.queryCommandValue("ForeColor");
	//这里就是将BGR转换成RGB的代码了
	value = ((value & 0x0000ff) << 16) | (value & 0x00ff00) | ((value & 0xff0000) >>> 16);
	//将十进制RGB转换成十六进制RGB
	value = value.toString(16);

	//这里是给十六进制值RGB前面添加必要的前缀
	return "#000000".slice(0, 7 - value.length) + value;
};
{%endhighlight%}

还需对支持*getComputedStyle*返回结果为*RGB*/*RGBA*形式的颜色值转换为十六进制，结合*DE*的代码，以兼容各大浏览器。

{%highlight javascript linenos%}
function getHexColor(node, property){
    function rgbToHex(color){
        var match,
            val = '', 
            //支持rgba,但是由于十六进制是无法表示透明度的,所以透明度值被忽略
            regex = /rgba?\s*\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*\d(?:\.\d*)?\s*)?\)/i,
            toHex = function(val){
                val = (+val).toString(16);
                return '00'.slice(0, 2 - val.length) + val;
            }
        if((match = regex.exec(color))){
            val = '#';
            for(var i = 1, length = match.length; i < length; i++){
                val += toHex(match[i]); 
            }
        }
        return val;
    }
    function toHex(color) {
        var body  = createPopup().document.body,
            range = body.createTextRange();
        body.style.color = color;
        var value = range.queryCommandValue("ForeColor");
        value = ((value & 0x0000ff) << 16) | (value & 0x00ff00) | ((value & 0xff0000) >>> 16);
        value = value.toString(16);
        return "#000000".slice(0, 7 - value.length) + value;
    }
    var val = '';
    if(window.getComputedStyle){
        //兼容W3C标准
        val = (node.ownerDocument || node).defaultView.getComputedStyle(node, null)[property];
        val = rgbToHex(val);
    }else{
        //兼容IE
        val = node.currentStyle[property];
        val = toHex(val);
    }
    return val.toUpperCase();
}
{%endhighlight%}