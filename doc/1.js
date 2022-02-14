// 插件的运行机制
let { AsyncParallelHook } = require('tapable')
let hook1 = { key: 'click', fn: () => { console.log('click1'); return Promise.resolve('click1') }}
let hook2 = { key: 'click', fn: () => { console.log('click2'); return Promise.resolve('click2') }}
let hook3 = { key: 'mousemove', fn: () => { console.log('mousemove3'); return Promise.resolve('mousemove3') }}
let hook4 = { key: 'mousemove', fn: () => { console.log('cmousemove4'); return Promise.resolve('cmousemove4') }}

// 有很多插件，每个插件可能会注册多个hook，每个hook的事件类型是不一样的
let hooksByPluginId = {
  'plugin1': [hook1, hook3],
  'plugin2': [hook2, hook4]
}

let hooks = {}
// 按事件类型来分组
Object.keys(hooksByPluginId).forEach(pluginId => {
  let pluginHooks = hooksByPluginId[pluginId]
  pluginHooks.forEach(hook => {
    const { key } = hook
    hook.pluginId = pluginId // 这个hook是哪个插件挂载上来的
    hooks[key] = (hooks[key] || []).concat(hook)
  })
})
// console.log(hooks)

async function applyPlugins (opts) {
  let hooksForKey = hooks[opts.key] || []
  let tEvent = new AsyncParallelHook(['_'])
  for (const hook of hooksForKey) {
    tEvent.tapPromise({ name: hook.pluginId }, hook.fn )
  }
  return await tEvent.promise()
}
applyPlugins({key: 'click'})