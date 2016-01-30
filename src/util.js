function firstArgumentIsActionType (node) {
  return node.arguments.length && (node.arguments[0].type === 'Identifier' || node.arguments[0].type === 'Literal')
}

function secondArgumentIsObject (node) {
  return node.arguments.length && node.arguments[1].type === 'ObjectExpression'
}

export function findInProperties (properties, name) {
  return properties.find(property => property.key.name === name)
}

export function getPropertiesOfSecondArgumentOf (node) {
  return node.arguments.length && node.arguments[1].properties
}

export function getActionType (node) {
  return node.arguments.length && node.arguments[0]
}

export function isDefineActionCall (node) {
  if (node.callee.type === 'MemberExpression') {
    const propertyName = node.callee.property.name
    if (propertyName === 'defineAction') {
      return firstArgumentIsActionType(node) && secondArgumentIsObject(node)
    }
  }
  return false
}
