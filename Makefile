BIN=node_modules/.bin

MOCHA_ARGS= --compilers js:babel-register \
		--recursive \
		tests/*.js
MOCHA_TARGET=tests/*.js

build:
	$(BIN)/babel src --out-dir lib

clean:
	rm -rf lib

test: lint
	NODE_ENV=test $(BIN)/mocha $(MOCHA_ARGS) $(MOCHA_TARGET)

test-watch: lint
	NODE_ENV=test $(BIN)/mocha $(MOCHA_ARGS) -w $(MOCHA_TARGET)

lint:
	$(BIN)/eslint src && $(BIN)/eslint tests

PHONY: build clean test test-watch lint
