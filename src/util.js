function firstArgumentIsActionType (node) {
  return node.arguments.length && (node.arguments[0].type === 'Identifier' || node.arguments[0].type === 'Literal')
}

function secondArgumentIsObject (node) {
  return node.arguments.length && node.arguments[1].type === 'ObjectExpression'
}

exports.getPropertiesOfSecondArgumentOf = function (node) {
  return node.arguments.length && node.arguments[1].properties
}

exports.getActionType = function (node) {
  return node.arguments.length && node.arguments[0]
}

exports.isDefineActionCall = function (node) {
  if (node.callee.type === 'MemberExpression') {
    const propertyName = node.callee.property.name
    if (propertyName === 'defineAction') {
      return firstArgumentIsActionType(node) && secondArgumentIsObject(node)
    }
  }
  return false
}
