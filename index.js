"use strict";

module.exports = {
    rules: {
        "no-unsafe-extend-inside-assignment": require("./lib/rules/no-unsafe-extend-inside-assignment"),
        "no-unsafe-extend-inside-call": require("./lib/rules/no-unsafe-extend-inside-call")
    },
    rulesConfig: {
        "no-unsafe-extend-inside-assignment": [2, { "libraryNames": ["_", "jQuery", "$"] }],
        "no-unsafe-extend-inside-call": [2, { "libraryNames": ["_", "jQuery", "$"] }]

    }
};
