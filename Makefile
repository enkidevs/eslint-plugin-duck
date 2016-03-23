include node_modules/@mathieudutour/js-fatigue/Makefile

MOCHA_ARGS= --compilers js:babel-register \
		--recursive \
		tests/*.js

test: lint
	NODE_ENV=test $(BIN_DIR)/mocha $(MOCHA_ARGS)

test-watch:
	NODE_ENV=test $(BIN_DIR)/mocha $(MOCHA_ARGS) -w tests/*.js
