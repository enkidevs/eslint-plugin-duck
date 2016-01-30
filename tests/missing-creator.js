import {RuleTester} from 'eslint'

import rule from '../src/rules/missing-creator'

const ruleTester = new RuleTester()

ruleTester.run('missing-creator', rule, {
  valid: [
    {
      code: `
duck.defineAction(ACTION_TYPE, {
  creator: function(message) {
    return {payload: message};
  },
  reducer: function(state, action) {
    return Object.assign({}, state, {error: action.payload});
  },
});
`
    },
    {
      code: `
duck.defineAction(ACTION_TYPE, {
  creator: function(message) {
    return {payload: message};
  },
  reducer: function(state, action) {
    return Object.assign({}, state, {error: action.payload});
  },
  redirect: function() { return 'path/to/redirect'; }
});
`
    },
    {
      code: `
duck.defineAction(ACTION_TYPE, {
  creator: function(message) {
    return {payload: message};
  },
});
`
    }
  ],

  invalid: [
    {
      code: `
duck.defineAction(ACTION_TYPE, {
  reducer: function(state, action) {
    return Object.assign({}, state, {error: action.payload});
  },
});
`,
      errors: [{
        message: 'Missing creator function'
      }]
    }
  ]
})
