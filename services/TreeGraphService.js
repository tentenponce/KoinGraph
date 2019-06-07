class TreeGraphService {

  constructor(graph) {
    this.graph = graph
  }

  buildTree() {
    let levels = this.buildLevels()

    let tree = {
      name: 'Dependencies',
      value: 15,
      type: 'red',
      level: 'blue',
      children: []
    }

    // push level 0 modules initially
    for (var i in levels[0]) {
      let moduleName = levels[0][i]

      tree.children.push({
        name: moduleName,
        value: 15,
        type: 'red',
        level: 'blue',
        children: []
      })
    }

    // get children of children of children...
    for (var i in tree.children) {
      let child = tree.children[i]

      child.children = this.getChildren(child.name)
    }

    return tree
  }

  getChildren(moduleName) {
    let children = []

    let dependencies = this.graph[moduleName]
    for (var i in dependencies) {
      let dependency = dependencies[i]

      let child = {
        name: dependency,
        children: this.getChildren(dependency)
      }

      if (child.children.length <= 0) {
        child = {
          name: dependency
        }
      }

      children.push(child)      
    }

    return children
  }

  buildLevels() {
    let levels = []
    for (var i in this.graph) {
      let moduleLevel = this.getModuleLevel(i, 0)

      if (!levels[moduleLevel]) {
        levels[moduleLevel] = []
      }

      let currentLevel = this.getCurrentLevel(levels, i)
      if (currentLevel.level >= 0 &&
        moduleLevel > currentLevel.level) {
        levels[currentLevel.level].splice(currentLevel.index, 1) // remove it to its current level
      }

      levels[moduleLevel].push(i)
    }

    return levels
  }

  getCurrentLevel(levels, moduleName) {
    for (var i in levels) {
      let level = levels[i]

      for (var j in level) {
        if (level[j] == moduleName) {
          return { level: i, index: j }
        }
      }
    }

    return { level: -1, index: -1 }
  }

  getModuleLevel(moduleName, currentLevel) {
    for (var i in this.graph) {
      let dependencies = this.graph[i]
      for (var j in dependencies) {
        let dependency = dependencies[j]

        if (dependency == moduleName) {
          return this.getModuleLevel(i, ++currentLevel)
        }
      }
    }

    return currentLevel
  }
}

module.exports = TreeGraphService