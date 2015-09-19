# daterangepicker
a simple daterangepicker

## 为何要做这个
现在碰到的棘手的问题就是一个angular项目和react项目都需要用到时间选择器，然而找了下，daterangepicker基本上都是基于某种框架实现的，功能也不是很完全，想要fork别人的代码，然而npm之类不给力，还要看源码。干脆=_=自己写个吧。

## TODO
1. 基于moment.js实现日历控件(已完成！)
2. 不依赖任何控件，但可以方便的转换为angular directive或者react component
3. 实现时间单选(已完成！)
4. 实现时间区域选择
5. 规定时间区域后，不改变间隔天数的情况下改变起止时间
