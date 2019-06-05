const FindModuleService = require('./FindModuleService')
const fileHound = require('filehound')

class KoinGraphService {

  constructor(param) {
    this.param = param
    this.findModuleService = new FindModuleService()
  }

  buildGraph() {
    let projFiles = this.getKotlinFiles()

    let modules = []
    for (var i in projFiles) {
      let file = projFiles[i]
      modules = modules.concat(this.findModuleService.getModules(file))
    }
  }

  getKotlinFiles() {
    return fileHound.create()
      .paths(this.param.path)
      .ext('kt')
      .findSync()
  }
}

module.exports = KoinGraphService