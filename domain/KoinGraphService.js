class KoinGraphService {
  constructor (fileSystemBridge,
    dependencyReaderHelper,
    classCastHelper) {
    this.fileSystemBridge = fileSystemBridge
    this.dependencyReaderHelper = dependencyReaderHelper
    this.classCastHelper = classCastHelper
  }

  buildGraph (projFiles) {
    const modules = this.getProjectModules(projFiles)

    /* get dependencies of each module and build graph */
    const graph = {}
    for (const i in modules) {
      const module = modules[i]
      const dependencies = this.getModuleDependencies(projFiles, module)

      // register module to the graph and its dependencies
      if (dependencies.length > 0) {
        graph[module] = dependencies
      }

      // register dependencies on the graph if they not exist
      for (const k in dependencies) {
        const dependency = dependencies[k]

        if (!graph[dependency]) {
          graph[dependency] = this.getModuleDependencies(projFiles, dependency)
        }
      }
    }

    return graph
  }

  getProjectModules (projFiles) {
    /* check each file for modules registered on Koin and put it
    in a single array */
    let modules = []
    for (const i in projFiles) {
      const file = projFiles[i]
      const fileContent = this.fileSystemBridge.readFile(file)
      modules = modules.concat(this.dependencyReaderHelper.getModulesFromFile(fileContent))
    }

    return modules
  }

  getModuleDependencies (projFiles, moduleName) {
    // find the actual file of the module, and get its dependencies
    for (const j in projFiles) {
      const file = projFiles[j]

      const fileContent = this.fileSystemBridge.readFile(file)
      if (file.indexOf(`${moduleName}.kt`) >= 0 ||
        this.classCastHelper.isClassCast(fileContent, moduleName)) {
        // get the dependencies of the module
        return this.dependencyReaderHelper.getDependenciesFromFile(fileContent)
      }
    }

    return []
  }
}

module.exports = KoinGraphService