export default {
  rules: {
    'duplicate-action-definition': require('./rules/duplicate-action-definition'),
    'meta-validation': require('./rules/meta-validation'),
    'missing-creator': require('./rules/missing-creator'),
    'props-order': require('./rules/props-order'),
    'fsa-compliant': require('./rules/fsa-compliant'),
    'no-type-in-creator': require('./rules/no-type-in-creator')
  },
  rulesConfig: {
    'duplicate-action-definition': 0,
    'meta-validation': 0,
    'missing-creator': 0,
    'props-order': 0,
    'fsa-compliant': 0,
    'no-type-in-creator': 0
  },
  configs: {
    'errors': require('../config/errors'),
    'warnings': require('../config/warnings')
  }
}
