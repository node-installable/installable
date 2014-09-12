/** @jsx React.DOM */
'use strict';

var React = require('react');

var App = require('./app.jsx');
var models = require('./models');

var installedModules = new models.Modules();
var searchResults = new models.SearchModules();

function render () {
    console.log('rendered');
    React.renderComponent(
        <App installedModules={installedModules} searchResults={searchResults} />,
        document.getElementById('app')
    );
}

render();

installedModules.on('add remove change', render);
searchResults.on('add remove change', render);

installedModules.fetch();
