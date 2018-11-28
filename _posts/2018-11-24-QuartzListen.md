---
layout:     post   				    # 使用的布局（不需要改）
title:      作业调度框架Quartz.NET  		# 标题 
subtitle:   笔记-现学现用-02-任务监听 #副标题
date:       2018-11-24				# 时间
author:     Replay 						# 作者
header-img: img/post-bg-unix-linux.jpg 	#这篇文章标题背景图片
catalog: true 						# 是否归档
tags:								#标签
    - 笔记
    - .NetCore
    - 服务器端
    - 任务调度
    - C#
    - 定时任务
    - Quartz.NET
---

## 前言
> 任务调度系统并不是完美的，它会出现任务执行失败的情况。如果你需要处理任务失败后的逻辑，希望这篇笔记可以为你提供些帮助。
Quartz.NET的任务监听系统已经被我运用在已上线的工程中，亲测无坑。

## [Quartz.Listener](https://quartznet.sourceforge.io/apidoc/3.0/html/)

要创建一个监听器，只需创建一个实现ITriggerListener或IJobListener接口的对象。然后在运行时向调度程序注册监听器，并且必须为其指定名称(更确切地说，他们必须通过其Name属性来唯一标识自己。)


### 关键接口和类

- IJobListener - 与作业相关的事件包括：作业即将执行的通知，以及作业完成执行时的通知。
- ITriggerListener - 与触发器相关的事件包括：触发器触发，触发错误触发和触发器完成（触发器触发的作业完成）。
- ListenerManager - 监听器与调度程序的ListenerManager一起注册，并附带一个Matcher，用于描述监听器想要接收事件的作业/触发器。


### 示例应用程序

```CShape
using Quartz;
using Quartz.Impl;
using Quartz.Impl.Matchers;
using System;
using System.Collections.Specialized;
using System.Threading;
using System.Threading.Tasks;

namespace QuarzLis
{
    class Program
    {
        static void Main(string[] args)
        {
            StartUpJobs.StartUp().GetAwaiter().GetResult();
            Console.ReadKey();
        }

        public static class StartUpJobs
        {
            public static async Task StartUp()
            {
                try
                {
                    //第一步：从工厂中获取Scheduler实例
                    NameValueCollection props = new NameValueCollection();
                    StdSchedulerFactory factory = new StdSchedulerFactory(props);
                    IScheduler scheduler = await factory.GetScheduler();
                    //第二步：然后运行它
                    await scheduler.Start();
                    //第三步：定义作业并绑定到HelloJob类，HelloJob类实现IJob接口
                    IJobDetail job = JobBuilder.Create<HelloJob>()
                            .WithIdentity("job1", "group1")
                            //UsingJobData 可以用来传参数
                            .UsingJobData("appKey", "123456QWE")
                            .UsingJobData("appName", "小熊猫")
                            .UsingJobData("api", "https://www.baidu.com")
                            .Build();

                    //第四步：创建触发器。设定，执行一次作业。
                    ITrigger trigger = TriggerBuilder.Create()
                        .WithIdentity("trigger1", "group1") //指定唯一标识，触发器名字，和组名字
                                                            //这对于将作业和触发器组织成“报告作业”和“维护作业”等类别非常有用。
                                                            //作业或触发器的键的名称部分在组内必须是唯一的
                        .StartAt(DateBuilder.FutureDate(5, IntervalUnit.Second)) //可以设定在未来的 5 秒钟后触发    
                        .Build();

                    //第五步：作业与触发器组合，安排任务
                    await scheduler.ScheduleJob(job, trigger);

                    //第六步：创建任务监听，用来解决任务执行失败的情况. HelloJob类实现IJobListener接口
                    IJobListener jobListener = new HelloJob();

                    // 注: 任务监听是通过 IJobListener.Name 来区分的.以下逻辑避免多个任务监听情况下造成的监听被覆盖.
                    // a) 获取当前任务监听实例的名称.
                    var listener = scheduler.ListenerManager.GetJobListener(jobListener.Name);
                    // b) 通过job.Key 获取该任务在调度系统中的唯一实体
                    IMatcher<JobKey> matcher = KeyMatcher<JobKey>.KeyEquals(job.Key);
                    // c) 注意: 任务监听系统中已存在当前任务监听实例,与新添加任务监听的逻辑的区别.
                    if (listener != null)
                    {
                        // 如果已存在该任务监听实例,调用此方法,为该任务监听实例新增监听对象
                        scheduler.ListenerManager.AddJobListenerMatcher(jobListener.Name, matcher);
                    }
                    else
                        // 任务监听系统中不存在该任务监听实例,则调用此方法新增监听对象
                        scheduler.ListenerManager.AddJobListener(jobListener, matcher);

                    //创建触发器监听，触发器监听与任务监听同名也不影响
                    ITriggerListener triggerListener = new HelloJob();
                    var triListener = scheduler.ListenerManager.GetTriggerListener(triggerListener.Name);
                    IMatcher<TriggerKey> triMatcher = KeyMatcher<TriggerKey>.KeyEquals(trigger.Key);
                    if (triListener != null)
                    {
                        scheduler.ListenerManager.AddTriggerListenerMatcher(triggerListener.Name, triMatcher);
                    }
                    else
                        scheduler.ListenerManager.AddTriggerListener(triggerListener, triMatcher);

                    //可以设置关闭该调度
                    //await Task.Delay(TimeSpan.FromSeconds(5));
                    //await scheduler.Shutdown();
                }
                catch (SchedulerException se)
                {
                    Console.WriteLine(se);
                }
            }
        }

        //实现IJobListener 接口，实现 ITriggerListener 接口，这里和 IJob逻辑放在了一起
        public class HelloJob : IJob, IJobListener, ITriggerListener
        {
            private string appKey;
            private string appName;
            private string appApi;

            public string Name
            {
                get;
            }
            public HelloJob()
            {
                this.Name = this.GetType().ToString();
            }
            public HelloJob(string name)
            {
                this.Name = name;
            }
            public async Task Execute(IJobExecutionContext context)
            {
                JobKey jkey = context.JobDetail.Key;
                TriggerKey tKey = context.Trigger.Key;

                JobDataMap dataMap = context.MergedJobDataMap;
                appKey = dataMap.GetString("appKey");   //通过键值获取数据
                appName = dataMap.GetString("appName");
                appApi = dataMap.GetString("api");
                await Console.Error.WriteLineAsync(
                    string.Format("[{0}]开始推送：\nJobKey:{1}\nTriggerKey:{2}\nAppKey:{3} appName: {4} , and AppAPI: {5}"
                    , DateTime.Now.ToLongTimeString(), jkey, tKey, appKey, appName, appApi));
            }
            #region IJobListener
            public async Task JobExecutionVetoed(IJobExecutionContext context, CancellationToken cancellationToken = default(CancellationToken))
            {
                await Console.Error.WriteLineAsync(string.Format("[{0}]任务监听，name:{1}|任务执行失败重新执行。"
                    , DateTime.Now.ToLongTimeString(), Name));
                //任务执行失败，再次执行任务
                await Execute(context);
            }

            public async Task JobToBeExecuted(IJobExecutionContext context, CancellationToken cancellationToken = default(CancellationToken))
            {
                await Console.Error.WriteLineAsync(string.Format("[{0}]任务监听，name:{1}|准备执行任务。"
                    , DateTime.Now.ToLongTimeString(), Name));
            }

            public async Task JobWasExecuted(IJobExecutionContext context, JobExecutionException jobException, CancellationToken cancellationToken = default(CancellationToken))
            {
                await Console.Error.WriteLineAsync(string.Format("[{0}]任务监听，name:{1}|任务执行完成。"
                    , DateTime.Now.ToLongTimeString(), Name));
            }
            #endregion

            #region ITriggerListener
            public async Task TriggerComplete(ITrigger trigger, IJobExecutionContext context, SchedulerInstruction triggerInstructionCode, CancellationToken cancellationToken = default(CancellationToken))
            {
                await Console.Error.WriteLineAsync(string.Format("[{0}]触发器监听，name:{1}|触发器触发成功。"
                    , DateTime.Now.ToLongTimeString(), trigger.Key.Name));
            }

            public async Task TriggerFired(ITrigger trigger, IJobExecutionContext context, CancellationToken cancellationToken = default(CancellationToken))
            {
                await Console.Error.WriteLineAsync(string.Format("[{0}]触发器监听，name:{1}|触发器开始触发。"
                    , DateTime.Now.ToLongTimeString(), trigger.Key.Name));
            }

            public async Task TriggerMisfired(ITrigger trigger, CancellationToken cancellationToken = default(CancellationToken))
            {
                await Console.Error.WriteLineAsync(string.Format("[{0}]触发器监听，name:{1}|触发器触发失败。"
                    , DateTime.Now.ToLongTimeString(), trigger.Key.Name));
            }

            public async Task<bool> VetoJobExecution(ITrigger trigger, IJobExecutionContext context, CancellationToken cancellationToken = default(CancellationToken))
            {
                await Console.Error.WriteLineAsync(string.Format("[{0}]触发器监听，name:{1}|可以阻止该任务执行，这里不设阻拦。"
                    , DateTime.Now.ToLongTimeString(), trigger.Key.Name));
                // False 时，不阻止该任务。True 阻止执行
                return false;
            }
            #endregion
        }
    }
}

```

### 实验效果

如截图所示，这里只执行一次。注意观察：触发器监听优先级 > 任务监听优先级

![](https://replay923.github.io/BlogResources/Quartz/quartzListener.png)

### 上篇

[上篇:作业调度框架Quartz.NET-01-快速入门](https://replay923.github.io/2018/08/14/Quartz/)


## Thanks

[Quartz.NET](https://www.quartz-scheduler.net/index.html)

[张善友的博客](http://www.cnblogs.com/shanyou/archive/2007/08/25/QuartzNETtutorial.html)