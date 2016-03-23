import duplicateActionDefinition from './rules/duplicate-action-definition'
import fsaCompliant from './rules/fsa-compliant'
import metaValidation from './rules/meta-validation'
import missingCreator from './rules/missing-creator'
import noTypeInCreator from './rules/no-type-in-creator'
import propsOrder from './rules/props-order'

export const rules = {
  'duplicate-action-definition': duplicateActionDefinition,
  'fsa-compliant': fsaCompliant,
  'meta-validation': metaValidation,
  'missing-creator': missingCreator,
  'no-type-in-creator': noTypeInCreator,
  'props-order': propsOrder
}

export const configs = {
  'recommended': require('../config/recommended')
}
