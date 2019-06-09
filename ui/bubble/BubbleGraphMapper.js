class BubbleGraphMapper {
  constructor (graph) {
    this.graph = graph
  }

  toBubbleGraph () {
    const rootModules = this.getRootModules()

    const bubble = {
      name: 'Dependencies',
      children: []
    }

    /**
     * add roots
     */
    for (const i in rootModules) {
      const moduleName = rootModules[i]

      bubble.children.push({
        name: moduleName,
        children: []
      })
    }

    // get children of roots, and children of children...
    for (const i in bubble.children) {
      const child = bubble.children[i]

      child.children = this.getChildren(child.name)
    }

    return bubble
  }

  /**
   * get children of children
   * @param moduleName module to check its dependencies
   */
  getChildren (moduleName) {
    const children = []

    const dependencies = this.graph[moduleName]
    for (const i in dependencies) {
      const dependency = dependencies[i]
      if (dependency === moduleName) { // avoid forever loop if dependency is the same with module name
        continue
      }

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
  getRootModules () {
    const rootModules = []

    for (const i in this.graph) {
      if (!this.isDependency(i)) {
        rootModules.push(i)
      }
    }

    return rootModules
  }

  isDependency (moduleName) {
    for (const i in this.graph) {
      const dependencies = this.graph[i]
      for (const j in dependencies) {
        const dependency = dependencies[j]

        if (dependency === moduleName) {
          return true
        }
      }
    }

    return false
  }
}

module.exports = BubbleGraphMapper