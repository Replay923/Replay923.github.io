---
layout:     post   				    # 使用的布局（不需要改）
title:      C#网站爬取心得  				# 标题 
subtitle:   C#网站爬虫心得-工具Html Agility Pack #副标题
date:       2018-8-1				# 时间
author:     Replay 						# 作者
header-img: img/post-bg-js-version.jpg 	#这篇文章标题背景图片
catalog: true 						# 是否归档
tags:								#标签
    - 笔记
    - UWP
    - 网络爬虫
    - C#
    - Html Agility Pack
---

## Foreword
> 爬虫虽方便...
> 
> 请大家支持原版内容🙃🙃🙃🙃。

## Html Agility Pack 工具简介

[Html Agility Pack](http://html-agility-pack.net/) 作为一个HTML解析器。对与大多数解析器来说，它快速，并且有非常大的“容错性”（格式错误并不会影响解析。例：html的标签缺少情况并不影响解析......）

Html Agility Pack 基于 [.NetCore](https://www.microsoft.com/net/download)。 理论上可以进行跨平台使用（具体未测试）。

## Html Agility Pack 应用

### 加载Html

Html Agility Pack 支持从本地文件中加载，字符串加载和通过网页URL链接加载

```CSharp
...

// From File
var doc = new HtmlDocument();
doc.Load(filePath);

// From String
var doc = new HtmlDocument();
doc.LoadHtml(html);

// From Web
var url = "http://html-agility-pack.net/";
var web = new HtmlWeb();
var doc = web.Load(url);

...
```

### 获取节点。支持Xpath,并支持Linq

```CSharp
...

// With XPath 
var value = doc.DocumentNode
 .SelectNodes("//td/input")
 .First()
 .Attributes["value"].Value;
 
// With LINQ 
var nodes = doc.DocumentNode.Descendants("input")
 .Select(y => y.Descendants()
 .Where(x => x.Attributes["class"].Value == "box"))
 .ToList();

...
```

### 节点内容的读取操作
```CSharp
...

html=@"
        <root>
            <h3 id="h3_name">
            </h3>
            hello world!
        </root>
        "

var doc = new HtmlDocument();
doc.LoadHtml(html);

//OuterHtml 
var outerHtml = doc.DocumentNode.OuterHtml;
//outerHtml 结果为：<root>
//                      <h3 id="h3_name">
//                      </h3>
//                       hello world!
//                 </root>

// InnerHtml  
var innerHtml = doc.DocumentNode.InnerHtml;
//innerHtml 结果为：<h3 id="h3_name">
//                  </h3>
//                  hello world!

// InnerText 
var innerText = doc.DocumentNode.InnerText;
//innerText 结果为：hello world!

...
```

### 并且可以对节点的属性进行操作
```CSharp
...

var htmlNode = doc.DocumentNode.SelectSingleNode("//h3");
//获取节点属性的值
var nodeId = htmlNode.Attributes["id"].Value;
//nodeId的结果为： h3_name

//更改节点属性的值
htmlNode.SetAttributeValue("id", "alter_h3_name");
//此时 html的内容变为：<root>
//                      <h3 id="alter_h3_name">
//                      </h3>
//                      hello world!
//                  </root>

...
```

### 可以移除不需要的HTML内容

```CSharp
...
//移除节点有很多方法，这里只示例一个。
htmlNode.RemoveAll(); 
//移除了 <h3>节点
//此时 原 html 内容为：<root>
//                      hello world!
//                   </root>

...
```

## 处理扒取内容心得

处理完成后，就要显示需要的内容。

最近在做UWP应用，这里使用的 UWP的 Xaml 控件 WebView。

往html内容中添加 CSS，来自定义文章布局。

往html内容中添加 JavaScript 脚本，达到外部控制网页的目的。

```CSharp
...

//获取 h3 css 样式
private string GetH3Style()
{
        string fontColor = RootPage.Current.RequestedTheme != ElementTheme.Dark ?
        "color : #000000 !important;" : " color : #ffffff !important;";

        return fontColor + " padding:15px 15px 15px 15px !important;";
}
//获取主要显示内容 step_outer css 样式
private string GetStep_outer_Style()
{
    string fontColor = RootPage.Current.RequestedTheme != ElementTheme.Dark ?
        "color : #000000 !important;" : " color : #ffffff !important;";

    return fontColor + " padding:15px 15px 15px 15px !important;";
}
//获取网页背景 body css 样式
private string GetContent_main_outer_Style()
{
    string content_main_outer_color = RootPage.Current.RequestedTheme != ElementTheme.Dark ?
                    " background-color : #ffffff;" :
                    " background-color : #1e1e1e;";

    return content_main_outer_color;
}
//得到最终的 css 样式，用来添加到html内容中
public string GetCSS()
{
     string content_main_outer_Style = "body { " + GetContent_main_outer_Style() + " }";

    string h3_Style = "h3{" + GetH3Style() + "}";

    string step_outer_Style = ".step_outer {" + GetStep_outer_Style() + "}";

    return content_main_outer_Style + h3_Style + step_outer_Style;
}
//添加Js 脚本，用来加入到html内容中。
public string GetJavaScript()
{
    string script = @"function setColor(fontColorCss, backgroundColorCss) 
                        {                       
                            document.getElementsByClassName('step_outer')[0].style.cssText = fontColorCss;
                            var elements = document.getElementsByTagName('h3');
                            for (var i = 0;i < elements.length;i++)
		                    {
			                     elements[i].style.cssText = fontColorCss;
		                    }
                            document.getElementsByTagName('body')[0].style.cssText = backgroundColorCss;
                    }; 
                    function removeDialog()
                     {
                        document.getElementsByTagName('div')[0].innerHTML='';
                    };
                    ";
    return script;
}

/// <summary>
/// 切换主题色
/// </summary>
/// <returns></returns>
public async Task ChangeTheme()
{
    //执行js脚本中的 setColor 脚本，传入参数。
    await webView.InvokeScriptAsync("setColor", new[] { GetStep_outer_Style(), GetContent_main_outer_Style() });
}

/// <summary>
/// 去掉不需要的模块, 解决动态网页动态加载内容的消除
/// </summary>
/// <returns></returns>
public async Task Remove()
{
    //执行js脚本中的 removeDialog 脚本，传入参数。
    await webView.InvokeScriptAsync("removeDialog", null);
}

...
```

## Talks

[Html Agility Pack](http://html-agility-pack.net/)

[法号阿兴-C# 网络爬虫利器之Html Agility Pack如何快速实现解析Html](https://www.cnblogs.com/xuliangxing/p/8004403.html)