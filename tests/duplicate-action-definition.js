import {RuleTester} from 'eslint'

import rule from '../src/rules/duplicate-action-definition'

const ruleTester = new RuleTester()

ruleTester.run('duplicate-action-definition', rule, {
  valid: [
    {
      code: `
module.exports.action = duck.defineAction(ACTION_TYPE, {});
`,
      args: 2
    },
    {
      code: `
module.exports.action = duck.defineAction(ACTION_TYPE, {});
module.exports.action2 = duck.defineAction(ACTION_TYPE_2, {});
`,
      args: 2
    },
    {
      code: ``,
      args: 2
    }
  ],

  invalid: [
    {
      code: `
module.exports.action = duck.defineAction(ACTION_TYPE, {});
module.exports.action = duck.defineAction(ACTION_TYPE, {});
`,
      args: 2,
      errors: [{
        message: 'The action ACTION_TYPE is already defined'
      }]
    }
  ]
})
