clear:
	rm -rf ./js-dist

dev: clear
	./node_modules/webpack/bin/webpack.js --watch

prod: clear

	NODE_ENV=production ./node_modules/webpack/bin/webpack.js
	git add .
	git commit . -m "build version"
