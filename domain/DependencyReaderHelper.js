const MinifierUtil = require('./MinifierUtil')

class DependencyReaderHelper {

  getModulesFromFile(fileContent) {
    /**
     * get array of single{...} and viewModel{...} from the minified file.
     * 
     * Example:
     * 
     * input minified file content: ...single{componentA(get(), get())}single{componentB(get(),get())}...
     * output array: ['single{componentA(get(), get())}', 'single{componentB(get(),get())}']
     */
    let minifiedFile = MinifierUtil.minifyString(fileContent)
    let modules = minifiedFile.match(/(single|viewModel)((?!(single|viewModel)).)*\(((?!(single|viewModel)).)*\}/g)

    /**
     * get the module names by removing `single{` and `viewModel{` and terminates on the first open parenthesis.
     * 
     * input array: ['single{componentA(get(), get())}', 'single{componentB(get(),get())}']
     * output array: ['componentA', 'componentB']
     * 
     * if input has an alias, get the alias instead of the actual class name.
     * 
     * input array: ['single{componentA(get(), get())asAnotherClass}', 'single{componentB(get(),get())}']
     * output array: ['AnotherClass', 'componentB']
     */
    let moduleFiles = []
    for (var i in modules) {
      let moduleName = modules[i]
      if (!this.isAlias(moduleName)) {
        let moduleNode = moduleName.replace('single{', '').replace('viewModel{', '') // remove `single{` and `viewModel{`.
        moduleFiles.push(moduleNode.match(/[^(]+(?:(?!\().)/)[0]) // get word up until first open parenthesis.
      } else {
        /* extract alias */
        if (moduleName.indexOf('single<') >= 0 || moduleName.indexOf('viewModel<') >= 0) { // if alias is within <>
          moduleFiles.push(moduleName.substring(moduleName.indexOf('<') + 1, moduleName.indexOf('>')))
        } else { // if alias is at the end. eg: ComponentA() as ComponentAlias
          moduleFiles.push(moduleName.substring(moduleName.lastIndexOf(')') + 3, moduleName.length - 1))
        }
      }
    }

    return moduleFiles
  }

  getDependenciesFromFile(fileContent) {
    /**
     * get class name with its dependencies.
     * 
     * Example:
     * 
     * input minified content: import....classComponentA(dependencyA: DependencyA, dependencyB: DependencyB)....
     * output: classComponentA(dependencyA: DependencyA, dependencyB: DependencyB
     * 
     * input without dependency: import....classComponentA{....
     * output : classComponentA
     */
    let className = MinifierUtil.minifyString(fileContent).match(/class[^{)]+/)

    /** 
     * remove the class name to get dependencies only and split it.
     * 
     * Example:
     * input: classComponentA(dependencyA: DependencyA, dependencyB: DependencyB
     * output: ['dependencyA: DependencyA', 'dependencyB: DependencyB']
     */
    let rawDependencies
    if (className && className[0].indexOf('(') > 0) {
      rawDependencies = className[0].replace(/class.+\(/g, '').split(',')
    } else {
      rawDependencies = []
    }

    let dependencies = []
    for (var i in rawDependencies) {
      let dependency = rawDependencies[i]

      /**
       * get dependency class type.
       * 
       * Example:
       * input: dependencyA: DependencyA
       * output: DependencyA
       */
      let dependencyType = dependency.replace(/.+:/, '')

      if (dependencyType) {
        dependencies.push(dependencyType)
      }
    }

    return dependencies
  }

  isAlias(rawModule) {
    return rawModule.slice(-2) != ')}' ||
      rawModule.indexOf('single<') >= 0 ||
      rawModule.indexOf('viewModel<') >= 0
  }
}

module.exports = DependencyReaderHelper