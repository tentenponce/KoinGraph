class LinkNodeGraphMapper {
  constructor (graph) {
    this.graph = graph
  }

  toLinkNodeGraph () {
    return {
      nodes: this.buildNodes(),
      links: this.buildLinks()
    }
  }

  buildNodes () {
    const nodes = []
    for (const i in this.graph) {
      const dependencies = this.graph[i]
      const node = {
        id: i,
        group: dependencies.length,
        label: i,
        level: dependencies.length
      }

      nodes.push(node)
    }

    return nodes
  }

  buildLinks () {
    const links = []
    for (const i in this.graph) {
      const dependencies = this.graph[i]

      for (const j in dependencies) {
        const dependency = dependencies[j]
        const link = {
          target: i,
          source: dependency,
          strength: this.calcStrength(dependency)
        }
  
        links.push(link)
      }
    }

    return links
  }

  /**
   * calculate strength of link depends if the module has dependencies
   */
  calcStrength (dependency) {
    for (const i in this.graph) {
      if (i === dependency) {
        return (this.graph[i].length > 0) ? 1 : 0
      }
    }
  }
}

module.exports = LinkNodeGraphMapper