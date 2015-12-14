.PHONY: all test clean

default: help

help:
	@echo "   \033[35mmake\033[0m \033[1m命令使用说明\033[0m"
	@echo "   \033[35mmake install\033[0m\t---  安装依赖"
	@echo "   \033[35mmake clean\033[0m\t---  清除已经安装的依赖及缓存"
	@echo "   \033[35mmake build\033[0m\t---  仅 build（执行一些预编译，并生成目标文件）"
	@echo "   \033[35mmake dev\033[0m\t---  开发模式（在 build 的基础上 watch 文件变化并自动 build）"
	@echo "   \033[35mmake deploy\033[0m\t---  发布模式（在 build 的基础上压缩各种文件，并给文件添加 hash）"

build: install
	@rm -rf ./dist && npm run build

dev: install
	@npm run watch

deploy: install
	@npm run deploy; \
	make example

example:
	@cp dist/daterangepicker.min.js ghpages/dist && cd ghpages && git add .; \
	git commit -m "update ghpages" && git push origin gh-pages -f

test:
	@NODE_ENV=test node server.js

install:
	@hash="cache-daterangepicker-$$(cat Makefile package.json bower.json | openssl sha1 | tail -c33)"; \
	path="/tmp/$$hash"; \
	src="$$(pwd)"; \
	if [ -d $$path ] && [ -d $$path/node_modules ]; then \
	  if [ ! -d node_modules ]; then \
	    echo "\033[1mLoad\033[0m \033[35mnode_modules\033[0m from \033[32m$$hash\033[0m."; \
	    cp -R $$path/* $$src; \
	  fi; \
	else \
	  bower install; \
	  if which cnpm > /dev/null; then \
	    cnpm install; \
	  else \
	    npm install; \
	  fi; \
	  mkdir -p $$path; \
	  cp -R $$src/node_modules $$path; \
	fi; \
	if [ ! -d ghpages ]; then \
		git clone git@github.com:ElemeFE/daterangepicker.git --branch gh-pages ghpages; \
	fi

clean:
	@echo "正在清除 ... \c"
	@rm -rf {bower_components,node_modules,/tmp/cache-daterangepicker-*}
	@echo "\033[32m完成\033[0m"
