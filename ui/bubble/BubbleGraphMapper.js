class BubbleGraphMapper {

  constructor(graph) {
    this.graph = graph
  }

  toBubbleGraph() {
    let rootModules = this.getRootModules()

    let bubble = {
      name: 'Dependencies',
      children: []
    }

    /**
     * add roots
     */
    for (var i in rootModules) {
      let moduleName = rootModules[i]

      bubble.children.push({
        name: moduleName,
        children: []
      })
    }

    // get children of roots, and children of children...
    for (var i in bubble.children) {
      let child = bubble.children[i]

      child.children = this.getChildren(child.name)
    }

    return bubble
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
        children: this.getChildren(dependency),
        size: this.getChildren(dependency).length * 10
      }

      /**
       * if no child, remove children node
       */
      if (child.children.length <= 0) {
        child = {
          name: dependency,
          size: 10
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

module.exports = BubbleGraphMapper