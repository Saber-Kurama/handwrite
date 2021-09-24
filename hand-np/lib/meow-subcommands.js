const meow = require('meow')
const prop = k => o => o[k]
const pipe = (...fns) => x => [...fns].reduce((acc, f) => f(acc), x)
const pipe1 = (...fns) => {
  return (x) => {
    return [...fns].reduce((acc, f) => {
      console.log('acc', acc)
      console.log('f', f)
      return f(acc)
    }, x)
  }
}

const siconstore = () => ({
    cli: meow(`
        Usage
        $ siconstore [command]
        Available Commands
        $ siconstore publish
        $ siconstore latest
    `),
    action: cli => cli.showHelp(),
})
siconstore.publish = () => ({
    cli: meow(`
        Usage
            $ siconstore publish
        Description
            Uses stdin to publish json to app-store
    `),
    action: cli => {
        console.log(cli.flags)
    }
})

const getSubcommand = (cliObject, level) => pipe(
    prop('input'),
    prop(level),
    name => prop(name)(cliObject),
)(prop('cli')(cliObject()))

const getSubcommand1 = (cliObject, level) => {
  const cliObject1 = cliObject() 
  // console.log('cliObject1', cliObject1)
  const props = prop('cli')(cliObject1)
  const p = pipe1(prop('input'), prop(level), name => prop(name)(cliObject))(props)
  console.log('p', p)
  return 
}
const cli = (cliObject, level = 0) => {
    const { cli: nextCli, action } = cliObject()
    const subCommand = getSubcommand1(cliObject, level)
    // const subCommand = getSubcommand(cliObject, level)
    // return subCommand ? 
    //     cli(subCommand, level + 1) :
    //     nextCli.flags.help ?
    //         nextCli.showHelp() :
    //         action(nextCli)
}

cli(siconstore)