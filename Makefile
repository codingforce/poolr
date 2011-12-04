default: test

test:
	@./node_modules/.bin/mocha --ui exports --reporter list test/*

.PHONY: test
