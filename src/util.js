function firstArgumentIsIdentifier (node) {
  return node.arguments.length && node.arguments[0].type === 'Identifier'
}

function secondArgumentIsObject (node) {
  return node.arguments.length && node.arguments[1].type === 'ObjectExpression'
}

exports.getPropertiesOfSecondArgumentOf = function (node) {
  return node.arguments.length && node.arguments[1].properties
}

exports.isDefineActionCall = function (node) {
  if (node.callee.type === 'MemberExpression') {
    const propertyName = node.callee.property.name
    if (propertyName === 'defineAction') {
      return firstArgumentIsIdentifier(node) && secondArgumentIsObject(node)
    }
  }
  return false
}
