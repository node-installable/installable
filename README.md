Installable provides a base for downloading, installing and building modular software from npm repositories.

It handles plugins that add code to the front end, back end or both and manages the installation process and the restart of the server.
It is build around npm, hapijs and webpack and focuses on Single Page Apps. 

usage

1. Start a new Installable application

installable app <application-name>
// creates a skeleton for your app

installable plugin <plugin-name> <application-name>
// creates a skeleton for your plugin
