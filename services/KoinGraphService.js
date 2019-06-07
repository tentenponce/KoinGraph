const FindModuleService = require('./FindModuleService')
const fileHound = require('filehound')

class KoinGraphService {

  constructor(param) {
    this.param = param
    this.findModuleService = new FindModuleService()
    this.projFiles = this.getKotlinFiles()
  }

  buildGraph() {
    /* check each file for modules registered on Koin and put it
    in a single array */
    let modules = []
    for (var i in this.projFiles) {
      let file = this.projFiles[i]
      modules = modules.concat(this.findModuleService.getModules(file))
    }

    /* get dependencies of each module and build graph */
    let graph = {}
    for (var i in modules) {
      let module = modules[i]
      let dependencies = this.getModuleDependencies(module)

      // register module to the graph and its dependencies
      graph[module] = dependencies

      // register dependencies on the graph if they not exist
      for (var k in dependencies) {
        let dependency = dependencies[k]

        if (!graph[dependency]) {
          graph[dependency] = this.getModuleDependencies(dependency)
        }
      }
    }

    return graph
  }

  getModuleDependencies(moduleName) {
    // find the actual file of the module, and get its dependencies
    for (var j in this.projFiles) {
      let file = this.projFiles[j]

      if (file.indexOf(moduleName + '.kt') >= 0) {
        // get the dependencies of the module
        return this.findModuleService.getClassDependencies(file)
      }
    }
  }

  /**
   * get all kotlin files from the project path.
   */
  getKotlinFiles() {
    return fileHound.create()
      .paths(this.param.path)
      .ext('kt')
      .findSync()
  }
}

module.exports = KoinGraphService