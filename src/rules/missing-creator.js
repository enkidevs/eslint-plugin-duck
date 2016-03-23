import {isDefineActionCall, getPropertiesOfSecondArgumentOf, findInProperties} from '../util'

export default function (context) {
  const creatorName = context.options[0] || 'creator'

  return {
    CallExpression (node) {
      if (!isDefineActionCall(node)) {
        return
      }
      const properties = getPropertiesOfSecondArgumentOf(node)
      const creator = findInProperties(properties, creatorName)
      if (!creator) {
        context.report(node, 'Missing ' + creatorName + ' function')
      }
    }
  }
}

export const schema = [{
  type: 'string'
}]
