import Fuse from 'fuse.js'
import {isDefineActionCall, getPropertiesOfSecondArgumentOf, findInProperties} from '../util'

export default function (context) {
  const errors = []

  const fsaKeys = ['payload', 'meta', 'error', 'type']
  const fuse = new Fuse(fsaKeys.map(k => { return {k} }), {keys: ['k'], id: 'k'})
  const creatorName = context.options[0] || 'creator'

  /**
   * Report errors
   */
  function reportErrors () {
    errors.forEach(({node, closest}) => {
      let message = `Action key \'${node.key.name}\' is invalid`
      if (closest) {
        message += `. Do you mean "${closest}"?`
      }
      context.report(node, message)
    })
  }

  function checkKeys (keys) {
    keys.forEach(prop => {
      if (fsaKeys.indexOf(prop.key.name) === -1) {
        const closest = fuse.search(prop.key.name)[0]
        errors.push({node: prop, closest})
      }
    })
  }

  return {
    CallExpression (node) {
      if (!isDefineActionCall(node)) {
        return
      }
      const properties = getPropertiesOfSecondArgumentOf(node)
      const creator = findInProperties(properties, creatorName)
      if (!creator || !creator.value || !creator.value.body || !creator.value.body.body || !creator.value.body.body) {
        return
      }
      let action = creator.value.body.body.find(statement => statement.type === 'ReturnStatement')
      if (!action || action.argument.type !== 'ObjectExpression') {
        return
      }
      checkKeys(action.argument.properties)
      reportErrors()
    }
  }
}

export const schema = [{
  type: 'string'
}]
