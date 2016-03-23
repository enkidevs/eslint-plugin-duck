import {RuleTester} from 'eslint'

import rule from '../src/rules/fsa-compliant'

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
`
    },
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
`
    },
    {
      code: `
duck.defineAction(ACTION_TYPE, {
  creator: function(message) {
    return {
      error: message,
      meta: {
        test: '1'
      }
    };
  },
});
`
    }
  ],

  invalid: [
    {
      code: `
duck.defineAction(ACTION_TYPE, {
  creator: function(message) {
    return {
      other_key: message,
      meta: {
        test: '1'
      }
    };
  },
});
`,
      errors: [{
        message: 'Action key \'other_key\' is invalid'
      }]
    }
  ]
})
