import {RuleTester} from 'eslint'

import rule from '../src/rules/no-type-in-creator'

const ruleTester = new RuleTester()

ruleTester.run('meta-validation', rule, {
  valid: [
    {
      code: `
duck.defineAction(ACTION_TYPE, {
  creator: function(message) {
    return {
      payload: message
    };
  },
});
`
    },
    {
      code: `
duck.defineAction(ACTION_TYPE, {
  creator: function(message) {
    return {
      payload: message,
      meta: {}
    };
  },
});
`
    },
    {
      code: `
duck.defineAction(ACTION_TYPE, {
  customCreatorKey: function(message) {
    return {
      payload: message,
      meta: {
        test: '1'
      }
    };
  },
});
`,
      options: [['customCreatorKey']]
    }
  ],

  invalid: [
    {
      code: `
duck.defineAction(ACTION_TYPE, {
  creator: function(message) {
    return {
      type: message,
      meta: {
        test: '1'
      }
    };
  },
});
`,
      errors: [{
        message: '\'type\' is specified bu should\'t'
      }]
    }
  ]
})
