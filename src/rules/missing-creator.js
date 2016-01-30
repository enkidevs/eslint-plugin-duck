import util from '../util'

module.exports = function (context) {
  const creatorName = context.options[0] || 'creator'

  function getKeyName (property) {
    return property.key.name
  }

  return {
    CallExpression (node) {
      if (!util.isDefineActionCall(node)) {
        return
      }
      const properties = util.getPropertiesOfSecondArgumentOf(node)
      const creator = properties.find(property => getKeyName(property) === creatorName)
      if (!creator) {
        context.report(node, 'Missing ' + creatorName + ' function')
      }
    }
  }
}

module.exports.schema = [{
  type: 'string'
}]
