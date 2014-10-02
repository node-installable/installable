This project is built with [webpack](http://webpack.github.io/), [less](http://lesscss.org/), [express](http://expressjs.com/), [gulp](http://gulpjs.com/) and [installable](https://www.npmjs.org/package/installable).
It is tested with [mocha](http://visionmedia.github.io/mocha/), [chai](http://chaijs.com/), [karma](http://karma-runner.github.io/) and [istanbul](http://gotwarlost.github.io/istanbul/).

## Developing
First `npm install`

Then run `gulp` and you are ready to go. Check all the gulp tasks in the gulp directory.

## Testing
Run `npm test` to test both back and front ends code or use the following gulp tasks:

`gulp server-common-spec` runs server and common (shared) specs

`gulp client-spec` runs client specs

Use `gulp tdd` if you want to develop and run specs on every file change

## Debugging
Install node-inspector
`npm install -g node-inspector`
and from the root of the project's directory run 
`node --debug server/src/`
and then in another terminal again from the root directory of the project run
`node-inspector`

You will see something like:
```
Node Inspector v0.7.4
Visit http://127.0.0.1:8080/debug?port=5858 to start debugging.
```
