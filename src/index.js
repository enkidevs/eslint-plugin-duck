module.exports = {
  rules: {
    'duplicate-action-definition': require('./rules/duplicate-action-definition'),
    'meta-validation': require('./rules/meta-validation'),
    'missing-creator': require('./rules/missing-creator'),
    'props-order': require('./rules/props-order')
  },
  rulesConfig: {
    'duplicate-action-definition': 0,
    'meta-validation': 0,
    'missing-creator': 0,
    'props-order': 0
  }
}
