# Installable
[![Build status](https://secure.travis-ci.org/node-installable/installable.svg?branch=master)](http://travis-ci.org/node-installable/installable)
Installable provides a base for Javascript apps with a npm based plugin manager.
It provides the conventions (and templates) for the apps and plugins and manages the installation process of the plugins via a HTTP API.

Installable enforces some conventions. It requires [express](http://expressjs.com/) for the back end and [webpack](http://webpack.github.io/) for the front end.
It uses [gulp](http://gulpjs.com/) as a task runner and focuses on Single Page Apps. 

## Installation

```
npm install -g installable
```

## Usage

```
$ installable -h

Usage: installable [options] [command]

  Commands:

    plugin <plugin-name> <application-name>
       Create new plugin

    app <application-name>
       Create new application


  Options:

    -h, --help      output usage information
    -V, --version   output the version number
    -s, --skip-npm  Skip npm check for name
```

#### Create a new Installable application

```
$ installable app <application-name>
// creates a skeleton for your app
$ cd <application-name>
$ npm install
$ npm install -g gulp
$ gulp // or gulp tdd
```

#### Create a plugin for an Installable application

```
$ installable plugin <plugin-name> <application-name>
// creates a skeleton for your plugin
$ cd <application-name>-plugin-<plugin-name>
$ npm install
$ npm install -g gulp
$ gulp // or gulp tdd
```

## Plugins
Plugins are npm modules and can add functionality to both ends (front/back).

The API that the plugins interact with the front end application is left to the author to define. 

In the backend the plugins can register scoped routes based on the plugin name and share properties of the express app.

Visit `/installable` path on your app to use the default plugin manager. This is just an example implementation.

## Notes
* This is still a work in progress (pre alpha) and currently lacks many must-have features for a complete plugin manager.
* Use [npm link](https://www.npmjs.org/doc/cli/npm-link.html) for plugins that are not yet published on npm.
* It can be used as a boiler template app generator for express, webpack, less, gulp, mocha, karma and istanbul. Just remove the installable dependency from the app template and start the express server yourself.
* It has nothing to do with [Installable Web Apps](http://w3c-webmob.github.io/installable-webapps/)
