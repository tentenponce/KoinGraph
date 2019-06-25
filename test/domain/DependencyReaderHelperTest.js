const { expect } = require('chai')
const sinon = require('sinon')

const DependencyReaderHelper = require('../../domain/DependencyReaderHelper')

const helper = new DependencyReaderHelper()

describe('getModules()', () => {
  it('should return modules with or without dependencies', () => {
    const fileContent = `
      single { ComponentA(get(), get()) }
      single { ComponentB() }
      factory { ComponentC() } 
      viewModel { ViewModelA(get(), get(), get(), get()) }
      viewModel { ViewModelB() }
    `

    expect(helper.getModulesFromFile(fileContent)).to.include.members(
      ['ComponentA', 'ComponentB', 'ComponentC', 'ViewModelA', 'ViewModelB'])
  })

  it('should return aliases', () => {
    const fileContent = `
      single { ComponentA(get(), get()) as ComponentAlias }
      single<ComponentBAlias> { ComponentB() }
      factory<ComponentCAlias> { ComponentC() }
      viewModel { ViewModelA(get(), get(), get(), get()) }
      viewModel { ViewModelB() }
    `

    expect(helper.getModulesFromFile(fileContent)).to.include.members(
      ['ComponentAlias', 'ComponentBAlias', 'ComponentCAlias', 'ViewModelA', 'ViewModelB'])
  })
})

describe('getClassDependencies()', () => {
  it('should return dependencies of the class', () => {
    const fileContent = `
      import blah.blah.blah
      import com.android.blah

      class ComponentA(dependencyA: DependencyA, dependencyB: DependencyB) {
        more codesss
      }
    `

    expect(helper.getDependenciesFromFile(fileContent)).to.include.members(['DependencyA', 'DependencyB'])
  })

  it('should return empty array of dependencies if class has none', () => {
    const fileContent = `
      import blah.blah.blah
      import com.android.blah

      class ComponentA {
        more codesss
      }
    `

    expect(helper.getDependenciesFromFile(fileContent)).to.deep.equal([])
  })
})