const { expect } = require('chai')
const sinon = require('sinon')

const DependencyReaderHelper = require('../../domain/DependencyReaderHelper')

const helper = new DependencyReaderHelper()

describe('getModulesFromFile()', () => {
  it('should return modules with or without dependencies', () => {
    const fileContent = `
      single { ComponentA(get(), get()) }
      single { ComponentB() }
      factory { FactoryA(get(), get()) }
      factory { FactoryB() } 
      viewModel { ViewModelA(get(), get(), get(), get()) }
      viewModel { ViewModelB() }
      scope(named<Activity>()) {
        scoped { ScopeA() }
        scoped { ScopeB() }
      }
    `

    expect(helper.getModulesFromFile(fileContent)).to.include.members(
      ['ComponentA', 'ComponentB', 'FactoryA', 'FactoryB', 'ViewModelA',
        'ViewModelB', 'ScopeA', 'ScopeB'])
  })

  it('should return aliases', () => {
    const fileContent = `
      single { ComponentA(get(), get()) as ComponentAlias }
      single<ComponentBAlias> { ComponentB() }
      factory { ComponentC() as ComponentCAlias }
      factory<ComponentDAlias> { ComponentD() }
      viewModel { ViewModelA(get(), get(), get(), get()) }
      viewModel { ViewModelB() }
      scope(named<Activity>()) {
        scoped<ScopeAAlias>{ ScopeA() }
        scoped<ScopeBAlias>{ ScopeB() }
      }
    `

    expect(helper.getModulesFromFile(fileContent)).to.include.members(
      ['ComponentAlias', 'ComponentBAlias', 'ComponentCAlias', 'ComponentDAlias',
        'ViewModelA', 'ViewModelB', 'ScopeAAlias', 'ScopeBAlias'])
  })
})

describe('getDependenciesFromFile()', () => {
  it('should return dependencies from a simple class', () => {
    const fileContent = `
      import blah.blah.blah
      import com.android.blah

      class ComponentA(dependencyA: DependencyA, dependencyB: DependencyB) {
        more codesss
      }
    `

    expect(helper.getDependenciesFromFile(fileContent)).to.include.members(['DependencyA', 'DependencyB'])
  })

  it('should return dependencies from a class with generics', () => {
    const fileContent = `
      import blah.blah.blah
      import com.android.blah

      class ComponentA<V>(dependencyA: DependencyA, dependencyB: DependencyB) : AppCompatActivity() {
        more codesss
      }
    `

    expect(helper.getDependenciesFromFile(fileContent)).to.include.members(['DependencyA', 'DependencyB'])
  })

  it('should return dependencies from a class with generics and its type', () => {
    const fileContent = `
      import blah.blah.blah
      import com.android.blah

      class ComponentA<V, T : BaseV<V>>(dependencyA: DependencyA, dependencyB: DependencyB) : AppCompatActivity() {
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