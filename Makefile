#=============================================================================
# Makefile for testing BandwagonJS
#
#=============================================================================

# Disable verbosity
MAKEFLAGS += --silent


#=============================================================================
# Installation/setup rules


uninstall:
	@rm -rf node_modules
	@npm cache clean
.PHONY: uninstall

install:
	@npm install
	@npm rebuild
.PHONY: install



#=============================================================================
# Integration and unit test rules


test: lint test_server
.PHONY: test


# Test server functionality
MOCHAOPTS := --reporter mochawesome --reporter-options reportDir='./test/reports',reportName='index',reportTitle='BandwagonJS Test Results',inlineAssets=true

test_server:
	NODE_ENV=test node_modules/.bin/mocha ./test/spec/basic.js $(MOCHAOPTS)
.PHONY: test_server


lint:
	./node_modules/.bin/eslint --quiet .
.PHONY: lint


lint_fix:
	./node_modules/.bin/eslint --quiet --fix .
.PHONY: lint_fix






#=============================================================================
# Run the application and other scripts

# TBD
