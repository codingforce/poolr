NODE=`which node`
THIS_DIR=$(shell pwd)

default: test

test:
	expresso -I lib test/*

coverage:
	expresso -I lib --cov test/*

.PHONY: test
