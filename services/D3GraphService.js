const fs = require('fs')

class D3GraphService {

  constructor(graph) {
    this.graph = graph

    fs.writeFileSync('ui/koin-graph.js', '')
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

    fs.appendFileSync('ui/koin-graph.js', 'var nodes = ' + JSON.stringify(nodes, null, 2));
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

    fs.appendFileSync('ui/koin-graph.js', '\nvar links = ' + JSON.stringify(links, null, 2));
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