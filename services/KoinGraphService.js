class KoinGraphService {

  constructor(projFiles, findModuleService, fileSystemService) {
    this.projFiles = projFiles
    this.findModuleService = findModuleService
    this.fileSystemService = fileSystemService
  }

  buildGraph() {
    /* check each file for modules registered on Koin and put it
    in a single array */
    let modules = []
    for (var i in this.projFiles) {
      let file = this.projFiles[i]
      let fileContent = this.fileSystemService.readFile(file)
      modules = modules.concat(this.findModuleService.getModules(fileContent))
    }

    /* get dependencies of each module and build graph */
    let graph = {}
    for (var i in modules) {
      let module = modules[i]
      let dependencies = this.getModuleDependencies(module)

      // register module to the graph and its dependencies
      if (dependencies.length > 0) {
        graph[module] = dependencies
      }

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
        let fileContent = this.fileSystemService.readFile(file)
        return this.findModuleService.getClassDependencies(fileContent)
      }
    }

    return []
  }
}

module.exports = KoinGraphService