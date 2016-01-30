import {isDefineActionCall, getActionType} from '../util'

const DUPLICATE_MESSAGE = 'The action {{actionType}} is already defined'

module.exports = function (context) {
  const errors = []

  const alreadyDefined = {}

  /**
   * Report errors
   */
  function reportErrors () {
    errors.forEach(node => {
      context.report(node, DUPLICATE_MESSAGE, {
        actionType: node.value || node.name
      })
    })
  }

  return {
    Program (node) {
      node.body.forEach(child => {
        let actionDefinitionNode
        if (child.type === 'ExportNamedDeclaration') {
          actionDefinitionNode = child.declaration.declarations[0].init
        } else if (child.type === 'ExpressionStatement') {
          actionDefinitionNode = child.expression.right
        }

        if (!actionDefinitionNode || !isDefineActionCall(actionDefinitionNode)) {
          return
        }

        const actionTypeNode = getActionType(actionDefinitionNode)

        if (alreadyDefined[actionTypeNode.value || actionTypeNode.name]) {
          errors.push(actionTypeNode)
        } else {
          alreadyDefined[actionTypeNode.value || actionTypeNode.name] = 1
        }
      })
      reportErrors()
    }
  }
}

module.exports.schema = []
