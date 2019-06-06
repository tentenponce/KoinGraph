const FindModuleService = require('./FindModuleService')
const KoinModule = require('../models/KoinModule')
const fileHound = require('filehound')

class KoinGraphService {

  constructor(param) {
    this.param = param
    this.findModuleService = new FindModuleService()
  }

  buildGraph() {
    /* check each file for modules registered on Koin and put it
    in a single array */
    let projFiles = this.getKotlinFiles()

    let modules = []
    for (var i in projFiles) {
      let file = projFiles[i]
      modules = modules.concat(this.findModuleService.getModules(file))
    }

    /* get dependencies of each module and build graph */
    let graph = {}
    for (var i in modules) {
      let module = modules[i]

      // find the actual file of the module, and get its dependencies
      for (var j in projFiles) {
        let file = projFiles[j]

        if (file.indexOf(module + '.kt') >= 0) {
          // get the dependencies of the module
          let dependencies = this.findModuleService.getClassDependencies(file)

          // register module to the graph and its dependencies
          graph[module] = dependencies

          // register dependencies on the graph if they not exist
          for (var k in dependencies) {
            let dependency = dependencies[k]

            if (!graph[dependency]) {
              graph[dependency] = []
            }
          }
          
          break
        }
      }
    }

    return graph
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