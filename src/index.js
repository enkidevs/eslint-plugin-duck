export const rules = {
  'duplicate-action-definition': require('./rules/duplicate-action-definition'),
  'meta-validation': require('./rules/meta-validation'),
  'missing-creator': require('./rules/missing-creator'),
  'props-order': require('./rules/props-order'),
  'fsa-compliant': require('./rules/fsa-compliant'),
  'no-type-in-creator': require('./rules/no-type-in-creator')
}

export const configs = {
  'recommended': require('../config/recommended')
}
