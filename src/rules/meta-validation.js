import Fuse from 'fuse.js'
import {isDefineActionCall, getPropertiesOfSecondArgumentOf, findInProperties} from '../util'

module.exports = function (context) {
  const errors = []

  const metaKeys = context.options[0] || []
  const fuse = new Fuse(metaKeys.map(k => { return {k} }), {keys: ['k'], id: 'k'})
  const creatorName = context.options[1] || 'creator'

  /**
   * Report errors
   */
  function reportErrors () {
    errors.forEach(({node, closest}) => {
      let message = `Meta key \'${node.key.name}\' is invalid`
      if (closest) {
        message += `. Do you mean "${closest}"?`
      }
      context.report(node, message)
    })
  }

  function checkMetaKeys (meta) {
    meta.forEach(prop => {
      if (metaKeys.indexOf(prop.key.name) === -1) {
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
      action = action.argument
      const meta = findInProperties(action.properties, 'meta')
      if (!meta || meta.value.type !== 'ObjectExpression') {
        return
      }

      checkMetaKeys(meta.value.properties)
      reportErrors()
    }
  }
}

module.exports.schema = [{
  type: 'array',
  items: {
    type: 'string'
  }
}, {
  type: 'string'
}]
