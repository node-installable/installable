## Installable
Installable provides a base for Javascript apps with a npm based plugin manager.
It provides the conventions (and templates) for the apps and plugins and manages the installation process of the plugins.

Installable enforces some conventions. It requires [express](http://expressjs.com/) for the back end and [webpack](http://webpack.github.io/) for the front end.
It uses [gulp](http://gulpjs.com/) as a task runner and focuses on Single Page Apps. 


### Plugins
Plugins are npm modules and can add functionality to both ends (front/back).

The API that the plugins interact with the front end application is left to the author to define.

In the backend the plugins can register scoped routes based on the plugin name.

### Usage

#### Create a new Installable application

```
$ installable app <application-name>
// creates a skeleton for your app
$ cd <application-name>
$ npm install
$ npm install -g gulp
$ gulp
```

#### Create a plugin for an Installable application

```
$ installable plugin <plugin-name> <application-name>
// creates a skeleton for your plugin
```


Note: Installable has nothing to do with [Installable Web Apps](http://w3c-webmob.github.io/installable-webapps/)
