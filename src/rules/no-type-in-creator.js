import {isDefineActionCall, getPropertiesOfSecondArgumentOf, findInProperties} from '../util'

module.exports = function (context) {
  const errors = []

  const creatorName = context.options[0] || 'creator'

  /**
   * Report errors
   */
  function reportErrors () {
    errors.forEach(({node, closest}) => {
      let message = `Action key ${node.key.name} is invalid`
      if (closest) {
        message += `. Do you mean "${closest}"?`
      }
      context.report(node, message)
    })
  }

  function checkKeys (keys) {
    keys.forEach(prop => {
      if (prop.key.name === 'type') {
        context.report(prop, '\'type\' is specified bu should\'t')
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

module.exports.schema = [{
  type: 'string'
}]
