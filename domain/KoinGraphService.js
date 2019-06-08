class KoinGraphService {

  constructor(fileSystemBridge,
    dependencyReaderHelper,
    minifierHelper,
    classCastHelper) {
    this.fileSystemBridge = fileSystemBridge
    this.dependencyReaderHelper = dependencyReaderHelper
    this.minifierHelper = minifierHelper
    this.classCastHelper = classCastHelper
  }

  buildGraph(projFiles) {
    let modules = this.getProjectModules(projFiles)

    /* get dependencies of each module and build graph */
    let graph = {}
    for (var i in modules) {
      let module = modules[i]
      let dependencies = this.getModuleDependencies(projFiles, module)

      // register module to the graph and its dependencies
      if (dependencies.length > 0) {
        graph[module] = dependencies
      }

      // register dependencies on the graph if they not exist
      for (var k in dependencies) {
        let dependency = dependencies[k]

        if (!graph[dependency]) {
          graph[dependency] = this.getModuleDependencies(projFiles, dependency)
        }
      }
    }

    return graph
  }

  getProjectModules(projFiles) {
    /* check each file for modules registered on Koin and put it
    in a single array */
    let modules = []
    for (var i in projFiles) {
      let file = projFiles[i]
      let fileContent = this.minifierHelper.minifyString(this.fileSystemBridge.readFile(file))
      modules = modules.concat(this.dependencyReaderHelper.getModulesFromFile(fileContent))
    }

    return modules
  }

  getModuleDependencies(projFiles, moduleName) {
    // find the actual file of the module, and get its dependencies
    for (var j in projFiles) {
      let file = projFiles[j]

      let fileContent = this.minifierHelper.minifyString(this.fileSystemBridge.readFile(file))

      if (file.indexOf(moduleName + '.kt') >= 0 ||
        this.classCastHelper.isClassCast(fileContent, moduleName)) {
        // get the dependencies of the module
        return this.dependencyReaderHelper.getDependenciesFromFile(fileContent)
      }
    }

    return []
  }
}

module.exports = KoinGraphService