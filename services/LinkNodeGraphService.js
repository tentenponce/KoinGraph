class D3GraphService {

  constructor(graph) {
    this.graph = graph
  }

  build() {
    return {
      nodes: this.buildNodes(),
      links: this.buildLinks()
    }
  }

  buildNodes() {
    let nodes = []
    for (var i in this.graph) {
      let dependencies = this.graph[i]
      let node = {
        id: i,
        group: dependencies.length,
        label: i,
        level: dependencies.length
      }

      nodes.push(node)
    }

    return nodes
  }

  buildLinks() {
    let links = []
    for (var i in this.graph) {
      let dependencies = this.graph[i]

      for (var j in dependencies) {
        let dependency = dependencies[j]
        let link = {
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
  calcStrength(dependency) {
    for (var i in this.graph) {
      if (i == dependency) {
        return (this.graph[i].length > 0) ? 1 : 0
        break
      }
    }
  }
}

module.exports = D3GraphService