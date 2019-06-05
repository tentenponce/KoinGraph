class KoinModule {

  constructor (name) {
    this.name = name
    this.edges = []
  }
  
  connect(koinModule) {
    this.edges.push(koinModule)
    koinModule.edges.push(this)
  }
}

module.exports = KoinModule