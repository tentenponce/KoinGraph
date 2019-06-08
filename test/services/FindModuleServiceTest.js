const expect = require('chai').expect
const sinon = require('sinon')

const FindModuleService = require('../../services/FindModuleService')

const service = new FindModuleService()

describe('getModules()', () => {
  it('should return modules with dependencies', () => {
    let fileContent = `
      single { ComponentA(get(), get()) }
      single { ComponentB(get(), get(), get(), get()) }
      viewModel { ViewModelA(get(), get(), get(), get()) }
    `

    expect(service.getModules(fileContent)).to.include.members(['ComponentA', 'ComponentB', 'ViewModelA'])
  })

  it('should return modules without dependencies', () => {
    let fileContent = `
      single { ComponentA(get(), get()) }
      single { ComponentB() }
      viewModel { ViewModelA(get(), get(), get(), get()) }
      viewModel { ViewModelB() }
    `

    expect(service.getModules(fileContent)).to.include.members(['ComponentA', 'ComponentB', 'ViewModelA', 'ViewModelB'])
  })
})

describe('getClassDependencies()', () => {
  it('should return dependencies of the class', () => {
    let fileContent = `
      import blah.blah.blah
      import com.android.blah

      class ComponentA(dependencyA: DependencyA, dependencyB: DependencyB) {
        more codesss
      }
    `

    expect(service.getClassDependencies(fileContent)).to.include.members(['DependencyA', 'DependencyB'])
  })

  it('should return empty array of dependencies if class has none', () => {
    let fileContent = `
      import blah.blah.blah
      import com.android.blah

      class ComponentA {
        more codesss
      }
    `

    expect(service.getClassDependencies(fileContent)).to.deep.equal([])
  })
})