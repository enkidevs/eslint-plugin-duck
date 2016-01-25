import util from '../util'

/**
 * Get the methods order from the default config and the user config
 * @param {Object} defaultConfig The default configuration.
 * @param {Object} userConfig The user configuration.
 * @returns {Array} Methods order
 */
function getMethodsOrder (defaultConfig, userConfig) {
  userConfig = userConfig || {}

  const groups = {...defaultConfig.groups, ...userConfig.groups}
  const order = userConfig.order || defaultConfig.order

  let config = []
  order.forEach(entry => {
    if (groups.hasOwnProperty(entry)) {
      config = config.concat(groups[entry])
    } else {
      config.push(entry)
    }
  })

  return config
}

const MISPOSITION_MESSAGE = '{{propA}} should be placed {{position}} {{propB}}'

module.exports = function (context) {
  const errors = {}

  const methodsOrder = getMethodsOrder({
    order: [
      'creator',
      'reducers',
      'meta'
    ],
    groups: {
      reducers: [
        'reducer',
        'resolve',
        'reject'
      ],
      meta: [
        'redirect',
        'feedbackSuccess',
        'feedbackError'
      ]
    }
  }, context.options[0])

  const regExpRegExp = /\/(.*)\/([g|y|i|m]*)/

  /**
   * Get indexes of the matching patterns in methods order configuration
   * @param {String} method - Method name.
   * @returns {Array} The matching patterns indexes. Return [Infinity] if there is no match.
   */
  function getRefPropIndexes (method) {
    let matching
    const indexes = []
    methodsOrder.forEach((_method, i) => {
      let isRegExp = _method.match(regExpRegExp)
      if (isRegExp) {
        matching = new RegExp(isRegExp[1], isRegExp[2]).test(method)
      } else {
        matching = _method === method
      }
      if (matching) {
        indexes.push(i)
      }
    })

    // No matching pattern, return 'everything-else' index
    if (indexes.length === 0) {
      methodsOrder.forEach((_method, i) => {
        if (_method === 'everything-else') {
          indexes.push(i)
        }
      })
    }

    // No matching pattern and no 'everything-else' group
    if (indexes.length === 0) {
      indexes.push(Infinity)
    }

    return indexes
  }

  /**
   * Get properties name
   * @param {Object} node - Property.
   * @returns {String} Property name.
   */
  function getPropertyName (node) {
    return node.key.name
  }

  /**
   * Store a new error in the error list
   * @param {Object} propA - Mispositioned property.
   * @param {Object} propB - Reference property.
   */
  function storeError (propA, propB) {
    // Initialize the error object if needed
    if (!errors[propA.index]) {
      errors[propA.index] = {
        node: propA.node,
        score: 0,
        closest: {
          distance: Infinity,
          ref: {
            node: null,
            index: 0
          }
        }
      }
    }
    // Increment the prop score
    errors[propA.index].score++
    // Stop here if we already have a closer reference
    if (Math.abs(propA.index - propB.index) > errors[propA.index].closest.distance) {
      return
    }
    // Update the closest reference
    errors[propA.index].closest.distance = Math.abs(propA.index - propB.index)
    errors[propA.index].closest.ref.node = propB.node
    errors[propA.index].closest.ref.index = propB.index
  }

  /**
   * Dedupe errors, only keep the ones with the highest score and delete the others
   */
  function dedupeErrors () {
    Object.keys(errors).forEach(i => {
      const index = errors[i].closest.ref.index
      if (!errors[index]) {
        return
      }
      if (errors[i].score > errors[index].score) {
        delete errors[index]
      } else {
        delete errors[i]
      }
    })
  }

  /**
   * Report errors
   */
  function reportErrors () {
    dedupeErrors()

    Object.keys(errors).forEach(i => {
      const nodeA = errors[i].node
      const nodeB = errors[i].closest.ref.node
      const indexA = i
      const indexB = errors[i].closest.ref.index

      context.report(nodeA, MISPOSITION_MESSAGE, {
        propA: getPropertyName(nodeA),
        propB: getPropertyName(nodeB),
        position: indexA < indexB ? 'before' : 'after'
      })
    })
  }

  /**
   * Compare two properties and find out if they are in the right order
   * @param {Array} propertiesNames Array containing all the properties names.
   * @param {String} propA First property name.
   * @param {String} propB Second property name.
   * @returns {Object} Object containing a correct true/false flag and the correct indexes for the two properties.
   */
  function comparePropsOrder (propertiesNames, propA, propB) {
    // Get references indexes (the correct position) for given properties
    const refIndexesA = getRefPropIndexes(propA)
    const refIndexesB = getRefPropIndexes(propB)

    // Get current indexes for given properties
    const classIndexA = propertiesNames.indexOf(propA)
    const classIndexB = propertiesNames.indexOf(propB)

    let refIndexA
    let refIndexB

    // Loop around the references indexes for the 1st property
    for (let i = 0, j = refIndexesA.length; i < j; i++) {
      refIndexA = refIndexesA[i]

      // Loop around the properties for the 2nd property (for comparison)
      for (let k = 0, l = refIndexesB.length; k < l; k++) {
        refIndexB = refIndexesB[k]

        if (
          // Comparing the same properties
          refIndexA === refIndexB ||
          // 1st property is placed before the 2nd one in reference and in current component
          refIndexA < refIndexB && classIndexA < classIndexB ||
          // 1st property is placed after the 2nd one in reference and in current component
          refIndexA > refIndexB && classIndexA > classIndexB
        ) {
          return {
            correct: true,
            indexA: classIndexA,
            indexB: classIndexB
          }
        }
      }
    }

    // We did not find any correct match between reference and current component
    return {
      correct: false,
      indexA: refIndexA,
      indexB: refIndexB
    }
  }

  /**
   * Check properties order from a properties list and store the eventual errors
   * @param {Array} properties Array containing all the properties.
   */
  function checkPropsOrder (properties) {
    const propertiesNames = properties.map(getPropertyName)
    // Loop around the properties
    propertiesNames.forEach((propA, i) => {
      // Loop around the properties a second time (for comparison)
      propertiesNames.forEach((propB, j) => {
        // Compare the properties order
        let order = comparePropsOrder(propertiesNames, propA, propB)
        // Continue to next comparison is order is correct
        if (order.correct === true) {
          return
        }

        // Store an error if the order is incorrect
        storeError({
          node: properties[i],
          index: order.indexA
        }, {
          node: properties[j],
          index: order.indexB
        })
      })
    })
  }

  return {
    CallExpression (node) {
      if (!util.isDefineActionCall(node)) {
        return
      }
      const properties = util.getPropertiesOfSecondArgumentOf(node)
      checkPropsOrder(properties)
      reportErrors()
    }
  }
}

module.exports.schema = [{
  type: 'object',
  properties: {
    order: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    groups: {
      type: 'object',
      patternProperties: {
        '^.*$': {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    }
  },
  additionalProperties: false
}]
