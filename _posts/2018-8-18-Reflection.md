---
layout:     post   				    # 使用的布局（不需要改）
title:      C#反射(Reflection)  		# 标题 
subtitle:   笔记-现学现用-反射我也会 #副标题
date:       2018-8-18				# 时间
author:     Replay 						# 作者
header-img: img/post-bg-github-cup.jpg 	#这篇文章标题背景图片
catalog: true 						# 是否归档
tags:								#标签
    - 笔记
    - 反射
    - C#
    - Reflection
---

## 前言
> 我最近在制作一个服务端的定时任务程序，目前只有两种任务逻辑供选择，这对于目前的项目需求是已经满足了。但是我突然想到一个问题：如果服务端已经上线(不能重启服务端)，我突然要增加一个新的任务逻辑该怎么办？然后发现使用反射机制可以完美的解决问题！大家一起共同学习吧。

## [C# 反射(Reflection) 简介](http://www.runoob.com/csharp/csharp-reflection.html)

- 反射指程序可以访问、检测和修改它本身状态或行为的一种能力。
- 程序集包含模块，而模块包含类型，类型又包含成员。反射则提供了封装程序集、模块和类型的对象。
- 您可以使用反射动态地创建类型的实例，将类型绑定到现有对象，或从现有对象中获取类型。然后，可以调用类型的方法或访问其字段和属性。
  
## 反射的用途

反射（Reflection）有下列用途：
- 它允许在运行时查看特性（attribute）信息。
- 它允许审查集合中的各种类型，以及实例化这些类型。
- 它允许延迟绑定的方法和属性（property）。
- 它允许在运行时创建新类型，然后使用这些类型执行一些任务。

## 反射 快速入门

代码示例，代码摘自[C# 反射之调用方法谈](https://www.cnblogs.com/MrALei/p/4692275.html)
```CSharp
using System;
namespace TestDll
{
    using System.Linq;

    public class TestClass
    {
        private int _priValue;

        //无参构造函数
        public TestClass()
        {
            this._priValue = 9;
        }

        //有参构造函数
        public TestClass(int i)
        {
            this._priValue = i;
        }

        //无参方法
        public int Add()
        {
            return ++this._priValue;
        }

        //ref参数的方法
        public void Exchange(ref int a, ref int b)
        {
            int temp = b;
            b = a;
            a = temp;
        }

        // 静态有参方法 
        public static string SayHi(string name)
        {
            return "Hi~ " + name;
        }

        public static int AddValue(int[] objsInts)
        {
            int temp = 0;
            if (objsInts != null)
            {
                temp += objsInts.Sum();
            }
            return temp;
        }
    }
}
```
反射调用代码示例：
```CSharp
static void Main(string[] args)
{
    //加载程序集(dll文件地址)，使用Assembly类 
    Assembly testDll = Assembly.LoadFile(Environment.CurrentDirectory + "\\TestDll.dll");

    //获取类型，参数（名称空间+类）
    Type testClass = testDll.GetType("Testdll.TestClass");

    //创建实例
    var instance = testDll.CreateInstance("Testdll.TestClass");

    //调用无参构造函数
    ConstructorInfo noParamConstructor = testClass.GetConstructor(Type.EmptyTypes);
    object testClassObject = noParamConstructor.Invoke(new object[] { });

    //调用有参构造函数
    ConstructorInfo paramConstructor = testClass.GetConstructor(new Type[] { Type.GetType("System.Int32") });
    object testClassObject2 = paramConstructor.Invoke(new object[] { 2 });

    #region 调用非静态方法
    MethodInfo addMethod = testClass.GetMethod("Add");
    object addValue = addMethod.Invoke(instance, new object[] { });
    #endregion

    #region 调用静态有参方法
    MethodInfo sayHiMethod = testClass.GetMethod("SayHi");
    object sayHi = sayHiMethod.Invoke(null, new object[] { "jason" });
    #endregion

    #region 调用含有ref参数的方法
    MethodInfo exchange = testClass.GetMethod("Exchange");
    var objs = new object[2];
    objs[0] = 5;
    objs[1] = 6;
    Console.WriteLine("objs[0]={0}\nobjs[1]={1}", objs[0], objs[1]);
    object retValue = exchange.Invoke(instance, objs);
    #endregion

    #region 调用参数为数组的方法
    MethodInfo addValueInfo = testClass.GetMethod("AddValue");
    var ints = new int[] {1, 2, 3, 4, 5};
    object obj = addValueInfo.Invoke(null, new object[] {ints});
    #endregion

    Console.WriteLine("MethodInfo.Invoke() Example\n");
    Console.WriteLine("TestClass.Add() returned: {0}", addValue);
    Console.WriteLine("TestClass.SayHi() returned:{0}", sayHi);
    Console.WriteLine("TestClass.Exchange(ref int a,ref int b) returned:{0}", retValue);
    Console.WriteLine("objs[0]={0}\nobjs[1]={1}", objs[0], objs[1]);

    Console.WriteLine("AddValue(int[] objsInts) result:{0}", obj);
    Console.ReadKey();
}
```

### 实验效果

截图所示。结合代码浏览

![](https://replay923.github.io/BlogResources/Reflection/ref1.png)

## 使用心得
- 扩展的程序集与主项目分隔开。调用程序集时通过路径引用它 Assembly.LoadFile(filePath) 。filePath为类库.dll的文件路径。这样利于后续新增程序集和方法类。
 ```CSharp
/// <summary>
/// 反射获取类信息
/// </summary>
/// <param name="assemblyNamePath">程序集路径</param>
/// <param name="className">类名</param>
/// <returns></returns>
public static Type GetAbsolutePath(string assemblyNamePath,string className)
{
    Assembly assembly = Assembly.LoadFile(assemblyNamePath);
    Type type = assembly.GetType(className);
    return type;
}
 ```
- 如果扩展程序集与主项目同用一些工具，例：日志工具。把工具与项目分隔开,增加代码的复用性。
![](https://replay923.github.io/BlogResources/Reflection/utils.png)

## Talks

[RUNOOB.COM](http://www.runoob.com/csharp/csharp-reflection.html)

[阿磊ing的博客](https://www.cnblogs.com/MrALei/p/4692275.html)