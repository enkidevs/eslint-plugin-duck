import {RuleTester} from 'eslint'

import rule from '../src/rules/props-order'

const ruleTester = new RuleTester()

ruleTester.run('props-order', rule, {
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
  redirect: function() { return 'path/to/redirect'; }
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
  creator: function(message) {
    return {payload: message};
  },
});
`,
      errors: [{
        message: 'reducer should be placed after creator'
      }]
    }
  ]
})
