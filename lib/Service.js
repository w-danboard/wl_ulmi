let { AsyncParallelHook } = require('tapable')
let PluginAPI = require('./pluginAPI')


class Service {
  constructor (opts) {
    this.commands = {}          // 存放着所有的命令和他们的对实现 {dev: { name, description, fn }}
    this.plugins = opts.plugins // [{ id: 'dev', apply: pluginDev }]
    this.hooksByPluginId = {}   // 按插件ID划分 {插件ID, [hook]}
    this.hooks = {}             // 按类型划分 { 'onGenerateFiles':[hook] }
  }
  async init () {
    // 挂载所有插件
    for (let plugin of this.plugins) {
      let pluginAPI = new PluginAPI({ id: plugin.id, service: this })
      pluginAPI.onGenerateFiles = (fn) => {
        // 注册钩子
        pluginAPI.register({
          pluginId: plugin.id,
          key: 'onGenerateFiles',
          fn
        })
      }
      plugin.apply(pluginAPI)
    }
    Object.keys(this.hooksByPluginId).forEach(pluginId => {
      let pluginHooks = this.hooksByPluginId[pluginId]
      pluginHooks.forEach(hook => {
        const { key } = hook
        hook.pluginId = pluginId
        this.hooks[key] = (this.hooks[key] || []).concat(hook)
      })
    })
  }
  // 执行插件
  async applyPlugins (opts) {
    let hooksForKey = this.hooks[opts.key] || []
    // 源码中使用的串行钩子AsyncSeriesWaterfallHook
    let tEvent = new AsyncParallelHook(['_'])
    for (const hook of hooksForKey) {
      tEvent.tapPromise({ name: hook.pluginId }, hook.fn )
    }
    return await tEvent.promise()
  }
  async run (args) {
    this.init() // 初始化 挂载插件
    return this.runCommand(args)
  }
  async runCommand ({ name }) {
    const command = this.commands[name]
    return command.fn()
  }
}

module.exports = Service