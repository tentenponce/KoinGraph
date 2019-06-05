const fs = require('fs')

class FindModuleService {

  getModules(file) {
    /**
     * get array of single {...} from the minified file.
     * 
     * Example:
     * 
     * input minified file content: ...single{componentA(get(), get())}single{componentB(get(),get())}...
     * output array: ['single{componentA(get(), get())}', 'single{componentB(get(),get())}']
     */
    let singles = this.getFileContents(file).match(/single\{((?!single).)*\(((?!single).)*\)\}/g)

    /**
     * get the module names by removing `single{` and terminates on the first open parenthesis.
     * 
     * input array: ['single{componentA(get(), get())}', 'single{componentB(get(),get())}']
     * output array: ['componentA', 'componentB']
     */
    let moduleFiles = []
    for (var i in singles) {
      let single = singles[i].replace('single{', '') // remove `single{`.
      moduleFiles.push(single.match(/[^(]+(?:(?!\().)/)[0]) // get word up until first open parenthesis.
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
     */
    let className = this.getFileContents(file).match(/class[^)]+/)

    /** 
     * remove the class name to get dependencies only and split it.
     * 
     * Example:
     * input: classComponentA(dependencyA: DependencyA, dependencyB: DependencyB
     * output: ['dependencyA: DependencyA', 'dependencyB: DependencyB']
     */
    let rawDependencies = className[0].replace(/class.+\(/g, '').split(',')

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