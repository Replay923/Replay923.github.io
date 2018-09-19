---
layout:     post   				    # 使用的布局（不需要改）
title:      C#特性(Attribute)  		# 标题 
subtitle:   笔记-现学现用-特性Attribute #副标题
date:       2018-9-19				# 时间
author:     Replay 						# 作者
header-img: img/post-bg-debug.png 	#这篇文章标题背景图片
catalog: true 						# 是否归档
tags:								#标签
    - 笔记
    - 反射
    - 特性
    - Attribute
    - C#
    - Reflection
---

## 前言
> 想要灵性的使用C#反射机制，特性(Attribute)的使用是必不可少的。

## [C# 特性(Attribute) 简介](https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/attributes)

>Attribute 中文译为 属性。而C#特征已有 Property 属性一词。<br>
讲究先来后到，Attribute被译为了特性。

[菜鸟教程定义:](http://www.runoob.com/csharp/csharp-attribute.html)
>特性（Attribute）是用于在运行时传递程序中各种元素（比如类、方法、结构、枚举、组件等）的行为信息的声明性标签。您可以通过使用特性向程序添加声明性信息。一个声明性标签是通过放置在它所应用的元素前面的方括号（[ ]）来描述的。<br>

>"标签"这个词很好的解释了Attribute的作用。<br>
>还有"[注释](https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/attributes)"一词

>特性是可以添加到编程元素（例如程序集，类型，成员和参数）的注释。它们存储在程序集的元数据中，可以使用反射API在运行时访问。例如，框架定义了ObsoleteAttribute，它可以应用于类型或成员，以指示已弃用类型或成员。

特性（Attribute）用于添加元数据，如编译器指令和注释、描述、方法、类等其他信息。.Net 框架提供了两种类型的特性：预定义特性和自定义特性。

## 预定义特性（Attribute）

.Net 框架提供了三种预定义特性：
- AttributeUsage
- Conditional
- Obsolete

代码摘选自[菜鸟教程](http://www.runoob.com/csharp/csharp-attribute.html)

预定义特性 AttributeUsage 描述了如何使用一个自定义特性类。它规定了特性可应用到的项目的类型。<br>
规定该特性的语法如下：
```CSharp
[AttributeUsage(
   validon,
   AllowMultiple=allowmultiple,
   Inherited=inherited
)]
```
其中：
- 参数 validon 规定特性可被放置的语言元素。它是枚举器 AttributeTargets 的值的组合。默认值是 AttributeTargets.All。
- 参数 allowmultiple（可选的）为该特性的 AllowMultiple 属性（property）提供一个布尔值。如果为 true，则该特性是多用的。默认值是 false（单用的）。
- 参数 inherited（可选的）为该特性的 Inherited 属性（property）提供一个布尔值。如果为 true，则该特性可被派生类继承。默认值是 false（不被继承）。
  
例如：
```CSharp
[AttributeUsage(AttributeTargets.Class |
AttributeTargets.Constructor |
AttributeTargets.Field |
AttributeTargets.Method |
AttributeTargets.Property, 
Inherited = true,
AllowMultiple = true)]
public class BaseAttribute : Attribute
...
```

## 创建自定义特性（Attribute）
.Net 框架允许创建自定义特性，用于存储声明性的信息，且可在运行时被检索。该信息根据设计标准和应用程序需要，可与任何目标元素相关。

创建并使用自定义特性包含四个步骤：

- 声明自定义特性
- 构建自定义特性
- 在目标程序元素上应用自定义特性
- 通过反射访问特性

### 声明自定义特性

定义一个用来存储数据表名的类，一个新的自定义特性应派生自 System.Attribute 类
```CShapr
using System;

namespace DataHelper.Attributes
{
    /// <summary>
    /// 该特性表明了该类可以用来生成sql语句，参数为空的情况下，则使用该类的名称作为表名
    /// </summary>
    [System.AttributeUsage(AttributeTargets.Class, Inherited = true, AllowMultiple = false)]
    public sealed class TableNameAttribute : Attribute
    {
        readonly string tableName;

        /// <summary>
        /// 指定表名
        /// </summary>
        /// <param name="tableName"></param>
        public TableNameAttribute(string tableName = null)
        {
            if (string.IsNullOrEmpty(tableName))
                tableName = this.GetType().Name;
            this.tableName = tableName;
        }

        public string TableName
        {
            get { return tableName; }
        }
    }
}

```

### 使用自定义特性

```CSharp
[TableName("media")]
public class Media
{
    ...
}
```
### 获取指定特性

```CSharp
/// <summary>
/// 获得表名
/// 若没有使用TableName 指定表名，则使用类名作为表名
/// </summary>
/// <typeparam name="T"></typeparam>
/// <returns></returns>
private string GetTableName<T>()
{
    var type = typeof(T);
    var result = ((TableNameAttribute)type
    .GetCustomAttributes(typeof(TableNameAttribute), false).FirstOrDefault())
    ?.TableName ?? type.Name;
        return result;
}
```

## Talks

[菜鸟教程(Attribute)](http://www.runoob.com/csharp/csharp-attribute.html)

[袁智远MySqlHelper](https://github.com/nianwu/MySqlHelper)