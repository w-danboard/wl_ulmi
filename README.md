### 1.约定式路由

> UmiJS是可扩展的企业级前端应用框架，Umi以路由为基础，并以此进行功能扩展。然后配以生命周期完善的插件体系，支持各种功能扩展和业务需求

### UMI的实现思路

- 1. 启动一个node程序 bin/umi.js -> cli.js
- 2. 启动一个Service
      - 扫描pages目录，根据它生成临时文件夹里的文件
      - 启动这些临时文件夹中的文件

### 为什么由pluginId和key两个维度 （为了触发的时候执行回调比较方便）

一个插件可能会注册多个钩子，那么钩子的事件名称肯定是不一样的，
```javascript
{ plugin1: [{key: 'click', fn}, {key: 'mouseMove', fn}] }
{ plugin2: [{key: 'click', fn}, {key: 'mouseMove', fn}] }
```
但是触发的时候是按事件名称来触发的
let hooks = { click: [fn, fn], moseMove: [fn, fn] }
applyPlugin({key: 'click'})

我们浏览器注册事件的时候
```javascript
function on () {
  onclick()
  onmousemove()
  onmouseover()
}
```

### 整体流程、

1、先生成umi文件夹中的临时文件
2、启动webpack去打包这个临时生成的文件，并启动项目去预览

### 关于fs.readFileSync

```javascript
// devMiddleware
app.use(function (req, res, next) {
  // 读取产出的文件并返回
  let content = fs.readFileSync('./dist/main.js')
  res.send(content)
})
```

### 关于UmiJS中的插件

1、编译时插件
2、运行时插件


### 总结

1. 启动一个node程序
2. 启动一个service
3. 执行service的run方法
4. 执行service的init方法挂载所有插件 (Service和PluginAPI是插件的核心方法)
5. 执行service的applyPlugins方法执行插件
6. 写入文件
7. 启动临时文件服务