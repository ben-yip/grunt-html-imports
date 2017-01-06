# 情景描述

 - 开发静态页面 Demo 时，如何解决包含页面片段的问题？
 - 是不是想要在开发静态 HTML 时，也可以像在 JSP 中那样 include 一些可重用的页面片段？
 - 如果有了片段引入，就可以用模块化的思想去组织页面片段，开发多个稍复杂静态页时，结构也变得更清晰了；
 - 开发完静态页后，如果切换成其他后端模板的工作需要交给后端的小伙伴，后端开发者也更容易看懂页面组织的逻辑；


# 解决方案
 
| 方案 | 特点 |
|:-----|:-----|
|使用后端模板引擎(ASP、JSP、PHP…)|服务器端渲染，割鸡焉用牛刀？|
|使用前端模板引擎(EJS、Pug、Nunjucks、Hogan.js ...)|在 Node 环境中使用，相当于服务器端渲染；<br>在 Browser 环境中使用，就是客户端渲染；|
|使用[SSI](https://en.wikipedia.org/wiki/Server_Side_Includes)，即服务器端包含， 文件扩展名为 shtml；|服务器端渲染，支持的服务器有：[Apache httpd](http://httpd.apache.org/)、[NginX](http://nginx.org/) 等|
|通过AJAX加载，可借助 jQuery 的 [.load() 方法](http://www.jquery123.com/load/)|需要HTML元素占位，还是客户端渲染|
|使用组件化/MVC框架（React中的组件、Angular中的指令、Vue ...）|客户端渲染，若项目开发时本来就在用这些框架，也不用担心这里要解决的问题了|
|其他：FIS 有 html 嵌入功能 
|自行编写小工具，参见[这篇张鑫旭的文章](http://www.zhangxinxu.com/wordpress/2016/06/csser-how-to-use-nodejs/)|直接粗暴，稍显简陋|
|利用一些标签：```<iframe>```,```<embed>```,```<object>```|:smirk:|

归纳起来有以下几类：

 - 服务器端渲染：其实就是利用模板引擎做字符串拼接的工作；
 - 客户端渲染：不管以何种形式加载，最终会涉及DOM操作；
 - 各种有组件化功能的框架/库：除非项目要使用这些环境/工具，否则方案不通用；
 - 借助构建工具的插件 ***（本项目就是干这件事的 Grunt 插件）***；
 - 其他；


# 艰难的标准化进程

 - HTML 至今尚未原生支持引入片段，也有自身的历史原因；
 - 在当下组件化的需求和浪潮下，一些工作草案（Working Draft）正在制定：
   - http://w3c.github.io/webcomponents/spec/imports/
   - https://developer.mozilla.org/en-US/docs/Web/Web_Components/HTML_Imports
   - https://www.html5rocks.com/en/tutorials/webcomponents/imports/ （可切换中文版）
   - 使用方式大概是这样的：```<link rel="import" href="myfile.html">```
   - 在有些试验性实现下，引入的不是片段，而是文档，类似于iframe，
   - 不过距离标准化还远，不好说到时会变成什么样；
   - 也可以在Can I use 中看看支持情况：http://caniuse.com/#search=import
 - 其他相关概念：
   - [Custom Element](https://w3c.github.io/webcomponents/spec/custom/)：允许自定义元素；
   - [Shadow DOM](http://webcomponents.org/articles/introduction-to-shadow-dom/)：允许用声明的方式定义你的自定义元素的内容；
   - [The \<template\> Element](http://webcomponents.org/articles/introduction-to-template-element/)：允许一个元素的style、ID、class只作用到其本身；
   - 再结合 HTML Import，可见这些都是为了构造可复用、模块化的 Web 组件；
   - 虽然标准没实现，不过已经有支持这套规范的polyfill： [webcomponents.js](https://github.com/webcomponents/webcomponentsjs)
   - 关注这个组织： http://webcomponents.org/


# 参考阅读

 - [HTML 静态页面的头部和底部都是相同的，如何让每个页面统一调用一个公共的头部和底部呢？——zhihu](https://www.zhihu.com/question/45549507)
 - [静态页面Demo项目，如何将header和footer 像PHP一样 include？ —— segmentfault](https://segmentfault.com/q/1010000002954318)
 - [静态 HTML 文件怎么从外部调入 HTML 模板（如头部，页尾这些公共的部分）？—— zhihu](https://www.zhihu.com/question/20349909)
 - [静态html如何包括header和footer ?——zhihu](https://www.zhihu.com/question/41740513)