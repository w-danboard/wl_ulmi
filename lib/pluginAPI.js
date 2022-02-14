class PluginAPI {
  constructor (opts) {
    this.id = opts.id
    this.service = opts.service
  }
  // 注册命令
  registerCommand(command) {
    // this.service.commands.dev = { name, description, fn }
    this.service.commands[command.name] = command
  }
  // 注册钩子
  register (hook) {
    this.service.hooksByPluginId[this.id] = (
      this.service.hooksByPluginId[this.id] || []
    ).concat(hook)
  }
}

module.exports = PluginAPI