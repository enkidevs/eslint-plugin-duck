import {RuleTester} from 'eslint'

import rule from '../src/rules/meta-validation'

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
  creator: function(message) {
    return {
      payload: message,
      meta: {
        test: '1'
      }
    };
  },
});
`,
      options: [['test']]
    }
  ],

  invalid: [
    {
      code: `
duck.defineAction(ACTION_TYPE, {
  creator: function(message) {
    return {
      payload: message,
      meta: {
        test: '1'
      }
    };
  },
});
`,
      errors: [{
        message: 'Meta key test is invalid'
      }]
    }
  ]
})
