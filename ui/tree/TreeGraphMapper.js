class TreeGraphMapper {

  constructor(graph) {
    this.graph = graph
  }

  toTreeGraph() {
    let rootModules = this.getRootModules()

    let tree = {
      name: 'Dependencies',
      children: []
    }

    /**
     * add roots
     */
    for (var i in rootModules) {
      let moduleName = rootModules[i]

      tree.children.push({
        name: moduleName,
        children: []
      })
    }

    // get children of roots, and children of children...
    for (var i in tree.children) {
      let child = tree.children[i]

      child.children = this.getChildren(child.name)
    }

    return tree
  }

  /**
   * get children of children
   * @param moduleName module to check its dependencies
   */
  getChildren(moduleName) {
    let children = []

    let dependencies = this.graph[moduleName]
    for (var i in dependencies) {
      let dependency = dependencies[i]

      let child = {
        name: dependency,
        children: this.getChildren(dependency)
      }

      /**
       * if no child, remove children node
       */
      if (child.children.length <= 0) {
        child = {
          name: dependency
        }
      }

      children.push(child)
    }

    return children
  }

  /**
   * get all modules that is not a dependency (it means that is a root)
   */
  getRootModules() {
    let rootModules = []

    for (var i in this.graph) {
      if (!this.isDependency(i)) {
        rootModules.push(i)
      }
    }

    return rootModules
  }

  isDependency(moduleName) {
    for (var i in this.graph) {
      let dependencies = this.graph[i]
      for (var j in dependencies) {
        let dependency = dependencies[j]

        if (dependency == moduleName) {
          return true
        }
      }
    }

    return false
  }
}

module.exports = TreeGraphMapper