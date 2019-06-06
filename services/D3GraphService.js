const fs = require('fs')

class D3GraphService {

  constructor(graph) {
    this.graph = graph

    fs.writeFileSync('ui/koin-graph.js', '')
  }

  buildNodes() {
    let nodes = []
    for (var i in this.graph) {
      let graphNode = this.graph[i]
      let node = {
        id: graphNode.name,
        group: graphNode.edges.length,
        label: graphNode.name,
        level: graphNode.edges.length
      }

      nodes.push(node)
    }

    fs.appendFileSync('ui/koin-graph.js', 'var nodes = ' + JSON.stringify(nodes, null, 2));
  }

  buildLinks() {
    let links = []
    for (var i in this.graph) {
      let graphNode = this.graph[i]
      for (var j in graphNode.edges) {
        let edge = graphNode.edges[j]
        let link = {
          target: edge.name,
          source: graphNode.name,
          strength: graphNode.edges.length
        }

        // check first if link already existed
        var isExists = false
        for (var k in links) {
          if (link.target == links[k].source &&
            link.source == links[k].target) {
              isExists = true
              break
            }
        }

        if (!isExists) {
          links.push(link)
        }
      }
    }
    fs.appendFileSync('ui/koin-graph.js', '\nvar links = ' + JSON.stringify(links, null, 2));
  }
}

module.exports = D3GraphService