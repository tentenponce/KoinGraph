const fs = require('fs')

class FindModuleService {

  getModules(file) {
    /**
     * get array of single{...} and viewModel{...} from the minified file.
     * 
     * Example:
     * 
     * input minified file content: ...single{componentA(get(), get())}single{componentB(get(),get())}...
     * output array: ['single{componentA(get(), get())}', 'single{componentB(get(),get())}']
     */
    let minifiedFile = this.getFileContents(file)
    let singles = minifiedFile.match(/single\{((?!single).)*\(((?!single).)*\)/g)
    let viewModels = minifiedFile.match(/viewModel\{((?!viewModel).)*\(((?!viewModel).)*\)/g)

    let modules = []
    if (viewModels) {
      modules = modules.concat(viewModels)
    }

    if (singles) {
      modules = modules.concat(singles)
    }

    /**
     * get the module names by removing `single{` and `viewModel{` and terminates on the first open parenthesis.
     * 
     * input array: ['single{componentA(get(), get())}', 'single{componentB(get(),get())}']
     * output array: ['componentA', 'componentB']
     */
    let moduleFiles = []
    for (var i in modules) {
      let moduleNode = modules[i].replace('single{', '').replace('viewModel{', '') // remove `single{` and `viewModel{`.
      moduleFiles.push(moduleNode.match(/[^(]+(?:(?!\().)/)[0]) // get word up until first open parenthesis.
    }

    return moduleFiles
  }

  getClassDependencies(file) {
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
    let className = this.getFileContents(file).match(/class[^{)]+/)

    /** 
     * remove the class name to get dependencies only and split it.
     * 
     * Example:
     * input: classComponentA(dependencyA: DependencyA, dependencyB: DependencyB
     * output: ['dependencyA: DependencyA', 'dependencyB: DependencyB']
     */
    let rawDependencies
    if (className[0].indexOf('(') > 0) {
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

  getFileContents(file) {
    let contents = fs.readFileSync(file, 'utf8') // read file
    return contents.replace(/\s/g, '') // minify file
  }
}

module.exports = FindModuleService