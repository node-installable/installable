Moog provides a base for downloading, installing and building modular software from npm repositories

it handles plugins that add code to the front end, back end or both and manages the installation process and the restart

usage

1. Start a new modular project

moog new project project_name  
// creates a skeleton for your project

moog new plugin name --project project_name
// creates a skeleton for your plugin

moog run project/server.js
// runs your modular app



API

var moog = new Moog();

moog.install(); // installs all dependencies
moog.start();
moog.stop();
var tempMoog = moog.cloneToPath(path);
tempMoog.install().start({port: 8001}).then(function () {
  tempMoog.test()
    .then(function () {
      moog.install().start();
    })
})


// plugins
moog.installPlugin(name);
moog.uninstallPlugin(name);
moog.enablePlugin(name);
moog.disablePlugin(name);