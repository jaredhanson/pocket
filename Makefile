NODE = node
TEST = vows
TESTS ?= test/*-test.js

test:
	@NODE_ENV=test NODE_PATH=lib $(TEST) $(TEST_FLAGS) $(TESTS)

docs: docs/api.html

docs/api.html: lib/pocket/*.js
	dox \
		--title Pocket \
		--desc "A simple, small, file system-based data store for Node.js." \
		$(shell find lib/pocket/* -type f) > $@

docclean:
	rm -f docs/*.{1,html}

.PHONY: test docs docclean
